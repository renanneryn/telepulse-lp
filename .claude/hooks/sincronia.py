# -*- coding: utf-8 -*-
"""Sincronia PC <-> celular: o GitHub é a única coisa que as duas pontas enxergam.

Hooks do Claude Code (mesmo arquivo no PC e em cada repositório, só biblioteca padrão):
  python sincronia.py inicio   SessionStart: fetch, fast-forward seguro e o estado de cada repo
  python sincronia.py fim      Stop: cobra (uma vez por mudança) o que ficou sem commit ou sem push

Se a pasta do projeto é um repositório, olha só ele (sessão do celular ou do VS Code dentro do
projeto). Se não é (raiz de `projects` no PC), olha os repositórios com `origin` em `main/`.
Nunca imprime conteúdo de arquivo nem valor de variável.
"""
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

RAIZ = Path(os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd())
IGNORAR_PASTAS = {"node_modules", ".venv", "venv", "__pycache__", "arquivados", ".git"}
DIAS_BRANCH_RECENTE = 14

REGRAS = """[sincronia] PC e celular só compartilham o GitHub: o que não tem commit e push não existe para o outro lado.
1. Antes de mexer num repo, veja abaixo as branches de outras sessões. Se uma for do mesmo assunto, continue nela.
2. Uma branch por tarefa, criada da base atualizada. Commit e push a cada passo que funciona, não só no fim.
3. A base (main; dev no TelePulse) só muda por PR. Deploy só com a base local igual à do GitHub, pelo script do projeto e com pedido do dono.
4. Não termine com mudança sem commit nem commit sem push: o hook de fim cobra."""


def git(repo, *args, timeout=30, cru=False):
    r = subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True,
                       encoding="utf-8", errors="replace", timeout=timeout)
    return r.returncode, (r.stdout if cru else r.stdout.strip())


def repos():
    if (RAIZ / ".git").exists():
        return [RAIZ]
    achados = []
    base = RAIZ / "main" if (RAIZ / "main").is_dir() else RAIZ
    for atual, pastas, _ in os.walk(base):
        p = Path(atual)
        if len(p.relative_to(base).parts) > 4:
            pastas[:] = []
            continue
        # só o clone principal: worktree ligado tem .git como arquivo
        if (p / ".git").is_dir() and git(p, "remote", "get-url", "origin")[0] == 0:
            achados.append(p)
        pastas[:] = [d for d in pastas if d not in IGNORAR_PASTAS and not d.startswith(".")]
    return sorted(achados)


def nome(repo):
    return "." if repo == RAIZ else repo.relative_to(RAIZ).as_posix()


def base_remota(repo):
    rc, ref = git(repo, "symbolic-ref", "--short", "refs/remotes/origin/HEAD")
    if rc == 0 and ref:
        return ref
    return "origin/main" if git(repo, "rev-parse", "-q", "--verify", "origin/main")[0] == 0 else ""


def estado(repo, buscar):
    e = {"repo": nome(repo), "avisos": []}
    if buscar:
        try:
            rc, _ = git(repo, "fetch", "-q", "--prune", "origin", timeout=40)
            if rc:
                e["avisos"].append("fetch falhou (sem rede ou sem acesso)")
        except subprocess.TimeoutExpired:
            e["avisos"].append("fetch demorou demais")
    e["branch"] = git(repo, "branch", "--show-current")[1] or "(HEAD solto)"
    # sem strip: a 1ª coluna do porcelain pode ser espaço (" M arq")
    e["sujos"] = [l[3:] for l in git(repo, "status", "--porcelain", cru=True)[1].splitlines() if l.strip()]
    rc, up = git(repo, "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}")
    e["upstream"] = up if rc == 0 else ""
    if e["upstream"]:
        e["frente"] = int(git(repo, "rev-list", "--count", "@{u}..HEAD")[1] or 0)
        e["atras"] = int(git(repo, "rev-list", "--count", "HEAD..@{u}")[1] or 0)
    else:
        e["frente"] = int(git(repo, "rev-list", "--count", "HEAD", "--not", "--remotes=origin")[1] or 0)
        e["atras"] = 0
    e["base"] = base_remota(repo)
    return e


def fast_forward(repo, e):
    """Atualiza sozinho só quando não há como perder nada: árvore limpa, nada local, só atrás."""
    if e["upstream"] and not e["sujos"] and e["frente"] == 0 and e["atras"] > 0:
        rc, _ = git(repo, "merge", "--ff-only", "-q", "@{u}")
        if rc == 0:
            e["avisos"].append(f"atualizado agora: +{e['atras']} commit(s) do GitHub (fast-forward)")
            e["atras"] = 0
        else:
            e["avisos"].append("não consegui atualizar sozinho (fast-forward recusado)")


