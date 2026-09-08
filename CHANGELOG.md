# Changelog

## 2026-09-08

- Built a light, responsive Ego-VLA research guide from the Cruip Simple Light scaffold.
- Added an MDX content layer with structured summaries for five Ego-VLA methods.
- Added interactive method tabs, pipeline exploration, benchmark switching, figure enlargement, and a comparison matrix.
- Added KaTeX equation rendering and reduced-motion support.
- Preserved the full source document and moved research media under `public/media` for web delivery.
- Pinned Node 24.14.1, pnpm 10.15.1, and aligned Next.js with `@next/mdx` at 15.5.25.
- Overrode vulnerable transitive PostCSS and Nano ID versions with patched releases.
- Fixed mixed Chinese and LaTeX content so every visible formula is rendered through KaTeX.
- Redesigned benchmark information into structured cards with spec highlights and categorized items.
- Removed the selection advice and source link sections per user feedback.
