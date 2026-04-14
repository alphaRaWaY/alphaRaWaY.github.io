<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPostBySlug } from '../lib/posts'

const route = useRoute()

const post = computed(() => {
  const slug = String(route.params.slug ?? '')
  return getPostBySlug(slug)
})
</script>

<template>
  <article v-if="post" class="post">
    <header class="post-header">
      <RouterLink class="back" to="/posts">← 返回列表</RouterLink>
      <h1>{{ post.title }}</h1>
      <p v-if="post.date" class="meta">{{ post.date }}</p>
      <p v-if="post.tags.length" class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag"># {{ tag }}</span>
      </p>
    </header>
    <section class="post-content" v-html="post.html" />
  </article>

  <section v-else class="not-found">
    <h1>文章不存在</h1>
    <p>请检查链接，或返回列表重新选择。</p>
    <RouterLink class="back" to="/posts">返回列表</RouterLink>
  </section>
</template>

<style scoped>
.post-header {
  margin-bottom: 0.9rem;
}

.back {
  color: #0f766e;
  text-decoration: none;
  font-weight: 600;
}

.meta {
  margin: 0.25rem 0;
  color: #71717a;
}

.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin: 0.3rem 0 0;
}

.tag {
  font-size: 0.8rem;
  color: #0f766e;
  background: #ecfeff;
  border: 1px solid #ccfbf1;
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
}

.post-content {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 1.1rem;
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.post-content :deep(p) {
  margin: 0.5rem 0;
  color: #27272a;
}

.post-content :deep(blockquote) {
  margin: 0.85rem 0;
  padding: 0.65rem 0.9rem;
  border-left: 4px solid #0f766e;
  background: #f0fdfa;
  color: #0f172a;
  border-radius: 0 10px 10px 0;
}

.post-content :deep(blockquote p) {
  margin: 0.35rem 0;
  color: #0f172a;
}

.post-content :deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
}

.post-content :deep(pre) {
  overflow-x: auto;
  background: #0b1020;
  color: #d8e3ff;
  border-radius: 10px;
  padding: 0.8rem;
}

.post-content :deep(code) {
  font-family: 'Cascadia Code', Consolas, monospace;
}

.post-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.post-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.8rem 0;
  display: block;
  overflow-x: auto;
}

.post-content :deep(th),
.post-content :deep(td) {
  border: 1px solid #e4e4e7;
  padding: 0.45rem 0.6rem;
  text-align: left;
}

.post-content :deep(.katex-display) {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.25rem 0;
}

.not-found {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 1.1rem;
}
</style>
