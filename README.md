# @wssto2/renault-header-footer-2026

Vue 2 header and footer for Renault sites (2026 design). Data comes from the CMS JSON described in [docs/API-STRUCTURE.md](docs/API-STRUCTURE.md) (sample: [docs/example-response.json](docs/example-response.json)).

## Usage

```html
<script>window.HEADER_FOOTER_SETTINGS = { apiUri: "https://rna.sto2.cms.hr/api/..." };</script>
<div id="rna-header"></div>
<main>...</main>
<div id="rna-footer"></div>
```

All styles are scoped under `.rna-hf`.

## Build

```
npm install --legacy-peer-deps
NODE_OPTIONS=--openssl-legacy-provider npm run build   # needed on Node >= 17
npm run lint
```
