<template>
  <section class="hero">
    <p class="eyebrow">alphaRaWaY Blog</p>
    <h1>你好，我是 alphaRaWaY</h1>
    <p class="desc">
      这里是我的个人主页。这个站点同时负责博客文章展示，以及博客园样式脚本的资源托管。
    </p>
    <div class="actions">
      <RouterLink class="btn" to="/posts">查看全部文章</RouterLink>
      <RouterLink class="btn ghost" to="/cnblog-kit">Cnblog Kit</RouterLink>
    </div>
  </section>

  <section class="grid">
    <article class="card">
      <h2>个人主页</h2>
      <p>用于展示个人介绍、项目入口和站点导航。</p>
    </article>
    <article class="card">
      <h2>博客总列表</h2>
      <p>统一展示你在 `posts/` 目录维护的 Markdown 文章。</p>
    </article>
    <article class="card">
      <h2>文章详情页</h2>
      <p>
        点击列表项进入文章详情，页面自动渲染 Markdown 内容。
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

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  background: #0f766e;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

.btn.ghost {
  background: #fff;
  border: 1px solid #d4d4d8;
  color: #111827;
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
