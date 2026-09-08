# Ego-VLA Guide

Interactive Chinese guide to training vision-language-action models with
egocentric human data. The site condenses `site-content.md` into a structured
MDX page while preserving the original source and first-party research media.

## Stack

- Next.js 15 with App Router and React Server Components
- Tailwind CSS 4
- MDX for page composition
- KaTeX for equations
- Motion and selected Magic UI components for restrained interaction
- Cruip Simple Light as the initial project scaffold

## Development

```bash
nvm use
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Run the production checks with:

```bash
corepack pnpm typecheck
corepack pnpm build
```

## Content

- `site-content.md`: complete source document
- `content/ego-vla.mdx`: page composition
- `content/site-data.ts`: condensed structured content
- `public/media`: research figures used by the page

The page intentionally keeps unresolved paper details visible as caveats. It
does not infer missing action horizons, image resolutions, or coordinate-frame
definitions.

See `THIRD_PARTY_NOTICES.md` and `docs/cruip-simple-light-readme.md` before
redistributing the source.
