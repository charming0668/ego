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
- Relocated core formulas into the method spec panel on the left and revised the comparison section title.
- Fixed initial image rendering in figure gallery by bypassing opacity masking and enabling unoptimized SVG/GIF streaming.
- Removed redundant forward-transfer evaluation metric item from LIBERO specifications per user request.
- Configured static export with basePath for GitHub Pages and added automated deployment workflow.
- Renamed GitHub repository to ego and updated basePath configuration accordingly.
- Upgraded method explorer to a full-width hero gallery with supporting parameter dashboard.
- Finalized Scheme 1: locked exhibition gallery height to eliminate Cumulative Layout Shift (CLS).
- Updated benchmark section title to Benchmark.
- Deepened contrast of comparison table text to slate-900 and slate-950 for improved readability.
- Replaced static zoom button with zoom-in cursor trigger and interactive wheel-zoom/pan lightbox modal.
