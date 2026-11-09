# DSRT Official — HTML6 Migration

Migrated to HTML6 Prototype v0.2.0.

## Included
- Home, About, Projects, and Contact pages.
- Python (`app.psc`) loads `data/project.json` and creates project cards.
- Original space-themed visual direction retained in CSS.
- Canvas starfield and scroll reveal effects remain JavaScript browser effects.
- Original Formspree contact endpoint preserved.

## HTML6 runtime
The pages load the official runtime from jsDelivr:
`https://cdn.jsdelivr.net/gh/Deep-Space-Research-Team/html6@prototype-v0.2.0/html6.js`

An internet connection is required for the HTML6 runtime and Pyodide CDN.

## Run locally
Do not open with `file://`. Start a local server:
```bash
python -m http.server 8000
```
Open http://localhost:8000

## Structure
- `*.html` — page structure
- `style.css` — styling
- `script.js` — canvas animation and scroll observer
- `app.psc` — Python application logic
- `data/project.json` — project data
- `assets/favicon.svg` — favicon

## Important
HTML6 is an experimental Python-first runtime, not an official HTML standard. This ZIP was assembled from the source repository, but has not been browser-tested in this environment. Test all pages, project loading, contact form submission, and responsive layout before deploying.
