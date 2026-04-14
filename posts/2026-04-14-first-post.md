---
title: 我的第一篇本地维护文章
date: 2026-04-14
tags:
  - 建站
  - Vue
summary: 这是放在 posts 目录中的第一篇文章，用于验证列表页与详情页渲染。
---

这是一篇放在项目 `posts/` 目录中的 Markdown 文件。

## 为什么这样做

- 文章和前端代码在同一个仓库统一维护
- 可以用 Git 做版本管理
- 后续可以方便地接入自动目录、标签与搜索

## 下一步计划

1. 增加文章日期和标签元信息
2. 增加上一页 / 下一页导航
3. 增加更完整的 Markdown 渲染能力

```ts
const message = 'Hello from posts/*.md'
console.log(message)
```
