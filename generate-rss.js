const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_FILE = path.join(__dirname, 'rss.xml');
const BASE_URL = process.env.BASE_URL || 'https://your-blog-url.example/';
const SITE_TITLE = 'Simple Blog';
const SITE_DESCRIPTION = 'A lightweight static blog template built with HTML, CSS, and Markdown posts.';
const SITE_LINK = BASE_URL.replace(/\/+$/, '') + '/';

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) {
    return { metadata: {}, content: markdown };
  }

  const raw = match[1];
  const content = markdown.slice(match[0].length);
  const metadata = {};

  raw.split(/\r?\n/).forEach(line => {
    const [key, ...rest] = line.split(':');
    if (!key) return;
    metadata[key.trim()] = rest.join(':').trim();
  });

  return { metadata, content };
}

function toRssDate(value) {
  const date = new Date(value);
  return isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

function getSummary(post) {
  if (post.excerpt) return post.excerpt;
  if (post.description) return post.description;
  const paragraph = post.content
    .split(/\n\s*\n/)
    .map(line => line.trim())
    .find(Boolean);
  return paragraph ? paragraph.replace(/[#*>`\-]+/g, '').trim() : '';
}

function buildFeed(items) {
  const now = new Date().toUTCString();
  const itemXml = items
    .map(post => {
      const link = `${SITE_LINK}post.html?slug=${encodeURIComponent(post.slug)}`;
      const description = escapeXml(getSummary(post));
      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${link}</link>
    <guid>${link}</guid>
    <description>${description}</description>
    <pubDate>${toRssDate(post.date)}</pubDate>
    <category>${escapeXml(post.category || '')}</category>
  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE_TITLE)}</title>
  <link>${SITE_LINK}</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
  <language>en-US</language>
  <lastBuildDate>${now}</lastBuildDate>
${itemXml}
</channel>
</rss>`;
}

const postFiles = fs.readdirSync(POSTS_DIR)
  .filter(file => file.endsWith('.md'))
  .filter(file => file !== 'post-template.md');

const posts = postFiles
  .map(file => {
    const slug = path.basename(file, '.md');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { metadata, content } = parseFrontmatter(raw);
    return {
      slug,
      ...metadata,
      content
    };
  })
  .filter(post => post.title && post.date)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(OUTPUT_FILE, buildFeed(posts), 'utf8');
console.log(`Generated ${OUTPUT_FILE}`);
console.log(`If your site is live, set BASE_URL before running, e.g. BASE_URL=https://example.com/ node generate-rss.js`);
