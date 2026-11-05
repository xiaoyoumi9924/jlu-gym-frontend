# 吉林大学体育馆预约系统 —— 一条命令下载并运行（Windows PowerShell）
#
# 用法：
#   irm https://raw.githubusercontent.com/xiaoyoumi9924/jlu-gym-frontend/main/scripts/quick-start.ps1 | iex
#
# 可选环境变量：
#   JLU_GYM_DIR      项目下载目录（默认 .\jlu-gym-frontend）
#   JLU_GYM_REPO_URL 仓库地址（默认 GitHub，可换成镜像）
#   JLU_GYM_OPEN=0   不自动打开浏览器
#   JLU_GYM_PORT     指定端口（默认 5173）

$ErrorActionPreference = 'Stop'

$RepoUrl = if ($env:JLU_GYM_REPO_URL) { $env:JLU_GYM_REPO_URL } else { 'https://github.com/xiaoyoumi9924/jlu-gym-frontend.git' }
$CloneDir = if ($env:JLU_GYM_DIR) { $env:JLU_GYM_DIR } else { 'jlu-gym-frontend' }

function Write-Info($message) { Write-Host $message -ForegroundColor Cyan }
function Write-Ok($message) { Write-Host $message -ForegroundColor Green }
function Die($message) {
  Write-Host "错误：$message" -ForegroundColor Red
  throw "安装已停止，请根据上面的提示处理后重试。"
}

foreach ($command in @('git', 'node', 'npm')) {
  if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
    Die "未找到 ${command}，请先安装 Node.js（https://nodejs.org/）和 Git（https://git-scm.com/downloads）"
  }
}

$nodeVersion = (& node -p "process.versions.node").Trim()
$nodeParts = $nodeVersion.Split('.') | ForEach-Object { [int]$_ }
$nodeOk = ($nodeParts[0] -eq 20 -and $nodeParts[1] -ge 19) -or
  ($nodeParts[0] -eq 22 -and $nodeParts[1] -ge 12) -or
  ($nodeParts[0] -gt 22)
if (-not $nodeOk) {
  Die "当前 Node.js 版本为 ${nodeVersion}，本项目需要 20.19+ 或 22.12+，请升级后重试：https://nodejs.org/"
}

function Test-ProjectDir($path) {
  $packageJson = Join-Path $path 'package.json'
  if (-not (Test-Path $packageJson)) { return $false }
  try {
    return (Get-Content $packageJson -Raw | ConvertFrom-Json).name -eq 'jlu-gym-frontend'
  } catch {
    return $false
  }
}

if (Test-ProjectDir '.') {
  $Target = (Get-Location).Path
  Write-Info '已在项目目录中，跳过下载。'
} elseif ((Test-Path (Join-Path $CloneDir '.git')) -and (Test-ProjectDir $CloneDir)) {
  $Target = (Resolve-Path $CloneDir).Path
  Write-Info "发现已下载的 ${CloneDir}，正在更新到最新版本…"
  git -C $Target pull --ff-only
  if ($LASTEXITCODE -ne 0) {
    Write-Info '更新失败（可能有本地修改），继续使用当前版本。'
  }
} elseif (Test-Path $CloneDir) {
  Die "目录 $CloneDir 已存在但不是本项目。请换个目录：`$env:JLU_GYM_DIR = '另一个目录名'"
} else {
  Write-Info "正在下载项目到 $CloneDir …"
  $cloneOk = $false
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    git clone --depth 1 $RepoUrl $CloneDir
    if ($LASTEXITCODE -eq 0) { $cloneOk = $true; break }
    Remove-Item $CloneDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Info "下载失败，正在重试（$attempt/3）…"
    Start-Sleep -Seconds 2
  }
  if (-not $cloneOk) { Die '下载失败，请检查网络；也可以把 JLU_GYM_REPO_URL 换成镜像地址后重试。' }
  $Target = (Resolve-Path $CloneDir).Path
}

Set-Location $Target

if (-not (Test-Path 'node_modules')) {
  Write-Info '正在安装依赖（首次运行需要 1–3 分钟）…'
  npm install --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { Die '依赖安装失败，请检查网络后重试。' }
} else {
  Write-Info '依赖已安装，跳过。'
}

$devArgs = @()
if ($env:JLU_GYM_OPEN -ne '0') { $devArgs += '--open' }
if ($env:JLU_GYM_PORT) { $devArgs += '--port'; $devArgs += $env:JLU_GYM_PORT }

Write-Ok '启动开发服务器…（按 Ctrl+C 停止）'
& npm run dev -- @devArgs
