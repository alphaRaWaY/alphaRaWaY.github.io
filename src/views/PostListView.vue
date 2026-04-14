<script setup lang="ts">
import { getAllPosts } from '../lib/posts'

const posts = getAllPosts()
</script>

<template>
  <section class="header">
    <h1>博客列表</h1>
    <p>以下内容来自项目根目录的 <code>posts/*.md</code>。</p>
  </section>

  <section v-if="posts.length" class="list">
    <article v-for="post in posts" :key="post.slug" class="item">
      <h2>
        <RouterLink :to="`/posts/${post.slug}`">{{ post.title }}</RouterLink>
      </h2>
      <p v-if="post.date" class="meta">{{ post.date }}</p>
      <p>{{ post.summary }}</p>
      <p v-if="post.tags.length" class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag"># {{ tag }}</span>
      </p>
    </article>
  </section>

  <section v-else class="empty">
    还没有文章。你可以先在 <code>posts/</code> 目录新增一个 <code>.md</code> 文件。
  </section>
</template>

<style scoped>
.header {
  margin-bottom: 1rem;
}

.list {
  display: grid;
  gap: 0.9rem;
}

.item {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 0.9rem;
}

.item h2 {
  margin: 0 0 0.4rem;
  font-size: 1.15rem;
}

.item a {
  color: #0f766e;
  text-decoration: none;
}

.item p {
  margin: 0;
  color: #52525b;
}

.meta {
  font-size: 0.86rem;
  color: #71717a !important;
  margin-bottom: 0.35rem !important;
}

.tags {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.55rem !important;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.8rem;
  color: #0f766e;
  background: #ecfeff;
  border: 1px solid #ccfbf1;
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
}

.empty {
  background: #fff;
  border: 1px dashed #d4d4d8;
  border-radius: 12px;
  padding: 1rem;
}
</style>
