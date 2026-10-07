# curforever · Code & Notebook

[访问博客](https://curforever.github.io/) · [GitHub 主页](https://github.com/curforever)

Hexo 博客源码，收纳技术实践、阅读与播客笔记。首页提供精选入口；保留文章原有地址与发表时间。

## 内容与入口

- `source/index.html`：精选首页，使用独立样式，支持窄屏和深色模式。
- `source/_posts/`：历史文章，含阅读摘录与个人记录。
- `source/about/index.md`：公开介绍，通过 GitHub Issues 联系。
- `_config.yml`：文章索引在 `/notes/`，根目录首页按原样输出。

## 本地维护

```sh
npm ci
npm run build
npm run server
```

修改首页精选条目时同步检查对应文章地址。当前公开站点保留 101 篇历史文章，而源码包含 89 篇 Markdown 文章；直接全量覆盖部署前应先补齐差异，避免遗漏现有文章。

本轮更新采用保留既有文件的增量发布；未改动历史 Git 提交。
