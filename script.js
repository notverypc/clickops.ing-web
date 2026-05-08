const themeToggle = document.getElementById('themeToggle');

function createPostCard(post) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.innerHTML = `
    <div class="post-meta">
      <span class="post-category">${post.category}</span>
      <span>${post.date}</span>
    </div>
    <h3>${post.title}</h3>
    <p>${post.excerpt}</p>
    <a class="button" href="post.html?slug=${encodeURIComponent(post.slug)}">Read more</a>
  `;
  return card;
}

function renderPosts() {
  const container = document.getElementById('postsGrid');
  if (!container || !window.blogPosts) return;
  container.innerHTML = '<p class="loading-message">Loading posts…</p>';

  Promise.all(window.blogPosts.map(async post => {
    try {
      const { metadata, content } = await fetchMarkdownPost(post.slug);
      const excerpt = metadata.excerpt || metadata.description || getExcerptFromContent(content) || post.excerpt || '';
      return {
        ...post,
        ...metadata,
        excerpt,
        content
      };
    } catch {
      return post;
    }
  }))
    .then(postsWithMeta => {
      container.innerHTML = '';
      postsWithMeta.forEach(post => {
        container.appendChild(createPostCard(post));
      });
    });
}

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function escapeHtml(text) {
  return text.replace(/[&<>\"]+/g, match => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return map[match] || match;
  });
}

function renderInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.split('\n');
  const html = [];
  let listOpen = false;
  let codeOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push('</ul>');
      listOpen = false;
    }
  };

  for (let rawLine of lines) {
    const line = rawLine.trim();

    if (line === '') {
      closeList();
      if (!codeOpen) html.push('');
      continue;
    }

    if (line.startsWith('```')) {
      if (codeOpen) {
        html.push('</code></pre>');
      } else {
        html.push('<pre><code>');
      }
      codeOpen = !codeOpen;
      continue;
    }

    if (codeOpen) {
      html.push(escapeHtml(rawLine));
      continue;
    }

    if (/^#{1,3} /.test(line)) {
      closeList();
      const level = line.match(/^#{1,3}/)[0].length;
      const content = renderInlineMarkdown(line.slice(level + 1).trim());
      html.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    if (/^> /.test(line)) {
      closeList();
      html.push(`<blockquote>${renderInlineMarkdown(line.slice(2).trim())}</blockquote>`);
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(line.replace(/^[-*+]\s+/, '').trim())}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }

  closeList();
  return html.join('');
}

function getExcerptFromContent(content) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map(item => item.trim())
    .filter(Boolean);

  if (!paragraphs.length) return '';

  return paragraphs[0]
    .replace(/^#{1,6}\s*/, '')
    .replace(/^>\s*/, '')
    .replace(/^[-*+]\s*/, '')
    .replace(/[`*_]+/g, '')
    .trim();
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
    const value = rest.join(':').trim();
    metadata[key.trim()] = value;
  });

  return { metadata, content };
}

async function fetchMarkdownPost(slug) {
  const response = await fetch(`posts/${slug}.md`);
  if (!response.ok) {
    throw new Error('Markdown file not found');
  }
  const markdown = await response.text();
  return parseFrontmatter(markdown);
}

async function loadMarkdownContent(slug) {
  const { metadata, content } = await fetchMarkdownPost(slug);
  return { html: markdownToHtml(content), metadata };
}

async function renderPostDetail() {
  const detail = document.getElementById('postDetail');
  if (!detail || !window.blogPosts) return;

  const slug = getQueryParam('slug');
  const id = Number(getQueryParam('id'));
  const post = window.blogPosts.find(item => item.slug === slug) || window.blogPosts.find(item => item.id === id);

  if (!post) {
    detail.innerHTML = `
      <div class="post-not-found">
        <h1>Post not found</h1>
        <p>We couldn't find the article you're looking for. Return to the <a href="index.html">blog homepage</a>.</p>
      </div>
    `;
    return;
  }

  detail.innerHTML = `
    <header class="post-header">
      <p class="post-category">${post.category}</p>
      <h1>${post.title}</h1>
      <p class="post-meta">By ${post.author} · ${post.date}</p>
      <p class="post-subtitle">${post.subtitle}</p>
    </header>
    <section class="post-content" id="postContent">
      <p>Loading post...</p>
    </section>
    <div class="post-actions">
      <a class="button button-secondary" href="index.html">Back to posts</a>
    </div>
  `;

  try {
    const { html, metadata } = await loadMarkdownContent(post.slug);
    const contentSection = document.getElementById('postContent');

    const merged = {
      ...post,
      title: metadata.title || post.title,
      subtitle: metadata.subtitle || post.subtitle,
      author: metadata.author || post.author,
      date: metadata.date || post.date,
      category: metadata.category || post.category
    };

    detail.innerHTML = `
      <header class="post-header">
        <p class="post-category">${merged.category}</p>
        <h1>${merged.title}</h1>
        <p class="post-meta">By ${merged.author} · ${merged.date}</p>
        <p class="post-subtitle">${merged.subtitle}</p>
      </header>
      <section class="post-content">${html}</section>
      <div class="post-actions">
        <a class="button button-secondary" href="index.html">Back to posts</a>
      </div>
    `;
  } catch (error) {
    const contentSection = document.getElementById('postContent');
    if (contentSection) {
      contentSection.innerHTML = '<p>Sorry, there was a problem loading this post.</p>';
    }
  }
}

function applyTheme(theme) {
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }

  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }
}

function loadTheme() {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  const nextTheme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
}

function initThemeToggle() {
  if (!themeToggle) return;
  themeToggle.addEventListener('click', toggleTheme);
  loadTheme();
}

function initPage() {
  if (window.location.pathname.endsWith('post.html')) {
    renderPostDetail();
  } else {
    renderPosts();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPage();
});
