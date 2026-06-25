# sync_admin.ps1 - build + sync + deploy
# Aborta se build falhar para nao pushar dist vazio (que apagaria o painel no Vercel)

$frontendDir = "C:\Users\x\Desktop\Work TP\Telepulse\painel_admin\frontend"
$dst = "C:\Users\x\Documents\Telepulse\lp\public\admin-current"
$lpDir = "C:\Users\x\Documents\Telepulse\lp"

# 1. Build
Write-Host ">> Building admin frontend..."
Push-Location $frontendDir
if (-not (Test-Path "node_modules")) {
    Write-Host "   node_modules ausente, rodando npm install..."
    npm install 2>&1 | Select-Object -Last 4
}
npm run build 2>&1 | Select-Object -Last 6
Pop-Location

$distFiles = @(Get-ChildItem "$frontendDir\dist" -Recurse -File -ErrorAction SilentlyContinue)
if ($distFiles.Count -eq 0) {
    Write-Host "ERRO: dist/ vazio - build falhou. Abortando sync."
    exit 1
}
Write-Host "   build OK: $($distFiles.Count) arquivos em dist/"

# 2. Sync dist -> public/admin
Write-Host ">> Sincronizando dist..."
if (Test-Path "$dst\assets") { Remove-Item "$dst\assets" -Recurse -Force }
Get-ChildItem $dst -File -ErrorAction SilentlyContinue | Remove-Item -Force
robocopy "$frontendDir\dist" $dst /E /NFL /NDL /NJH /NJS | Out-Null
$count = (Get-ChildItem $dst -Recurse -File).Count
Write-Host "   $count arquivos copiados"

if ($count -eq 0) {
    Write-Host "ERRO: public/admin/ ficou vazio. Abortando."
    exit 1
}

# 3. Git commit + push
Write-Host ">> Publicando no Vercel..."
Push-Location $lpDir
git add public/admin
$ts = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "sync admin [$ts]" 2>&1 | Select-Object -Last 2
git push 2>&1 | Select-Object -Last 3
Pop-Location

Write-Host ">> Pronto! Vercel vai deployar automaticamente."
