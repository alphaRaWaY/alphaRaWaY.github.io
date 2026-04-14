# alphaRaWaY.github.io

[English](./README.md) | [中文](./README-zh.md)

这个仓库同时承担两个目标：

1. 个人主页（Vue + Vite + TypeScript）
2. 博客园样式与脚本的静态资源托管

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 博客园资源目录

博客园相关资源位于：

- `public/cnblog-assets/css/main.css`
- `public/cnblog-assets/js/main.js`
- `public/words.txt`（点击台词词库）
- `public/cnblog-assets/legacy/*`（原始逻辑备份）
- `snippets/cnblog-header.html`
- `snippets/cnblog-footer.html`

建议在博客园后台仅保留外链引用，不再维护大段内联 CSS/JS。

## Posts 文章维护

项目会自动读取根目录 `posts/*.md`，并用第三方库渲染：

- `gray-matter`：解析 front matter
- `markdown-it`：渲染 Markdown 为 HTML

支持的 front matter 字段示例：

```md
---
title: 文章标题
date: 2026-04-14
tags:
  - Vue
  - 博客
summary: 列表页摘要
---
```

如果正文里写了 `<!--more-->`，会优先用它之前的内容作为摘要。

## 部署

`.github/workflows/deploy.yml` 会在 `main` 分支更新后自动部署 `dist/` 到 GitHub Pages。

为了兼容 GitHub Pages，本项目使用 hash 路由，示例：

```text
https://alpharaway.github.io/#/cnblog-kit
```

博客园生产环境建议使用固定 tag，而不是 `@main`，示例：

```html
https://cdn.jsdelivr.net/gh/alphaRaWaY/alphaRaWaY.github.io@v1.0.0/public/cnblog-assets/css/main.css
```

## 主题配置

可在博客园页首 HTML 中配置：

```html
<script>
  window.CNBLOG_THEME_CONFIG = {
    wordsUrl: "https://cdn.jsdelivr.net/gh/alphaRaWaY/alphaRaWaY.github.io@main/public/words.txt",
    neteasePlaylistId: "17737608590",
    enableMusic: true,
    playerTheme: "#2D8CF0"
  };
</script>
```

### 公告卡片图片清单

如果启用 `window.CNBLOG_THEME_CONFIG.notice`，建议准备三张图：

1. `coverImage`：顶部横幅图，建议 `1200x300` 或更宽
2. `avatarImage`：头像图，建议正方形 `400x400`
3. `qrcodeImage`：二维码图，建议正方形 `300x300`

建议把这些图片放到可长期访问的 HTTPS 地址（例如仓库 `public/` 后经 jsDelivr 分发）。
