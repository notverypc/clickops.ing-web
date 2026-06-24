const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '_posts');
const OUTPUT_FILE = path.join(__dirname, 'posts.js');

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

const postFiles = fs.readdirSync(POSTS_DIR)
  .filter(file => file.endsWith('.md'));

const posts = postFiles
  .map(file => {
    const slug = path.basename(file, '.md');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { metadata } = parseFrontmatter(raw);
    return { slug, ...metadata };
  })
  .filter(post => post.title && post.date)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((post, index) => ({
    id: index + 1,
    title: post.title,
    subtitle: post.subtitle || '',
    author: post.author || '',
    date: post.date,
    category: post.category || '',
    slug: post.slug,
  }));

const output = `window.blogPosts = ${JSON.stringify(posts, null, 2)};\n`;

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`Generated ${OUTPUT_FILE} with ${posts.length} post(s).`);
