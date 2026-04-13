<script setup lang="ts">
const scriptClose = '</' + 'script>'
const headerSnippet = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/alphaRaWaY/alphaRaWaY.github.io@main/public/cnblog-assets/css/main.css?v=20260413">
<script src="https://cdn.jsdelivr.net/gh/alphaRaWaY/alphaRaWaY.github.io@main/public/cnblog-assets/js/main.js?v=20260413" defer>${scriptClose}`
</script>

<template>
  <section>
    <h1>Cnblog Kit</h1>
    <p class="lead">
      First version keeps Cnblog integration very thin: only external links in Cnblog backend,
      while actual code stays in this repo.
    </p>
  </section>

  <section class="card">
    <h2>Directory</h2>
    <pre><code>public/
  cnblog-assets/
    css/main.css
    js/main.js
snippets/
  cnblog-header.html
  cnblog-footer.html</code></pre>
  </section>

  <section class="card">
    <h2>Header Snippet (copy to Cnblog)</h2>
    <pre><code>{{ headerSnippet }}</code></pre>
  </section>

  <section class="card">
    <h2>Notes</h2>
    <ul>
      <li>Use HTTPS links only.</li>
      <li>Prefer version tags instead of <code>@main</code> for production.</li>
      <li>Keep footer html empty in first version unless you need static markup.</li>
    </ul>
  </section>
</template>

<style scoped>
h1 {
  margin-bottom: 0.5rem;
}

.lead {
  color: #3f3f46;
  margin-bottom: 1rem;
}

.card {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 0.9rem;
}

pre {
  margin: 0;
  overflow-x: auto;
  background: #0b1020;
  color: #d8e3ff;
  border-radius: 10px;
  padding: 0.85rem;
}

ul {
  margin: 0;
  padding-left: 1.1rem;
}
</style>
