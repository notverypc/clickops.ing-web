# clickops.ing

A simple blog. Each post is one Markdown file, and GitHub Pages builds the site whenever a change is merged into `main`.

## Add a post

1. Copy `_templates/post-template.md` to `_posts/YYYY-MM-DD-your-post-title.md`.
2. Fill in the details at the top and write the post.
3. Push it to a branch and open a pull request. `main` only accepts changes through pull requests.
4. Wait for the **Build check** to pass, then merge. The post goes live at `https://clickops.ing/your-post-title/` within a minute or two.

The `excerpt` is what appears on the homepage and in LinkedIn link previews.

Posts dated in the future won't appear until that date. If a value at the top of a post contains a colon, wrap it in quotes.

## Preview locally

Run this, then open `http://localhost:4000`. The page reloads as you save changes. Press Ctrl+C to stop.

```sh
bin/preview
```

It uses the same Jekyll version as GitHub Pages. The first run installs what it needs into `vendor/`. It needs Ruby 3.3 from Homebrew (`brew install ruby@3.3`).

## Where things are

- `_posts/`: the posts
- `_layouts/`: the page templates
- `_config.yml`: site title and description
- `index.html`: the homepage
- `styles.css`: the styling, including dark and light colours
- `script.js`: the dark mode toggle
- `bin/preview`: local preview
- `.github/workflows/build-check.yml`: the build check that runs on pull requests
