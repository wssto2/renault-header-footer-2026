# JSON structure expected from `rna.sto2.cms.hr`

Header and footer both do `axios.get(window.HEADER_FOOTER_SETTINGS.apiUri)` and render the response.
A full working sample is in [`example-response.json`](./example-response.json) (use it as a template).

```html
<script>window.HEADER_FOOTER_SETTINGS = { apiUri: "https://rna.sto2.cms.hr/api/stock-pages-navigation/structure/<uuid>" };</script>
<div id="rna-header"></div> ... <div id="rna-footer"></div>
```

## Conventions

- Every navigation is `{ "schema": [ item, ... ] }`.
- Item: `{ "title", "url", "target", "icon", "meta": {}, "active", "children": [item] }`.
- `active` = `0`/`false` hides the item. `target` = `_blank` etc.
- `meta` values are flat **strings** (`"true"`, comma lists such as `"hybrid,hybridPlugin"`). Structure is expressed through `children` and `meta.type`.
- `icon`: a built-in key (`logo, close, location, search, cart, request-offer, view-offer, contact, menu, info, engine, stock, used, plus, chevron-down, arrow`) or an image URL (footer icons may also be inline `<svg>` markup).
- All texts have Serbian defaults; the `meta` texts below override them.

## Root

| Key | Description |
|---|---|
| `site_title`, `site_url`, `logo_url` | Logo link (title/url). Default logo is built in. |
| `meta.footer_trademark` | Footer copyright line |
| `meta.footer_disclaimer` | Footer paragraph (AI notice) |
| `meta.back_to_top_title` | "back to top" link text |
| `meta.mobile_menu_title`, `meta.mobile_close_title` | Optional mobile menu labels |

## Header

### `switch_navigation.schema`
Exactly 2 items (e.g. passenger / business). `meta.active="true"` marks the active one. With `url` the click navigates, otherwise it only toggles.

### `top_navigation.schema` (right-side actions)
Items with `icon` + `title` (+ `url`). An item with `children` becomes a hover dropdown (children have `icon`, `title`, `url`). `meta.mobile="true"` repeats the item in the mobile menu.

### `main_navigation.schema` (tabs)
Each item is a tab (`title`, optional `url`; a leaf with a `url` is a plain link). A tab with children opens a panel chosen by `meta.type`:

**`meta.type = "vehicles"`**

Panel meta texts: `filters_title`, `category_label`, `category_tooltip`, `energy_label`, `energy_tooltip`, `card_cta_title`, `card_close_title`. Optional `more_title_<energy>` values customize the extra card link text when an engine filter is selected (for example `more_title_petrol`).

Children:
- *category* (no `meta.type`): `title` = radio label, `url` + `meta.more_title` = "see all" card, `meta.pro="true"` for business-only; its children are vehicles.
- *vehicle*: `title`, `url`, `meta.price`, `meta.image`, `meta.image_large`, `meta.energy` (comma list: `electric,hybrid,hybridPlugin`), `meta.cta_title`.
- `meta.type="shortcut"`: bottom links; `icon` (engine/stock/used), `title`, `url`, `target`.
- `meta.type="energy_filter"` (optional): `title`, `meta.value`. Only engines present in the selected category are shown; configured titles take precedence over defaults and vehicle `meta.energy_label_<energy>` values.

**`meta.type = "links"`**

Children:
- `meta.type="highlight"`: `title`, `meta.image`, children = links.
- any other child: a column (`title`) with link children.

## Footer

| Key | Content |
|---|---|
| `footer_cta_navigation.schema` | Flat CTA links; `icon` = image URL |
| `mainfooter.schema` | Columns: `title` + link children (accordion on mobile) |
| `social_navigation.schema[0].children` | Social links: `title`, `url`, `icon` (URL or inline svg) |
| `legal_navigation.schema` | Flat legal links |
