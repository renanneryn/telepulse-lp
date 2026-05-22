# sync_admin.ps1 — Sincroniza o painel admin compilado para a LP
# Uso: .\sync_admin.ps1
# Depois de rodar: faça o deploy da LP no Vercel

$src = "C:\Users\x\Desktop\Work TP\Telepulse\painel_admin\frontend"
$dst = "C:\Users\x\Documents\Telepulse\lp\public\admin"

Write-Host ">> Building admin frontend..."
Push-Location $src
npm run build 2>&1 | Select-Object -Last 5
Pop-Location

Write-Host ">> Copying dist to LP..."
if (Test-Path "$dst\assets") { Remove-Item "$dst\assets" -Recurse -Force }
Get-ChildItem $dst -File | Remove-Item -Force
robocopy "$src\dist" $dst /E /NFL /NDL /NJH /NJS | Out-Null

$files = Get-ChildItem $dst -Recurse | Where-Object { !$_.PSIsContainer }
Write-Host ">> Done. $($files.Count) arquivos em public/admin:"
$files | ForEach-Object { "   " + $_.Name }
Write-Host ""
Write-Host "Agora faca o deploy da LP no Vercel para aplicar as mudancas."
