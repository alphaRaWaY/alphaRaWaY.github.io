import MarkdownIt from 'markdown-it'
import texmath from 'markdown-it-texmath'
import katex from 'katex'

export type BlogPost = {
  slug: string
  title: string
  summary: string
  date?: string
  tags: string[]
  html: string
}

const modules = import.meta.glob('../../posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const mdFallback = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

md.use(texmath, {
  engine: katex,
  delimiters: 'dollars',
  katexOptions: { throwOnError: false },
})

type FrontMatter = {
  title?: string
  date?: string
  summary?: string
  tags?: string[]
}

type ParsedMarkdown = {
  data: FrontMatter
  content: string
  excerpt?: string
}

const postAssetModules = import.meta.glob('../../posts/**/*.{png,jpg,jpeg,gif,webp,svg,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function isExternalUrl(src: string): boolean {
  return /^(https?:)?\/\//i.test(src) || src.startsWith('data:') || src.startsWith('#')
}

function normalizePath(path: string): string {
  return path.replaceAll('\\', '/')
}

function resolveRelativePath(baseFilePath: string, relativePath: string): string {
  const baseParts = normalizePath(baseFilePath).split('/').slice(0, -1)
  const relParts = normalizePath(relativePath).split('/')
  const stack = [...baseParts]

  for (const part of relParts) {
    if (!part || part === '.') continue
    if (part === '..') {
      if (stack.length) stack.pop()
      continue
    }
    stack.push(part)
  }
  return stack.join('/')
}

function resolveImageUrl(rawSrc: string, postPath: string): string {
  const src = rawSrc.trim()
  if (!src || isExternalUrl(src) || src.startsWith('/')) return src

  const cleanSrc = src.split('?')[0].split('#')[0]
  const resolvedPath = resolveRelativePath(postPath, cleanSrc)
  return postAssetModules[resolvedPath] || src
}

function rewriteImageSrcForHtml(html: string, postPath: string): string {
  return html.replace(/<img\b([^>]*?)\bsrc=(['"])(.*?)\2([^>]*)>/gi, (_, pre, quote, src, post) => {
    const resolved = resolveImageUrl(src, postPath)
    const attrs = `${pre}${post}`
    const hasLoading = /\bloading\s*=/i.test(attrs)
    const hasDecoding = /\bdecoding\s*=/i.test(attrs)
    const hasReferrerPolicy = /\breferrerpolicy\s*=/i.test(attrs)
    const hasCrossorigin = /\bcrossorigin\s*=/i.test(attrs)

    return `<img${pre}src=${quote}${resolved}${quote}${post}${
      hasLoading ? '' : ' loading="lazy"'
    }${hasDecoding ? '' : ' decoding="async"'}${
      hasReferrerPolicy ? '' : ' referrerpolicy="no-referrer"'
    }${hasCrossorigin ? '' : ' crossorigin="anonymous"'}>`
  })
}

function installImageRule(markdown: MarkdownIt): void {
  const defaultImageRenderer =
    markdown.renderer.rules.image ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
    const postPath = String(env?.postPath || '')
    const srcIndex = tokens[idx].attrIndex('src')
  if (srcIndex >= 0) {
    const originalSrc = tokens[idx].attrs?.[srcIndex]?.[1] || ''
    tokens[idx].attrs![srcIndex][1] = resolveImageUrl(originalSrc, postPath)
  }
  tokens[idx].attrSet('loading', 'lazy')
  tokens[idx].attrSet('decoding', 'async')
  tokens[idx].attrSet('referrerpolicy', 'no-referrer')
  tokens[idx].attrSet('crossorigin', 'anonymous')
  return defaultImageRenderer(tokens, idx, options, env, self)
}
}

installImageRule(md)
installImageRule(mdFallback)

function renderPostHtml(content: string, postPath: string): string {
  try {
    const rendered = md.render(content, { postPath })
    return rewriteImageSrcForHtml(rendered, postPath)
  } catch (error) {
    console.warn(`[posts] math render failed for ${postPath}, fallback to plain markdown`, error)
    const rendered = mdFallback.render(content, { postPath })
    return rewriteImageSrcForHtml(rendered, postPath)
  }
}

function titleFromContent(content: string, slug: string): string {
  const firstTitle = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith('# '))
  return firstTitle ? firstTitle.slice(2).trim() : slug
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item))
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }
  return []
}

function parseFrontMatter(raw: string): ParsedMarkdown {
  const normalized = raw.replace(/\r\n/g, '\n')
  if (!normalized.startsWith('---\n')) {
    return { data: {}, content: normalized }
  }

  const endIdx = normalized.indexOf('\n---\n', 4)
  if (endIdx === -1) {
    return { data: {}, content: normalized }
  }

  const fmBlock = normalized.slice(4, endIdx).trim()
  const content = normalized.slice(endIdx + 5)
  const data: FrontMatter = {}
  let currentArrayKey: 'tags' | null = null

  for (const lineRaw of fmBlock.split('\n')) {
    const line = lineRaw.trim()
    if (!line) continue

    if (line.startsWith('- ') && currentArrayKey) {
      data[currentArrayKey] ||= []
      data[currentArrayKey]!.push(line.slice(2).trim())
      continue
    }

    currentArrayKey = null
    const sep = line.indexOf(':')
    if (sep === -1) continue

    const key = line.slice(0, sep).trim()
    const value = line.slice(sep + 1).trim()

    if (key === 'title') data.title = value
    else if (key === 'date') data.date = value
    else if (key === 'summary') data.summary = value
    else if (key === 'tags') {
      if (value) {
        data.tags = value.split(',').map((tag) => tag.trim()).filter(Boolean)
      } else {
        data.tags = []
        currentArrayKey = 'tags'
      }
    }
  }

  const excerptMark = '<!--more-->'
  const excerptIndex = content.indexOf(excerptMark)

  return {
    data,
    content,
    excerpt: excerptIndex >= 0 ? content.slice(0, excerptIndex).trim() : undefined,
  }
}

function stripMarkdownForSummary(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const posts: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    const parsed = parseFrontMatter(raw)
    const title = typeof parsed.data.title === 'string' ? parsed.data.title : titleFromContent(parsed.content, slug)
    const summaryRaw =
      typeof parsed.data.summary === 'string'
        ? parsed.data.summary
        : parsed.excerpt || stripMarkdownForSummary(parsed.content).slice(0, 140)

    const html = renderPostHtml(parsed.content, path)

    return {
      slug,
      title,
      summary: summaryRaw,
      date: typeof parsed.data.date === 'string' ? parsed.data.date : undefined,
      tags: normalizeTags(parsed.data.tags),
      html,
    }
  })
  .sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date)
    if (a.date) return -1
    if (b.date) return 1
    return b.slug.localeCompare(a.slug)
  })

export function getAllPosts(): BlogPost[] {
  return posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug)
}
