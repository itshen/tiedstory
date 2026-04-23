#!/usr/bin/env bash
set -euo pipefail

# ── TiedStory 一键部署脚本 ──
# 用法: ./deploy.sh          (默认: push + 服务器拉取 + 重启)
#       ./deploy.sh --restart (仅重启服务，不 push/pull)
#       ./deploy.sh --pull    (仅拉取代码，不重启)

SERVER_IP="43.163.82.143"
SERVER_USER="ubuntu"
SERVER_PASS="Itshen369*"
PROJECT_DIR="/var/www/tiedstory"
PYTHON="./venv/bin/python3.11"
PORT=8888

ssh_cmd() {
    sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "${SERVER_USER}@${SERVER_IP}" "$1"
}

do_push() {
    echo "==> [1/3] git push origin main ..."
    git push origin main
    echo "    ✓ push 完成"
}

do_pull() {
    echo "==> [2/3] 服务器 git pull ..."
    ssh_cmd "cd ${PROJECT_DIR} && git pull origin main"
    echo "    ✓ pull 完成"
}

do_restart() {
    echo "==> [3/3] 重启服务 (port=${PORT}) ..."
    ssh_cmd "
        pid=\$(lsof -ti :${PORT} 2>/dev/null || true)
        if [ -n \"\$pid\" ]; then
            kill -9 \$pid 2>/dev/null || true
            echo \"    killed old pid: \$pid\"
            sleep 1
        fi
        cd ${PROJECT_DIR}
        nohup ${PYTHON} main.py > app.log 2>&1 &
        sleep 3
        new_pid=\$(lsof -ti :${PORT} 2>/dev/null || true)
        if [ -n \"\$new_pid\" ]; then
            echo \"    ✓ 服务已启动 pid=\$new_pid\"
            tail -3 app.log
        else
            echo \"    ✗ 启动失败，日志:\"
            tail -20 app.log
            exit 1
        fi
    "
}

case "${1:-}" in
    --restart)
        do_restart
        ;;
    --pull)
        do_pull
        ;;
    *)
        do_push
        do_pull
        do_restart
        ;;
esac

echo ""
echo "==> 部署完成 ✓"
