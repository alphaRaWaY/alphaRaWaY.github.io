<template>
  <section>
    <h1>Cnblog Kit</h1>
    <p class="lead">
      Keep Cnblog backend light. Maintain CSS/JS in this repo and only paste external links in
      Cnblog header html.
    </p>
  </section>

  <section class="card">
    <h2>Use These Files</h2>
    <pre><code>snippets/cnblog-header.html
snippets/cnblog-footer.html
public/cnblog-assets/css/main.css
public/cnblog-assets/js/main.js
public/words.txt</code></pre>
  </section>

  <section class="card">
    <h2>Routing Note</h2>
    <p>
      GitHub Pages does not provide history-mode fallback by default. This site uses hash routing,
      so the Cnblog page is:
    </p>
    <pre><code>https://alpharaway.github.io/#/cnblog-kit</code></pre>
  </section>

  <section class="card">
    <h2>Production Tip</h2>
    <p>
      For Cnblog external links, prefer a fixed release tag (for example <code>@v1.0.0</code>)
      instead of <code>@main</code>.
    </p>
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
</style>
