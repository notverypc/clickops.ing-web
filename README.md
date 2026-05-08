# Simple Blog Site

A lightweight static blog template built with HTML, CSS, and JavaScript.

## Files
- `index.html` — home page with a list of posts
- `post.html` — detail page for individual posts
- `styles.css` — responsive blog styles
- `script.js` — renders posts and loads the detail page
- `posts.js` — sample blog post data

## Run locally
1. Open `index.html` directly in your browser.
2. Or use a static server for better results, for example:
   - `python3 -m http.server 8000`
   - then visit `http://localhost:8000`

## Customize
- Add or edit post metadata in `posts.js`
- Write post content in markdown files inside `posts/`
- Use `posts/post-template.md` as a starting point for new posts
- Add frontmatter metadata to each markdown post using the `---` block at the top
- Add or update `excerpt:` in post frontmatter to automatically generate preview text
- Generate the RSS feed with `node generate-rss.js` after updating posts
  - optionally set `BASE_URL` before running, for example `BASE_URL=https://example.com/ node generate-rss.js`
- Update the layout in `styles.css`
- Use the dark mode toggle in the header to switch themes
- Add new pages by copying the existing templates

## RSS Feeds
BASE_URL=<https://your-site.com/> node generate-rss.js