# 使用说明

本包用于让 Codex 执行墨刀数控精密刀具商城的小程序到桌面网页端复刻。

## 文件

- `AGENTS.md`：复制到目标代码仓库根目录。
- `MASTER_PROMPT.md`：Codex 主任务规范。
- `.codex/config.toml`：项目建议配置，可按本机安全策略调整。
- `bootstrap.sh`：初始化 React、测试和 Playwright 环境。
- `tasks/`：阶段任务及门禁。
- `docs/templates/`：页面、交互、素材和进度模板。
- `scripts/`：参考采集、图片规范化和多视口截图脚本。

## 使用

```bash
mkdir precision-tools-web
cd precision-tools-web
git init
cp -R /path/to/codex_precision_tools_replication_pack/. .
./bootstrap.sh
codex --search --sandbox workspace-write --ask-for-approval on-request
```

然后将 `MASTER_PROMPT.md` 的内容交给 Codex，要求它先读 `AGENTS.md`。
