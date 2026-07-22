# 01 参考项目采集

目标：遍历所有页面、弹窗和状态。

执行：
1. 保存 DOM、文本、可访问性树、截图、网络日志。
2. 收集所有可交互元素。
3. BFS 遍历页面与状态；新截图哈希或新 DOM 指纹视为新状态。
4. 对 Canvas/热区原型使用坐标点击和截图变化检测。
5. 为每条路径保存操作序列。

输出：
- `reference/reference-manifest.json`
- `docs/page-matrix.csv`
- `docs/interaction-matrix.csv`
- `docs/reference-audit.md`

门禁：所有已发现入口均已访问，所有新状态均有截图。
