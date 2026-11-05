#!/usr/bin/env bash
# 吉林大学体育馆预约系统 —— 一条命令下载并运行
#
# 用法（macOS / Linux）：
#   curl -fsSL https://raw.githubusercontent.com/xiaoyoumi9924/jlu-gym-frontend/main/scripts/quick-start.sh | bash
#
# 可选环境变量：
#   JLU_GYM_DIR     项目下载目录（默认 ./jlu-gym-frontend）
#   JLU_GYM_REPO_URL 仓库地址（默认 GitHub，可换成镜像）
#   JLU_GYM_OPEN=0  不自动打开浏览器
#   JLU_GYM_PORT    指定端口（默认 5173，被占用时 Vite 会自动换一个）

set -euo pipefail

REPO_URL="${JLU_GYM_REPO_URL:-https://github.com/xiaoyoumi9924/jlu-gym-frontend.git}"
CLONE_DIR="${JLU_GYM_DIR:-jlu-gym-frontend}"
OPEN_BROWSER="${JLU_GYM_OPEN:-1}"

if [ -t 1 ]; then
  C_RESET=$'\033[0m'
  C_INFO=$'\033[36m'
  C_OK=$'\033[32m'
  C_ERR=$'\033[31m'
else
  C_RESET=""
  C_INFO=""
  C_OK=""
  C_ERR=""
fi

info() { printf '%s%s%s\n' "$C_INFO" "$*" "$C_RESET"; }
ok() { printf '%s%s%s\n' "$C_OK" "$*" "$C_RESET"; }
die() {
  printf '%s错误：%s%s\n' "$C_ERR" "$*" "$C_RESET" >&2
  exit 1
}

command -v git >/dev/null 2>&1 || die "未找到 git，请先安装 Git：https://git-scm.com/downloads"
command -v node >/dev/null 2>&1 || die "未找到 Node.js，请先安装 Node.js 20.19+：https://nodejs.org/"
command -v npm >/dev/null 2>&1 || die "未找到 npm，请重新安装 Node.js：https://nodejs.org/"

# Vite 8 要求 Node.js ^20.19.0 或 >=22.12.0
node -e '
const [major, minor] = process.versions.node.split(".").map(Number)
const ok = (major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major > 22
if (!ok) {
  console.error("当前 Node.js 版本为 " + process.version + "，本项目需要 20.19+ 或 22.12+")
  process.exit(1)
}
' || die "请升级 Node.js 后重试：https://nodejs.org/"

is_project_dir() {
  [ -f "$1/package.json" ] &&
    grep -q '"name"[[:space:]]*:[[:space:]]*"jlu-gym-frontend"' "$1/package.json"
}

if is_project_dir "."; then
  TARGET="$(pwd)"
  info "已在项目目录中，跳过下载。"
elif [ -d "$CLONE_DIR/.git" ] && is_project_dir "$CLONE_DIR"; then
  TARGET="$CLONE_DIR"
  info "发现已下载的 ${CLONE_DIR}，正在更新到最新版本…"
  (cd "$TARGET" && git pull --ff-only) ||
    info "更新失败（可能有本地修改），继续使用当前版本。"
elif [ -e "$CLONE_DIR" ]; then
  die "目录 $CLONE_DIR 已存在但不是本项目。请换个目录：JLU_GYM_DIR=另一个目录名"
else
  info "正在下载项目到 $(pwd)/$CLONE_DIR …"
  clone_ok=0
  for attempt in 1 2 3; do
    if git clone --depth 1 "$REPO_URL" "$CLONE_DIR"; then
      clone_ok=1
      break
    fi
    rm -rf "$CLONE_DIR"
    info "下载失败，正在重试（$attempt/3）…"
    sleep 2
  done
  if [ "$clone_ok" -ne 1 ]; then
    info "改用 HTTP/1.1 再试一次…"
    if git -c http.version=HTTP/1.1 clone --depth 1 "$REPO_URL" "$CLONE_DIR"; then
      clone_ok=1
    else
      rm -rf "$CLONE_DIR"
    fi
  fi
  [ "$clone_ok" -eq 1 ] ||
    die "下载失败，请检查网络；也可以把 JLU_GYM_REPO_URL 换成镜像地址后重试。"
  TARGET="$CLONE_DIR"
fi

cd "$TARGET"

if [ ! -d node_modules ] ||
  [ package-lock.json -nt node_modules/.package-lock.json ] ||
  [ package.json -nt node_modules/.package-lock.json ]; then
  info "正在安装依赖（首次运行需要 1–3 分钟）…"
  npm install --no-audit --no-fund
else
  info "依赖已安装，跳过。"
fi

EXTRA_ARGS=""
if [ "$OPEN_BROWSER" != "0" ]; then
  EXTRA_ARGS="--open"
fi
if [ -n "${JLU_GYM_PORT:-}" ]; then
  EXTRA_ARGS="$EXTRA_ARGS --port $JLU_GYM_PORT"
fi

ok "启动开发服务器…（按 Ctrl+C 停止）"
if [ -r /dev/tty ] && [ -t 0 ]; then
  # 通过 curl | bash 运行时 stdin 是脚本内容，交给 npm 前换回终端
  npm run dev -- $EXTRA_ARGS < /dev/tty
else
  npm run dev -- $EXTRA_ARGS < /dev/null
fi
