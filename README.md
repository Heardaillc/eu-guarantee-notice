# EU Guarantee Notice — Shopify app

Shows the European Commission's official notice about the two-year legal
guarantee on product pages, in the shopper's own language.

Required for shops selling to consumers in the EU from **27 September 2026**
(Commission Implementing Regulation (EU) 2025/1960).

## How it works

- A **theme app extension** block that merchants drag onto their product page.
- The block renders the Commission's **official artwork, unmodified**. The
  regulation forbids changing the wording, colours, layout or QR code, so the
  app never redraws the notice — it ships the Commission's files.
- The language follows the storefront the shopper is browsing, falling back to
  English outside the EU 24.
- A nested display (expand on click or hover) is used by default, which the
  regulation allows as long as the full notice appears on first interaction.
- Gift cards are skipped automatically; merchants can exclude further product
  types and tags from the app's settings screen.

## One-time setup: import the official artwork

The repo ships a clearly-marked placeholder so the block renders during
development. Before any real use, import the Commission's files:

1. Download the **SVG, all 24 languages, colour** pack from
   <https://commission.europa.eu/publications/practical-guidelines-and-high-resolution-vector-files-eu-notice-and-label-product-guarantees_en>
2. Run:

   ```sh
   npm run import:eu-notice -- ~/Downloads/<the-file>.zip
   ```

The script renames the files into `extensions/eu-guarantee/assets/` as
`eu-notice-<language>.svg` and skips the black-and-white versions, which are
not valid for online sales.

## Development

```sh
npm install
npm run dev          # starts the app and tunnels it to the dev store
```

Then in the dev store: Online Store → Themes → Customize → a product template →
Add block → Apps → EU guarantee notice.

## Project layout

| Path | What it is |
|---|---|
| `extensions/eu-guarantee/blocks/guarantee_notice.liquid` | the storefront block |
| `extensions/eu-guarantee/assets/` | notice artwork, CSS, hover script |
| `app/routes/app._index.tsx` | merchant settings screen |
| `app/lib/settings.server.ts` | reads/writes settings as an app-owned metafield |
| `app/routes/webhooks.*.tsx` | uninstall + mandatory GDPR topics |
| `scripts/import-eu-notice.mjs` | imports the Commission's artwork |

## Still to build

- GARAN durability label (producer guarantees longer than two years) as the
  paid tier, with per-product brand, model and duration.
- Billing plans (free / pro) via Shopify's billing API.
- Cart and collection page placements.
- German-language app listing and in-app copy.

## Note on compliance

This app helps display a notice the law requires. It is not legal advice, and
merchants remain responsible for their own compliance.
