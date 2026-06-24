# Simple Blog Site

A lightweight static blog template built with HTML, CSS, and JavaScript.

## Files
- `index.html` — home page with a list of posts
- `post.html` — detail page for individual posts
- `styles.css` — responsive blog styles
- `script.js` — renders posts and loads the detail page
- `posts.js` — sample blog post data

## Run locally
**Important:** This blog requires a local static server to work properly. Opening `index.html` directly in your browser won't load the Markdown posts due to browser security restrictions.

1. Use a static server:
   - `python3 -m http.server 8000` (Python 3)
   - `python -m SimpleHTTPServer 8000` (Python 2)
   - Or use any static file server (nginx, Apache, etc.)

2. Visit `http://localhost:8000` in your browser.

## Customize
- Add new posts as markdown files inside `_posts/` using `_templates/post-template.md` as a starting point
- Run `node generate-posts.js` to rebuild `posts.js` from your markdown files
- Write post content in markdown files inside `_posts/`
- Add frontmatter metadata to each markdown post using the `---` block at the top
- Add or update `excerpt:` in post frontmatter to automatically generate preview text
- Generate the RSS feed with `node generate-rss.js` after updating posts
  - optionally set `BASE_URL` before running, for example `BASE_URL=https://example.com/ node generate-rss.js`
- Update the layout in `styles.css`
- Use the dark mode toggle in the header to switch themes
- Add new pages by copying the existing templates

## RSS Feeds
BASE_URL=<https://your-site.com/> node generate-rss.js

## Simple Change
