# alphaRaWaY.github.io

[English](./README.md) | [中文](./README-zh.md)

This repository serves two goals:

1. Personal homepage (Vue + Vite + TypeScript)
2. Static CSS/JS hosting for Cnblog customization

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Cnblog assets

Cnblog assets are in:

- `public/cnblog-assets/css/main.css`
- `public/cnblog-assets/js/main.js`
- `public/words.txt`
- `public/cnblog-assets/legacy/*` (original logic backup)
- `snippets/cnblog-header.html`
- `snippets/cnblog-footer.html`

In Cnblog backend, keep only external references and avoid maintaining long inline scripts.

## Posts

The app auto-loads `posts/*.md` and renders with:

- `gray-matter` for front matter parsing
- `markdown-it` for Markdown rendering

Front matter example:

```md
---
title: Post Title
date: 2026-04-14
tags:
  - Vue
  - Blog
summary: Summary text for list page
---
```

If the content includes `<!--more-->`, text before it is used as the summary first.

## Deployment

The workflow file `.github/workflows/deploy.yml` deploys `dist/` to GitHub Pages on push to `main`.

This site uses hash routing for GitHub Pages compatibility. Example:

```text
https://alpharaway.github.io/#/cnblog-kit
```

For production Cnblog external links, prefer fixed tags over `@main`, for example:

```html
https://cdn.jsdelivr.net/gh/alphaRaWaY/alphaRaWaY.github.io@v1.0.0/public/cnblog-assets/css/main.css
```
