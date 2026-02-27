# Added YouTube Video Embed

Successfully added a responsive YouTube video to the "Nothing Phone (4a)" article content.

## Changes Made:
1. **Article Data (`src/data/articles.js`)**:
   - Added a new `type: 'youtube'` block for the Nothing Phone 4a article (English and Bengali).
   - Embedded video ID `fngzyCbHndk` seamlessly into the flow of the article right after the section on "Behind the Design".
2. **Component Renderer (`src/components/ArticlePage.jsx`)**:
   - Upgraded the `ArticleContent` switch case system to render `youtube` blocks automatically.
   - Utilized a semantic container structure with title headers and iframe embeds with the proper `allowFullScreen` permissions.
3. **Responsive Styling (`src/components/ArticlePage.css`)**:
   - Added class styling for `.video-section`, `.video-title`, and `.video-container`.
   - Used the gold-standard CSS aspect-ratio trick (`padding-bottom: 56.25%` and absolute positioning on the `iframe`) to maintain a perfect 16:9 ratio across all mobile and desktop viewports gracefully.
   - Preserved consistency with dark mode by inheriting primary text colors and using a `#000` background for the container wrapper to adapt cleanly without glitched borders.

## Verification:
- The video scales appropriately on mobile and keeps a max-width consistent with the article reading column width.
- Title uses the Accent tag-border for consistent UI aesthetic.

## Fixed Post-Deployment Issues
1. **White Screen on Refresh/Load**: 
   - `BrowserRouter` is natively incompatible with GitHub Pages without complex 404 rewrite hooks.
   - Updated `<BrowserRouter basename="/TechPulse">` to `<HashRouter>` inside `src/main.jsx`. Hash routing is the standard and fully-supported fallback for static hosts like GitHub Pages.
   - Removed the previous 404 rewrite attempt from `package.json` build step script.
2. **Missing Video on Site**:
   - The React repository was updated on the `main` branch but was not compiled and deployed to the `gh-pages` branch. Ran `npm run deploy` to correctly publish the compiled video embed.
