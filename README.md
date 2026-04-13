# alphaRaWaY.github.io

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
- `snippets/cnblog-header.html`
- `snippets/cnblog-footer.html`

In Cnblog backend, keep only external references and avoid maintaining long inline scripts.

## Deployment

The workflow file `.github/workflows/deploy.yml` deploys `dist/` to GitHub Pages on push to `main`.

For production Cnblog external links, prefer fixed tags over `@main`, for example:

```html
https://cdn.jsdelivr.net/gh/alphaRaWaY/alphaRaWaY.github.io@v1.0.0/public/cnblog-assets/css/main.css
```
