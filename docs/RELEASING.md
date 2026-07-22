# Release 发布流程

版本采用语义化编号：修复使用 `v1.0.1`，向后兼容的新功能使用 `v1.1.0`，不兼容更新使用 `v2.0.0`。

发布前运行：

```bash
pnpm test
pnpm build
pnpm test:e2e
```

更新 `CHANGELOG.md` 后提交代码，再创建带说明的标签与 GitHub Release：

```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main --follow-tags
gh release create v1.1.0 --title "v1.1.0" --notes-file release-notes.md
```
