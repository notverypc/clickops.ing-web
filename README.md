# clickops.ing

A simple blog. Each post is one Markdown file, and GitHub Pages builds the site on every push to `main`. There's nothing to install and no scripts to run.

## Add a post

1. Copy `_templates/post-template.md` to `_posts/YYYY-MM-DD-your-post-title.md`.
2. Fill in the details at the top and write the post.
3. Push to `main`. It goes live at `https://clickops.ing/your-post-title/` within a minute or two.

The `excerpt` is what appears on the homepage and in LinkedIn link previews.

Posts dated in the future won't appear until that date. If a value at the top of a post contains a colon, wrap it in quotes.

## Preview locally (optional)

Needs Docker. Then open `http://localhost:4000`.

```sh
docker run --rm -it -p 4000:4000 -v "$PWD":/site -w /site ruby:3.3 \
  sh -c "gem install github-pages webrick && jekyll serve --host 0.0.0.0"
```

## Where things are

- `_posts/`: the posts
- `_layouts/`: the page templates
- `_config.yml`: site title and description
- `index.html`: the homepage
- `styles.css`: the styling, including dark and light colours
- `script.js`: the dark mode toggle
