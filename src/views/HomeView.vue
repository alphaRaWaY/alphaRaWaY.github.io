<template>
  <section class="hero">
    <p class="eyebrow">alphaRaWaY.github.io</p>
    <h1>Personal Site + Cnblog Asset Host</h1>
    <p class="desc">
      This first version gives you a stable project foundation: Vue page structure for your
      homepage and independent static assets for Cnblog customization.
    </p>
  </section>

  <section class="grid">
    <article class="card">
      <h2>Current Goal</h2>
      <p>Build a maintainable frontend repo instead of editing large snippets in Cnblog backend.</p>
    </article>
    <article class="card">
      <h2>Vue Site</h2>
      <p>Use this app for your personal homepage, navigation, and future project showcase pages.</p>
    </article>
    <article class="card">
      <h2>Cnblog Assets</h2>
      <p>
        Keep Cnblog CSS/JS under <code>public/cnblog-assets</code>, then reference them from Cnblog
        via jsDelivr.
      </p>
    </article>
  </section>
</template>

<style scoped>
.hero {
  padding: 1.2rem 0 1.6rem;
}

.eyebrow {
  color: #0f766e;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

h1 {
  margin: 0 0 0.75rem;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
}

.desc {
  max-width: 70ch;
  color: #3f3f46;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 14px;
  padding: 1rem;
}

.card h2 {
  margin-top: 0;
  margin-bottom: 0.55rem;
  font-size: 1.05rem;
}
</style>