def branches_de_outras_sessoes(repo, e):
    if not e["base"]:
        return []
    limite = time.time() - DIAS_BRANCH_RECENTE * 86400
    _, saida = git(repo, "for-each-ref", "refs/remotes/origin", "--no-merged", e["base"],
                   "--format=%(refname:short)|%(committerdate:unix)|%(committerdate:relative)")
    fora = {e["base"], e["upstream"], "origin/HEAD", "origin/dev", "origin"}
    lista = []
    for linha in saida.splitlines():
        ref, quando, relativo = (linha.split("|") + ["", "", ""])[:3]
        if ref in fora or ref.startswith("origin/dependabot/") or not quando.isdigit():
            continue
        if int(quando) >= limite:
            lista.append(f"{ref.removeprefix('origin/')} ({relativo})")
    return lista


def inicio():
    alvos = repos()
    if not alvos:
        return
    with ThreadPoolExecutor(max_workers=8) as ex:
        estados = list(ex.map(lambda r: estado(r, True), alvos))
    linhas = [REGRAS, ""]
    for repo, e in zip(alvos, estados):
        fast_forward(repo, e)
        partes = [f"{e['repo']}: branch {e['branch']}"]
        if e["sujos"]:
            partes.append(f"{len(e['sujos'])} arquivo(s) sem commit")
        if e["frente"]:
            partes.append(f"{e['frente']} commit(s) sem push")
        if e["atras"]:
            partes.append(f"{e['atras']} commit(s) atrás do GitHub")
        if not (e["sujos"] or e["frente"] or e["atras"]):
            partes.append("em dia com o GitHub")
        # branch permanente (base ou dev) acompanha a base por release, não é "branch atrasada"
        if e["base"] and e["branch"] not in (e["base"].removeprefix("origin/"), "dev"):
            n = git(repo, "rev-list", "--count", f"HEAD..{e['base']}")[1]
            if n and n != "0":
                partes.append(f"{e['base']} andou {n} commit(s) desde esta branch")
        outras = branches_de_outras_sessoes(repo, e)
        if outras:
            partes.append("branches abertas no GitHub: " + ", ".join(outras[:6]))
        linhas.append("- " + "; ".join(partes + e["avisos"]))
    print("\n".join(linhas))


def fim():
    try:
        entrada = json.loads(sys.stdin.read() or "{}")
    except ValueError:
        entrada = {}
    if entrada.get("stop_hook_active"):
        return
    pendentes = []
    for repo in repos():
        e = estado(repo, False)
        if e["sujos"] or e["frente"]:
            itens = []
            if e["sujos"]:
                itens.append(f"{len(e['sujos'])} sem commit (" + ", ".join(e["sujos"][:5]) + ")")
            if e["frente"]:
                itens.append(f"{e['frente']} commit(s) sem push")
            pendentes.append(f"{e['repo']} [{e['branch']}]: " + "; ".join(itens))
    sessao = entrada.get("session_id") or "sem-id"
    marca = Path(tempfile.gettempdir()) / f"sincronia-{hashlib.sha1(str(RAIZ).encode()).hexdigest()[:10]}-{sessao}.txt"
    assinatura = hashlib.sha1("\n".join(pendentes).encode()).hexdigest()
    try:
        anterior = marca.read_text(encoding="utf-8")
    except OSError:
        anterior = ""
    if not pendentes or assinatura == anterior:
        return
    try:
        marca.write_text(assinatura, encoding="utf-8")
    except OSError:
        pass
    motivo = (
        "Sincronia: o outro lado (PC/celular) não vê este trabalho:\n- " + "\n- ".join(pendentes) +
        "\nSe foi esta sessão que mudou: commit numa branch de tarefa (nunca na base) e push. "
        "Se é de outra sessão aberta, ou é arquivo local que não vai para o git (banco, backup), "
        "não commite: diga isso ao dono em uma linha. Este aviso não se repete enquanto a lista não mudar."
    )
    print(json.dumps({"decision": "block", "reason": motivo}, ensure_ascii=False))


if __name__ == "__main__":
    {"inicio": inicio, "fim": fim}.get(sys.argv[1] if len(sys.argv) > 1 else "", lambda: None)()
