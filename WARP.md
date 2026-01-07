# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ParmiPicks is a Next.js-based website for reviewing chicken parmis, using TinaCMS for content management. The site features reviews, blog posts, restaurant listings, and interactive maps.

## Development Commands

### Setup
```bash
yarn  # Install dependencies
```

### Development
```bash
yarn dev  # Start dev server with TinaCMS (localhost:3000)
```

### Building & Production
```bash
yarn build  # Build TinaCMS, Next.js, and generate sitemap
yarn start  # Build and start production server
yarn export  # Build and export static site
```

### Code Quality
```bash
yarn lint  # Run ESLint
```

## Architecture

### Content Management (TinaCMS)

TinaCMS is the core CMS driving all content. Configuration lives in `tina/config.tsx`.

**Content Collections:**
- **Reviews** (`content/reviews/`): Chicken parmi reviews with scores, images, restaurant references
- **Blogs** (`content/blogs/`): Blog posts with hero images
- **Restaurants** (`content/restaurant/`): Restaurant metadata including name, URL, location for maps
- **Authors** (`content/authors/`): Author profiles with avatars
- **Pages** (`content/pages/`): Static pages with block-based layouts
- **Global** (`content/global/`): Site-wide settings (header, footer, navigation)

**Important:** All content is stored as markdown/MDX files. TinaCMS generates GraphQL queries in `tina/__generated__/` at build time.

### Routing Architecture

Next.js uses dynamic routing for content:
- `/` → rewrites to `/home` (see `next.config.js`)
- `/reviews/[filename]` → Review pages (from `content/reviews/`)
- `/blogs/[filename]` → Blog pages (from `content/blogs/`)
- `/[filename]` → Dynamic pages (from `content/pages/`)
- `/admin` → TinaCMS admin interface

### Block System

Pages use a composable block system defined in `components/blocks/`:
- `hero.tsx` - Hero sections
- `features.tsx` - Feature lists
- `content.tsx` - Content sections
- `best-parmi.tsx` - Best parmi showcase (queries top-rated review)
- `map.tsx` - Map embeds

Blocks are rendered via `components/blocks-renderer.tsx` based on page configuration.

### Data Fetching Pattern

All pages use `getStaticProps` + `getStaticPaths` for static generation:
1. Query TinaCMS GraphQL API via `client.queries.*`
2. Pass data through `useTina()` hook for edit mode support
3. Render with TinaCMS visual editing capabilities

Example: Review pages query both the review and restaurant data, with restaurant.location used for map embeds.

## Key Files & Directories

### Configuration
- `tina/config.tsx` - TinaCMS schema and collections
- `next.config.js` - Next.js config (SVG support, rewrites, image domains)
- `tsconfig.json` - TypeScript config (strict: false)
- `eslint.config.mjs` - ESLint config
- `tailwind.config.js` - Tailwind CSS config
- `.env` - Environment variables (TinaCMS credentials, API keys)

### Content Structure
- `content/` - All TinaCMS-managed content
- `public/uploads/` - Media uploads through TinaCMS

### Components
- `components/layout/` - Layout components (header, footer, etc.)
- `components/blocks/` - Page building blocks
- `components/util/` - Utility components (Container, Section)

### Scripts
- `scripts/generate_blog.py` - Python script to generate blog posts using OpenAI
- `scripts/fix_canonical_urls.py` - Utility to fix canonical URLs in content
- `scripts/trigger_tina_reindex.py` - Trigger TinaCMS reindexing

## Environment Variables

Required variables (see `.env.example`):
- `NEXT_PUBLIC_TINA_CLIENT_ID` - TinaCMS client ID
- `TINA_TOKEN` - TinaCMS token
- `NEXT_PUBLIC_TINA_BRANCH` - Git branch for TinaCMS (defaults to main)
- `NEXT_PUBLIC_MEASUREMENT_ID` - Analytics ID
- `OPENAI_API_KEY` - For blog generation script
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps integration

## Design System

### Icons
Use Font Awesome 5 icons from `react-icons` for consistency:
```tsx
import { FaIcon } from 'react-icons/fa';
```

### Styling
- Tailwind CSS for styling
- PostCSS with nesting support
- Typography plugin for prose content

## Common Patterns

### Adding a New Review
1. Create MDX file in `content/reviews/`
2. Include: score, parmiImg, author reference, restaurant reference, canonicalUrl, date
3. Restaurant must exist in `content/restaurant/`

### Adding a New Block Type
1. Create block component in `components/blocks/`
2. Export schema (e.g., `myBlockSchema`)
3. Import and add to `tina/config.tsx` templates
4. Add case in `components/blocks-renderer.tsx`

### Working with Maps
The `MapEmbed` component uses restaurant.location or falls back to restaurant.name. Location should be descriptive enough for Google Maps (e.g., "The Local Taphouse, Darlinghurst").

## TypeScript Notes

- `strict: false` in tsconfig (legacy codebase)
- Use `@typescript-eslint` for linting
- Many components use `any` types - when refactoring, consider proper typing
- TinaCMS generates types in `tina/__generated__/types.ts`

## Version Control

Node.js version is specified in `.nvmrc` - ensure you're using the correct version.

## SEO & Schema.org

Both reviews and blogs include structured data (JSON-LD):
- Reviews: Review schema with rating, author, restaurant
- Blogs: BlogPosting schema
- All pages include canonical URLs
