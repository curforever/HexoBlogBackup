# curforever · Code & Notebook

[访问博客](https://curforever.github.io/) · [GitHub 主页](https://github.com/curforever)

Hexo 博客源码，收纳技术实践、阅读与播客笔记。首页提供精选入口；保留文章原有地址与发表时间。

## 内容与入口

- `source/index.html`：精选首页，使用独立样式，支持窄屏和深色模式。
- `source/_posts/`：104 篇文章，包含工程复盘、研究解释与历史阅读笔记。
- `source/about/index.md`：公开介绍，通过 GitHub Issues 联系。
- `content/research/`：中英文研究材料的版本化输入。
- `templates/`、`scripts/research-showcase.js`：离线生成中英文研究页、根 404 及旧分页兼容入口。
- `source/styles/`：首页、研究页和文章可读性样式。
- `_config.yml`：文章索引在 `/notes/`，根目录首页按原样输出。

## 本地维护

```sh
npm ci
npm run build
npm run server
```

修改首页精选条目时同步检查对应文章地址。源码已补齐 101 篇历史文章并恢复原发表、修改时间；新增 3 篇工程/研究文章与中英文研究图解。历史文章路径继续保留。

发布仍采用保留既有文件的增量方式；没有改写历史 Git 提交。研究原图在 `source/images/research/`，来源记录保留在素材索引中。


## 研究材料同步

研究主稿与原图在 [Profile 仓库](https://github.com/curforever/curforever/tree/main/research)。修改主稿并发布后，在此仓库同步明确版本：

```sh
npm run sync:research -- --ref <Profile提交SHA>
npm run build
```

同步命令先完整下载公开材料，再写入本地输入；记录解析后的提交 SHA。普通构建只读取版本化输入，不访问网络、不依赖本机 preview 目录或 GitHub 凭据。需要 Node.js 16 或更新版本。

`public/` 是构建产物。验证首页、研究中英切换、搜索和历史文章后再发布；源码仓库不提交 `public/`、`db.json` 与本机临时配置。

生成接口与错误页位置参考 [Hexo Generator](https://hexo.io/api/generator)、[GitHub Pages 404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)。

历史文章的 date / updated 使用上海本地时间（`YYYY-MM-DD HH:mm:ss`），避免 Hexo front-matter 对带时区时间的再次转换；修改正文时保留原 date。
