# Third-party components

Original React Bits JavaScript / CSS sources, retrieved 2026-10-31 from the official registry and inspected via the shadcn MCP:

- Staggered Menu: https://reactbits.dev/components/staggered-menu — https://reactbits.dev/r/StaggeredMenu-JS-CSS.json
- Flex Carousel: https://reactbits.dev/components/flex-carousel — https://reactbits.dev/r/FlexCarousel-JS-CSS.json
- Folder: https://reactbits.dev/components/folder — https://reactbits.dev/r/Folder-JS-CSS.json
- Light Rays: https://reactbits.dev/backgrounds/light-rays — https://reactbits.dev/r/LightRays-JS-CSS.json (retrieved 2026-11-01; verified through shadcn MCP). Original WebGL renderer retained; the hero sets blue light from the top center, disables click pulses/cursor shadows, and freezes motion when reduced motion is requested.

Copyright David Haz. License is retained in `src/components/react-bits/LICENSE.md`.

Local modifications: Russian aria labels; inert closed menu; menu focus loop, Escape and anchor close; reduced-motion timing in GSAP; card selection callback receives screen bounds and opens any clicked card. Appearance is customized in `src/styles.css`; original animation and rendering engines are retained.

Manrope variable font: https://github.com/google/fonts/tree/main/ofl/manrope. Copyright 2018 The Manrope Project Authors. The SIL Open Font License is retained in `public/fonts/OFL.txt`.

Inter 4.1 variable font: extracted from the user-supplied `Inter-4.1.zip`. License retained in `public/fonts/Inter-LICENSE.txt`. Inter is now the active interface font.

SCHABO X Condensed by Tom Robin Karlsson: downloaded 2026-11-01 from the author's https://tomrobin.co/wp-content/uploads/2024/03/schaboxcondensed.zip. The author's https://tomrobin.co/ project page states “Free for personal and commercial use.” The original WOFF2 is used for the first-screen SWITCH wordmark; the subtitle retains Inter.

Three portfolio videos were supplied by the user. Original inputs are kept unchanged; deployed copies are encoded as 720p H.264/AAC with faststart and WebP poster frames. The earlier SVG demo concepts are retained as unused local assets.

Additional React Bits adaptations: localized menu footer and language switch; localized aria labels; wheel input disabled for the gallery; drag momentum disabled with nearest-card centering after release; dynamic squeeze and liquid deformation disabled. Original React Bits renderers and animation engines are retained.
