You are the world's most advanced full-stack architect and senior engineer. You write 
production-grade, enterprise-quality code with zero shortcuts, zero placeholders, and 
zero ambiguity. You think deeply before writing, architect before coding, and never 
truncate output. You are building a real product that will go live.

MINDSET RULES — INTERNALIZE THESE BEFORE WRITING A SINGLE LINE:
  ✦ You are NOT a code demo generator. You are a senior engineer shipping a product.
  ✦ Every file you write must be complete, compilable, and runnable as-is.
  ✦ No "// TODO", no "// implement this", no "// add logic here", no "etc.", no "..."
  ✦ If a response gets long, write ">>> CONTINUING — Part [N]" and keep going.
  ✦ Never summarize what you "would" do — just do it.
  ✦ Never ask unnecessary questions. Make the best architectural decision and proceed.
  ✦ TypeScript strict mode everywhere. Zero `any` types unless absolutely unavoidable.
  ✦ Every async operation wrapped in try/catch with meaningful error messages.
  ✦ Code quality standard: imagine this will be reviewed by a team at Google or Stripe.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHITECTURE DECISION — CRITICAL, READ FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This system runs as FOUR COMPLETELY SEPARATE SERVICES on different ports.
EVERYTHING runs locally on the server. No external cloud services of any kind.

  ┌─────────────────────────────────────────────────────────────┐
  │  PORT 3000  →  PUBLIC WEBSITE  (Next.js frontend)           │
  │  PORT 4000  →  ADMIN DASHBOARD (Next.js admin app)          │
  │  PORT 5000  →  BACKEND API     (Express.js)                 │
  │  PORT 27017 →  MONGODB         (local Docker container)     │
  └─────────────────────────────────────────────────────────────┘

ZERO EXTERNAL DEPENDENCIES — ALL LOCAL:
  ✦ Database:    MongoDB 7.0 in Docker container — no Atlas, no cloud
  ✦ File storage: Local disk on the server — no Cloudinary, no S3, no cloud storage
  ✦ Email:       Local Mailpit SMTP container — no Gmail, no SendGrid, no cloud SMTP
                 Mailpit runs at PORT 1025 (SMTP) + PORT 8025 (web UI to view emails)
  ✦ Everything persists via Docker named volumes on the server's physical disk

WHY SEPARATE APPS:
  - Public website and admin dashboard are COMPLETELY isolated
  - Admin code, routes, and logic are NEVER bundled into the public site
  - An attacker compromising the public frontend has zero access to admin internals
  - Each app can be deployed, scaled, and updated independently
  - Admin app can be placed behind VPN / IP whitelist at nginx level
  - All data stays on your own server — no vendor lock-in, no external costs

MONOREPO STRUCTURE using pnpm workspaces:

  /
  ├── apps/
  │   ├── public-web/          ← Next.js 14, PORT 3000 (public website only)
  │   ├── admin-dashboard/     ← Next.js 14, PORT 4000 (dashboard + admin panel)
  │   └── api/                 ← Express.js, PORT 5000 (shared backend API)
  ├── packages/
  │   ├── types/               ← Shared TypeScript interfaces/types
  │   └── validators/          ← Shared Zod schemas (used by both frontends + API)
  ├── uploads/                 ← CREATED BY DOCKER — server file storage
  │   ├── profiles/            ← profile photos
  │   ├── projects/            ← project featured images
  │   ├── blogs/               ← blog featured images
  │   └── content/             ← images inserted into rich text editor
  ├── docker-compose.yml       ← Orchestrates all 5 services
  ├── nginx.conf               ← Reverse proxy + serves /uploads/ statically
  ├── pnpm-workspace.yaml
  └── .env.example

NGINX ROUTING:
  - public.brikienlabs.tech        → PORT 3000  (public website)
  - admin.brikienlabs.tech         → PORT 4000  (admin dashboard, IP-restrictable)
  - api.brikienlabs.tech           → PORT 5000  (API)
  - api.brikienlabs.tech/uploads/  → /srv/uploads/ on disk (static file serving)
  - mail.brikienlabs.tech          → PORT 8025  (Mailpit web UI, admin-only)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build a full-stack monorepo web application for a startup called "Brikien Labs".
Everything self-hosted. Zero cloud. Zero external accounts needed.

APP 1 — PUBLIC WEBSITE (apps/public-web, PORT 3000)
  - Entirely read-only, purely presentational
  - No auth, no login, no session state
  - Fetches all data from the API
  - Images served from /uploads/ via nginx static file serving
  - Fully SEO-optimized with Next.js SSR/SSG

APP 2 — ADMIN DASHBOARD (apps/admin-dashboard, PORT 4000)
  - Entirely protected — every page requires login
  - Login page is the only unauthenticated route
  - Developers manage their blogs, projects, profiles
  - Admins manage everything + control homepage content
  - File uploads go to local server disk

APP 3 — API SERVER (apps/api, PORT 5000)
  - Express.js REST API
  - Connects to local MongoDB container
  - Handles file uploads: saves files to /srv/uploads/ on Docker volume
  - Serves upload metadata (filename, path) — actual files served by nginx
  - CORS configured for PORT 3000 and PORT 4000

APP 4 — MONGODB (Docker container, PORT 27017)
  - Official mongo:7.0 Docker image
  - Data in named volume: brikienlabs_mongo_data

APP 5 — MAILPIT (Docker container, PORT 1025 + 8025)
  - Local SMTP server for email testing
  - All emails sent by the API are caught by Mailpit
  - Web UI at PORT 8025 to view/inspect all sent emails
  - No real emails sent — everything stays local

The startup has exactly 3 developers who are also admins/owners.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK — NON-NEGOTIABLE, USE EXACTLY THIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOTH NEXT.JS APPS:
  - Next.js 14.2+ (App Router, not Pages Router)
  - React 18+
  - TypeScript 5+ (strict: true in tsconfig)
  - Tailwind CSS 3.4+
  - shadcn/ui (latest)
  - React Hook Form 7+ with @hookform/resolvers
  - Zod 3+ for all validation schemas
  - Axios for API calls (with interceptors for auth token refresh)
  - react-hot-toast for notifications
  - Framer Motion for page/element animations
  - next-themes for dark mode

ADMIN DASHBOARD ONLY (apps/admin-dashboard):
  - TipTap 2+ for rich text editing (with extensions: StarterKit, Image, CodeBlock 
    with syntax highlighting via lowlight, Link, Placeholder, CharacterCount)
  - @tanstack/react-table v8 for data tables
  - date-fns for date formatting
  - react-dropzone for image upload UI

API (apps/api):
  - Node.js 20+
  - Express.js 4.18+
  - TypeScript 5+
  - Mongoose 8+
  - jsonwebtoken + cookie-parser
  - bcryptjs (not bcrypt — easier to compile cross-platform)
  - express-rate-limit
  - helmet
  - cors
  - sanitize-html (server-side HTML sanitization for rich text)
  - multer (local disk storage — NOT memory storage, NOT Cloudinary)
    multer saves files directly to /srv/uploads/[category]/ on the Docker volume
  - nodemailer (sends to local Mailpit SMTP at mailpit:1025)
  - morgan (HTTP request logging)
  - compression
  - express-validator (secondary validation layer)
  - sharp (image processing: resize + compress before saving to disk)
  - dotenv
  - uuid (generate unique filenames to avoid collisions)

  REMOVE ENTIRELY — DO NOT INSTALL OR IMPORT:
    ✦ cloudinary — NOT USED. Local disk only.
    ✦ @cloudinary/url-gen — NOT USED.
    Any other cloud storage SDK.

DATABASE:
  - MongoDB 7.0 in local Docker container
  - Docker internal URI: mongodb://mongo:27017/brikienlabs
  - Local dev URI:       mongodb://localhost:27017/brikienlabs
  - Named volume: brikienlabs_mongo_data

FILE STORAGE — LOCAL DISK:
  - Multer saves uploads to Docker volume mounted at /srv/uploads/ inside container
  - Host path: ./uploads/ (relative to project root, created by docker-compose)
  - Subdirectories: profiles/ | projects/ | blogs/ | content/
  - Nginx serves files at: https://api.brikienlabs.tech/uploads/[category]/[filename]
  - File URL stored in DB: /uploads/profiles/abc123.webp  (relative path, no domain)
  - Frontend constructs full URL: process.env.NEXT_PUBLIC_API_URL + file.path
  - Images processed with sharp before saving:
      profiles: resize to max 400×400, convert to webp, quality 85
      projects: resize to max 1200×630, convert to webp, quality 85
      blogs:    resize to max 1200×630, convert to webp, quality 85
      content:  resize to max 1920×1080, convert to webp, quality 80
  - Max file size: 10MB per upload
  - Allowed types: image/jpeg, image/png, image/webp, image/gif
  - Unique filename: [uuid]-[timestamp].webp

EMAIL:
  - Nodemailer connects to Mailpit at host: mailpit, port: 1025 (no auth needed)
  - All emails are intercepted by Mailpit — nothing sent to real addresses
  - View all sent emails at http://localhost:8025 (Mailpit web UI)
  - In production: swap SMTP_HOST/PORT to a real provider — code stays identical

SHARED PACKAGES:
  - packages/types → TypeScript interfaces shared across all 3 apps
  - packages/validators → Zod schemas shared across all 3 apps

DEVOPS:
  - Docker + docker-compose (5 services: mongo, mailpit, api, admin, public-web)
  - Nginx reverse proxy + static file server for uploads
  - pnpm workspaces (package manager: pnpm only, not npm/yarn)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE UPLOAD SYSTEM — COMPLETE SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This replaces Cloudinary entirely. Read carefully.

── API SIDE (apps/api) ──

src/config/storage.ts:
  - Configure multer with diskStorage engine
  - destination: function that receives fieldname/category query param
      maps 'profile' → /srv/uploads/profiles/
      maps 'project' → /srv/uploads/projects/
      maps 'blog'    → /srv/uploads/blogs/
      maps 'content' → /srv/uploads/content/
      default        → /srv/uploads/content/
  - filename: generate as `${uuidv4()}-${Date.now()}.tmp`
    (tmp extension because sharp will re-encode to webp)
  - File filter: reject non-image MIME types with 400 error
  - Limits: fileSize: 10 * 1024 * 1024 (10MB)
  - Export: upload middleware (multer instance)

src/utils/image.utils.ts:
  - processImage(inputPath: string, category: string): Promise<string>
      Reads the tmp file at inputPath
      Determines output dimensions from category:
        'profile'  → { width: 400,  height: 400,  fit: 'cover' }
        'project'  → { width: 1200, height: 630,   fit: 'cover' }
        'blog'     → { width: 1200, height: 630,   fit: 'cover' }
        'content'  → { width: 1920, height: 1080,  fit: 'inside' }
      Runs sharp(inputPath).resize(dims).webp({ quality }).toFile(outputPath)
      outputPath = same dir as inputPath, filename = `${uuidv4()}-${Date.now()}.webp`
      Deletes the tmp file after successful conversion
      Returns the relative path: /uploads/[category]/[filename].webp
  - deleteImage(relativePath: string): Promise<void>
      Constructs absolute path from relative path + /srv/uploads base
      Calls fs.unlink — swallows ENOENT errors (file already gone is fine)

src/controllers/upload.controller.ts:
  POST /api/v1/upload/image
    - Accepts multipart/form-data, field: 'image'
    - Query param: ?category=profile|project|blog|content
    - multer middleware saves raw file to disk as tmp file
    - Calls processImage() to resize/compress/convert to webp
    - Returns: { success: true, data: { url: '/uploads/profiles/abc.webp' } }
    - On error: delete tmp file if exists, return 500

  DELETE /api/v1/upload/image
    - Body: { url: '/uploads/profiles/abc.webp' }
    - Calls deleteImage(url)
    - Used when user removes an image before saving form
    - Returns: { success: true, message: 'File deleted' }

When a user (developer/admin) deletes a project, blog, or profile photo:
  - The corresponding controller calls deleteImage() to clean up the file
  - This prevents orphaned files from accumulating on disk

── FRONTEND SIDE (both Next.js apps) ──

ImageUpload component (admin-dashboard only):
  - Uses react-dropzone: accepts image/jpeg, image/png, image/webp, image/gif
  - Max size: 10MB (show error if exceeded)
  - On drop: immediately POST to /api/v1/upload/image?category=[prop]
  - Shows upload progress bar during upload
  - On success: displays preview using the returned URL
    Preview URL = process.env.NEXT_PUBLIC_API_URL + data.url
    Example: http://localhost:5000/uploads/profiles/abc.webp
  - Shows × button to remove: calls DELETE /api/v1/upload/image with the url
  - Stores returned url string in React Hook Form field value
  - Props: category ('profile'|'project'|'blog'|'content'), value, onChange

Displaying images in public-web and admin-dashboard:
  - All image src values stored in DB are relative paths: /uploads/profiles/abc.webp
  - To display: prefix with NEXT_PUBLIC_API_URL env var
  - Helper in lib/utils.ts:
      export function getImageUrl(path: string): string {
        if (!path) return '/placeholder.png';
        if (path.startsWith('http')) return path;
        return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
      }
  - Use this helper in EVERY component that renders an image from the DB
  - Next.js Image component: add the API domain to next.config.ts remotePatterns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP 1: PUBLIC WEBSITE — apps/public-web (PORT 3000)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE STRUCTURE:
  apps/public-web/
  ├── app/
  │   ├── layout.tsx
  │   ├── page.tsx                      (homepage — SSR, fetches SiteConfig)
  │   ├── projects/
  │   │   ├── page.tsx
  │   │   └── [slug]/page.tsx
  │   ├── developers/
  │   │   └── [slug]/page.tsx
  │   ├── blog/
  │   │   ├── page.tsx
  │   │   └── [slug]/page.tsx
  │   ├── not-found.tsx
  │   └── error.tsx
  ├── components/
  │   ├── layout/
  │   │   ├── Navbar.tsx
  │   │   └── Footer.tsx
  │   ├── home/
  │   │   ├── HeroSection.tsx
  │   │   ├── AboutSection.tsx
  │   │   ├── ProjectsPreview.tsx
  │   │   ├── TeamSection.tsx
  │   │   └── ContactSection.tsx
  │   ├── projects/
  │   │   ├── ProjectCard.tsx
  │   │   ├── ProjectFilters.tsx
  │   │   └── ProjectGrid.tsx
  │   ├── blog/
  │   │   ├── BlogCard.tsx
  │   │   └── RichTextRenderer.tsx
  │   ├── developers/
  │   │   └── DeveloperCard.tsx
  │   └── shared/
  │       ├── StatusBadge.tsx
  │       ├── TechChip.tsx
  │       ├── SkeletonCard.tsx
  │       └── AnimatedSection.tsx
  ├── lib/
  │   ├── api.ts
  │   └── utils.ts                      (includes getImageUrl helper)
  └── types/ → imports from packages/types

── HOMEPAGE (/) ──

Render strategy: SSR (revalidate: 60s via ISR)
Fetch: SiteConfig, featured projects (6), all active developers, recent blogs (3)

A. HERO SECTION
   - Full viewport height (min-h-screen)
   - Startup name: large gradient text, animated on load (Framer Motion)
   - Tagline: typewriter animation effect
   - Short description paragraph
   - If SiteConfig.hero.backgroundImage → show via getImageUrl() as bg-cover
     with dark overlay
   - If SiteConfig.hero.useGradient → animated CSS gradient background
   - CTA button: glowing primary button
   - Animated scroll indicator arrow

B. ABOUT / WHAT WE DO
   - Heading from SiteConfig.about.heading
   - Body rendered via RichTextRenderer (sanitized HTML)
   - Tech tags as animated pill chips
   - Service cards grid (title + description per card)
   - Framer Motion whileInView entrance animations

C. PROJECTS PREVIEW
   - Tab switcher: All | Completed | In Progress | Upcoming
   - Max 6 ProjectCards
   - "View All Projects →" → /projects

   ProjectCard:
   - Glassmorphism design
   - Featured image via getImageUrl() + Next.js Image
   - Status badge (green/yellow/blue)
   - Title, truncated description (2 lines)
   - Tech chips row
   - Developer avatars (stacked, max 3 + "+N")
   - "Read More →" only for completed projects with blog
   - Hover: card lifts

D. TEAM SECTION
   - All active developers from /api/v1/developers
   - Per card: photo via getImageUrl(), name, role, short bio, social links
   - "View Portfolio →" → /developers/[slug]
   - Horizontal scroll on mobile, grid on desktop

E. CONTACT SECTION
   - Two-column: info left, form right
   - Info: email, phone, location, social links (from SiteConfig.contact)
   - Form: Name*, Email*, Subject*, Message* — Zod validated
   - POST /api/v1/messages → success toast + clear form
   - Client-side: disable submit for 60s after submission

── ALL PROJECTS PAGE (/projects) ──
   - Filter tabs + debounced search (300ms)
   - URL reflects state (?status=completed&search=react&page=2)
   - Pagination: 9 per page

── PROJECT BLOG PAGE (/projects/[slug]) ──
   - SSG + ISR (revalidate: 300s)
   - If not completed or no blog: "Coming Soon" page
   - If completed: full blog with featured image, RichTextRenderer content,
     screenshot gallery, developer cards

── DEVELOPER PORTFOLIO PAGE (/developers/[slug]) ──
   - SSG + ISR (revalidate: 300s)
   - Profile photo, skills, projects, current work, blog posts

── BLOG LISTING + SINGLE BLOG PAGES ──
   - SSG + ISR
   - Full rich text rendering via RichTextRenderer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP 2: ADMIN DASHBOARD — apps/admin-dashboard (PORT 4000)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE STRUCTURE:
  apps/admin-dashboard/
  ├── app/
  │   ├── login/page.tsx
  │   ├── dashboard/
  │   │   ├── layout.tsx
  │   │   ├── page.tsx
  │   │   ├── blogs/
  │   │   │   ├── page.tsx
  │   │   │   ├── new/page.tsx
  │   │   │   └── [id]/edit/page.tsx
  │   │   ├── projects/
  │   │   │   ├── page.tsx
  │   │   │   ├── new/page.tsx
  │   │   │   └── [id]/edit/page.tsx
  │   │   ├── profile/page.tsx
  │   │   └── admin/
  │   │       ├── homepage/page.tsx
  │   │       ├── developers/
  │   │       │   ├── page.tsx
  │   │       │   └── [id]/edit/page.tsx
  │   │       ├── projects/page.tsx
  │   │       ├── blogs/page.tsx
  │   │       └── messages/page.tsx
  ├── components/
  │   ├── layout/
  │   │   ├── Sidebar.tsx
  │   │   ├── Topbar.tsx
  │   │   └── AuthGuard.tsx
  │   ├── dashboard/
  │   │   ├── StatsCard.tsx
  │   │   └── ActivityFeed.tsx
  │   ├── editor/
  │   │   ├── TipTapEditor.tsx
  │   │   └── ImageUpload.tsx           ← uploads to local API, NO Cloudinary
  │   ├── tables/
  │   │   ├── BlogsTable.tsx
  │   │   ├── ProjectsTable.tsx
  │   │   ├── DevelopersTable.tsx
  │   │   └── MessagesTable.tsx
  │   ├── forms/
  │   │   ├── BlogForm.tsx
  │   │   ├── ProjectForm.tsx
  │   │   ├── ProfileForm.tsx
  │   │   ├── DeveloperForm.tsx
  │   │   └── HomepageForm.tsx
  │   └── shared/
  │       ├── TagInput.tsx
  │       ├── ConfirmModal.tsx
  │       └── StatusBadge.tsx
  ├── lib/
  │   ├── api.ts
  │   ├── auth.ts
  │   └── utils.ts                      (includes getImageUrl helper)
  ├── hooks/
  │   ├── useAuth.ts
  │   └── useDebounce.ts
  └── context/AuthContext.tsx

── AUTHENTICATION ──
  Same as before: JWT HttpOnly cookies, auto-refresh, role guard.

── IMAGE UPLOAD COMPONENT (ImageUpload.tsx) ──
  - react-dropzone accepting images
  - On drop: POST to /api/v1/upload/image?category=[prop]
  - Upload progress bar
  - Preview: getImageUrl(returnedPath)
  - Remove button: DELETE /api/v1/upload/image
  - category prop: 'profile' | 'project' | 'blog' | 'content'
  - NO Cloudinary widget. NO external SDK. Pure HTTP to local API.

── BLOG EDITOR ──
  TipTap editor with image insertion:
  - User clicks image button in toolbar
  - Opens ImageUpload modal with category='content'
  - On upload success: insert returned URL into editor as <img src="...">
  - URL format: getImageUrl('/uploads/content/abc.webp')

── ALL OTHER DASHBOARD PAGES ──
  Same specifications as before (blog management, project management,
  profile, homepage editor, developer management, blog moderation, messages).
  All image fields use the local ImageUpload component.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP 3: API SERVER — apps/api (PORT 5000)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE STRUCTURE:
  apps/api/
  ├── src/
  │   ├── config/
  │   │   ├── database.ts
  │   │   ├── storage.ts                ← multer + local disk config (NO cloudinary.ts)
  │   │   └── email.ts                  ← nodemailer → mailpit:1025
  │   ├── models/
  │   │   ├── User.model.ts
  │   │   ├── Project.model.ts
  │   │   ├── Blog.model.ts
  │   │   ├── Message.model.ts
  │   │   └── SiteConfig.model.ts
  │   ├── routes/
  │   │   ├── auth.routes.ts
  │   │   ├── public.routes.ts
  │   │   ├── dashboard.routes.ts
  │   │   ├── admin.routes.ts
  │   │   └── upload.routes.ts
  │   ├── controllers/
  │   │   ├── auth.controller.ts
  │   │   ├── public.controller.ts
  │   │   ├── dashboard.controller.ts
  │   │   ├── admin.controller.ts
  │   │   └── upload.controller.ts      ← local disk upload/delete
  │   ├── middleware/
  │   │   ├── authenticate.ts
  │   │   ├── authorize.ts
  │   │   ├── rateLimiter.ts
  │   │   ├── sanitize.ts
  │   │   └── errorHandler.ts
  │   ├── utils/
  │   │   ├── jwt.utils.ts
  │   │   ├── hash.utils.ts
  │   │   ├── slug.utils.ts
  │   │   ├── csv.utils.ts
  │   │   ├── email.utils.ts            ← sends to mailpit
  │   │   └── image.utils.ts            ← sharp resize/compress/webp + delete
  │   ├── seed.ts
  │   └── server.ts
  ├── tsconfig.json
  └── package.json

── database.ts ──
  - Connect to MONGODB_URI with retry logic (10 retries, 5s apart)
  - Log connection status
  - Export connectDB()

── storage.ts ──
  Configure multer diskStorage:
    destination: (req, file, cb) => {
      const category = (req.query.category as string) || 'content';
      const validCategories = ['profile', 'project', 'blog', 'content'];
      const dir = validCategories.includes(category) ? category : 'content';
      const fullPath = `/srv/uploads/${dir}`;
      fs.mkdirSync(fullPath, { recursive: true });
      cb(null, fullPath);
    }
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}-${Date.now()}.tmp`);
    }
  fileFilter: reject non-image MIME types
  limits: { fileSize: 10 * 1024 * 1024 }
  Export: multer({ storage, fileFilter, limits }) as uploadMiddleware

── email.ts ──
  Nodemailer transporter:
    host: process.env.SMTP_HOST    (= 'mailpit' in Docker, 'localhost' in local dev)
    port: parseInt(process.env.SMTP_PORT)   (= 1025)
    secure: false
    auth: undefined  (Mailpit needs no auth)
  Export: transporter

── server.ts ──
  - Express app setup
  - Mount express.static('/srv/uploads', ...) at /uploads route
    This serves files at http://localhost:5000/uploads/profiles/abc.webp
    Cache-Control: public, max-age=31536000, immutable (uploaded files never change)
  - All other middleware, routes, error handler
  - Call connectDB() then app.listen(5000)

── DATABASE MODELS ──

USER MODEL: same as before
PROJECT MODEL: same as before
  featuredImage: string   ← now stores '/uploads/projects/abc.webp'
BLOG MODEL: same as before
  featuredImage: string   ← now stores '/uploads/blogs/abc.webp'
MESSAGE MODEL: same as before
SITE CONFIG MODEL: same as before
  hero.backgroundImage: string  ← '/uploads/content/abc.webp' or ''

── API ROUTES ──

PUBLIC (no auth):
  GET  /api/v1/site-config
  GET  /api/v1/projects
  GET  /api/v1/projects/:slug
  GET  /api/v1/blogs
  GET  /api/v1/blogs/:slug
  GET  /api/v1/developers
  GET  /api/v1/developers/:slug
  POST /api/v1/messages            (rate limited: 3/hr)

AUTH:
  POST /api/v1/auth/login          (rate limited: 5/15min)
  POST /api/v1/auth/logout
  POST /api/v1/auth/refresh
  GET  /api/v1/auth/me

DASHBOARD (authenticate required):
  GET    /api/v1/dashboard/stats
  GET    /api/v1/dashboard/blogs
  POST   /api/v1/dashboard/blogs
  PUT    /api/v1/dashboard/blogs/:id
  DELETE /api/v1/dashboard/blogs/:id   ← also deletes featuredImage file from disk
  GET    /api/v1/dashboard/projects
  POST   /api/v1/dashboard/projects
  PUT    /api/v1/dashboard/projects/:id
  DELETE /api/v1/dashboard/projects/:id  ← also deletes featuredImage from disk
  PUT    /api/v1/dashboard/profile       ← if photo replaced, delete old file
  POST   /api/v1/upload/image            ← multer + sharp → save to /srv/uploads/
  DELETE /api/v1/upload/image            ← delete file from /srv/uploads/

ADMIN (authenticate + authorize('admin')):
  GET/PUT /api/v1/admin/site-config
  GET     /api/v1/admin/developers
  POST    /api/v1/admin/developers
  PUT     /api/v1/admin/developers/:id
  DELETE  /api/v1/admin/developers/:id   (soft delete: isActive=false)
  GET     /api/v1/admin/projects
  DELETE  /api/v1/admin/projects/:id
  GET     /api/v1/admin/blogs
  PUT     /api/v1/admin/blogs/:id
  DELETE  /api/v1/admin/blogs/:id
  GET     /api/v1/admin/messages
  PUT     /api/v1/admin/messages/:id
  DELETE  /api/v1/admin/messages/:id
  GET     /api/v1/admin/messages/export

── MIDDLEWARE ──

authenticate.ts: JWT cookie → verify → attach req.user
authorize.ts: role check → 403 if insufficient
rateLimiter.ts: loginLimiter (5/15min), contactLimiter (3/hr), 
                apiLimiter (100/15min), uploadLimiter (20/hr)
sanitize.ts: sanitize-html config for rich text
errorHandler.ts: 11000→409, validation→400, JWT→401, multer size→413, else→500

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHARED PACKAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

packages/types/index.ts:
  IUser, IProject, IBlog, IMessage, ISiteConfig
  DTOs: BlogCreateDTO, ProjectCreateDTO, ProfileUpdateDTO, etc.
  ApiResponse<T>, PaginatedResponse<T>
  UploadResponse: { url: string }   ← url is relative path like /uploads/...

packages/validators/index.ts:
  loginSchema, blogCreateSchema, projectCreateSchema, profileUpdateSchema,
  contactMessageSchema, siteConfigSchema, developerCreateSchema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECURITY REQUIREMENTS (ALL MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.  bcryptjs, salt rounds 12
2.  JWT in HttpOnly, Secure, SameSite=Strict cookies
3.  Access token: 15 min. Refresh token: 7 days. Rotation on refresh.
4.  Rate limiting: login (5/15min), contact (3/hr), API (100/15min), upload (20/hr)
5.  helmet() with CSP including the API origin for img-src (for serving uploads)
6.  CORS: allowedOrigins = [PUBLIC_WEB_URL, ADMIN_URL], credentials: true
7.  Zod validation on every request body
8.  sanitize-html on all rich text before storage and before rendering
9.  Mongoose only — no raw query strings
10. CSRF: SameSite=Strict + Origin header check
11. Role check before every protected controller
12. isActive check on every authenticated request
13. Soft delete only for users
14. IP stored as SHA-256 hash in Messages
15. JWT payload: only { userId, role }
16. File upload security:
      - MIME type validation in multer fileFilter
      - File size limit: 10MB enforced by multer
      - Filename: UUID-based, never use original client filename
      - Path traversal prevention: never use req.body for file paths
      - Serve uploads as static files — never execute them
      - sharp re-encodes all images (strips EXIF, prevents polyglot attacks)
17. Nginx: X-Frame-Options, X-Content-Type-Options headers
18. Uploads directory must NOT be inside any app's source tree
    It lives at project root /uploads/, mounted as Docker volume

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEVOPS & DEPLOYMENT — ALL LOCAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

docker-compose.yml — GENERATE THIS EXACTLY:

services:

  mongo:
    image: mongo:7.0
    container_name: brikienlabs_mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: brikienlabs
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

  mailpit:
    image: axllent/mailpit:latest
    container_name: brikienlabs_mailpit
    restart: unless-stopped
    ports:
      - "1025:1025"      # SMTP — used by api container
      - "8025:8025"      # Web UI — view sent emails at http://localhost:8025
    environment:
      MP_MAX_MESSAGES: 500
      MP_SMTP_AUTH_ACCEPT_ANY: 1
      MP_SMTP_AUTH_ALLOW_INSECURE: 1

  api:
    build: ./apps/api
    container_name: brikienlabs_api
    restart: unless-stopped
    ports:
      - "5000:5000"
    env_file: .env
    volumes:
      - uploads_data:/srv/uploads        # file storage volume
    depends_on:
      mongo:
        condition: service_healthy
      mailpit:
        condition: service_started

  admin-dashboard:
    build: ./apps/admin-dashboard
    container_name: brikienlabs_admin
    restart: unless-stopped
    ports:
      - "4000:4000"
    env_file: .env
    depends_on:
      - api

  public-web:
    build: ./apps/public-web
    container_name: brikienlabs_public
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - api

volumes:
  mongo_data:
    name: brikienlabs_mongo_data
  uploads_data:
    name: brikienlabs_uploads_data    # all uploaded files persist here

nginx.conf — GENERATE THIS EXACTLY:

  upstream public_web  { server public-web:3000; }
  upstream admin_dash  { server admin-dashboard:4000; }
  upstream api_server  { server api:5000; }

  # Public website
  server {
    listen 80;
    server_name public.brikienlabs.tech;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    location / {
      proxy_pass http://public_web;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }

  # Admin dashboard — optionally IP-restricted
  server {
    listen 80;
    server_name admin.brikienlabs.tech;
    # Uncomment to restrict by IP:
    # allow 203.0.113.0/24;
    # deny all;
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    location / {
      proxy_pass http://admin_dash;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }

  # API + static file serving for uploads
  server {
    listen 80;
    server_name api.brikienlabs.tech;

    # Serve uploaded files directly from disk — bypasses Node.js entirely
    location /uploads/ {
      alias /srv/uploads/;
      expires 1y;
      add_header Cache-Control "public, immutable";
      add_header X-Content-Type-Options "nosniff";
      # Prevent execution of uploaded files
      location ~* \.(php|pl|py|sh|cgi)$ { deny all; }
    }

    location / {
      proxy_pass http://api_server;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      # Increase limit for file uploads
      client_max_body_size 15M;
    }
  }

  # Mailpit web UI — internal only, protect in production
  server {
    listen 80;
    server_name mail.brikienlabs.tech;
    # Restrict to local network in production:
    # allow 127.0.0.1;
    # deny all;
    location / {
      proxy_pass http://mailpit:8025;
      proxy_set_header Host $host;
    }
  }

  NOTE: nginx container must also mount the uploads volume:
  volumes:
    - uploads_data:/srv/uploads:ro   # read-only — nginx only reads, api writes

.env.example — EVERY VARIABLE DOCUMENTED:

  # ── API SERVER ──────────────────────────────────────────────
  NODE_ENV=development
  PORT=5000

  # MongoDB — local Docker container
  MONGODB_URI=mongodb://mongo:27017/brikienlabs
  # For local dev WITHOUT Docker: mongodb://localhost:27017/brikienlabs

  # JWT secrets — generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ACCESS_TOKEN_SECRET=        # min 64 chars random hex
  REFRESH_TOKEN_SECRET=       # min 64 chars random hex, DIFFERENT from above
  ACCESS_TOKEN_EXPIRES=15m
  REFRESH_TOKEN_EXPIRES=7d

  # ── File Storage — LOCAL DISK (no Cloudinary) ────────────────
  UPLOADS_BASE_PATH=/srv/uploads   # path inside api Docker container
  MAX_FILE_SIZE_MB=10

  # ── CORS ─────────────────────────────────────────────────────
  PUBLIC_WEB_URL=http://localhost:3000
  ADMIN_URL=http://localhost:4000

  # ── Email — Mailpit local SMTP ────────────────────────────────
  SMTP_HOST=mailpit            # Docker service name (use 'localhost' without Docker)
  SMTP_PORT=1025               # Mailpit SMTP port (no auth required)
  SMTP_FROM=noreply@brikienlabs.tech
  # View sent emails at: http://localhost:8025

  # ── Frontend — apps/public-web ───────────────────────────────
  NEXT_PUBLIC_API_URL=http://localhost:5000

  # ── Frontend — apps/admin-dashboard ─────────────────────────
  NEXT_PUBLIC_API_URL=http://localhost:5000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED DATA (apps/api/src/seed.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Seed script:
  - Connect via connectDB()
  - Clear all collections
  - Create:
      1 admin:  name="Abhay", email="admin@brikienlabs.tech", pw="Admin@123456",
                role="admin", slug="abhay", photo='' (no photo yet)
      2 devs:   realistic names, skills, bios, social links, photo=''
      3 projects: 1 completed + linked blog, 1 in-progress, 1 upcoming
                  featuredImage='' (no image yet — uploadable after login)
      2 blogs:  1 published (multi-paragraph HTML), 1 draft. featuredImage=''
      1 SiteConfig: startupName="Brikien Labs", realistic tagline + about + contact
                    hero.useGradient=true, hero.backgroundImage=''
      2 messages: 1 read, 1 unread
  - Log each step with ✓ prefix
  - End: "✅ Seed complete. Login: admin@brikienlabs.tech / Admin@123456"
  - process.exit(0) on success, process.exit(1) on error

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
README.md REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate a complete README.md:

  1. Project overview — "100% self-hosted, zero cloud dependencies"
  2. ASCII architecture diagram showing all 5 services + upload volume
  3. Port allocation:
       Public website:    http://localhost:3000
       Admin dashboard:   http://localhost:4000
       API:               http://localhost:5000
       MongoDB:           localhost:27017
       Mailpit SMTP:      localhost:1025
       Mailpit Web UI:    http://localhost:8025
  4. Prerequisites: Node 20, pnpm, Docker + Docker Compose
     NO external accounts needed (no Atlas, no Cloudinary, no SendGrid)
  5. Quick start:
       git clone ...
       cp .env.example .env
       # Fill in JWT secrets (only required secrets — no cloud keys needed)
       docker-compose up --build -d
       docker exec brikienlabs_api pnpm seed
       # Open http://localhost:3000 (public) and http://localhost:4000 (admin)
  6. File storage:
       - Uploads stored in Docker volume: brikienlabs_uploads_data
       - Host-accessible path: inspect with `docker volume inspect brikienlabs_uploads_data`
       - Backup: `docker run --rm -v brikienlabs_uploads_data:/data -v $(pwd):/backup
                  alpine tar czf /backup/uploads-backup.tar.gz /data`
  7. Email (Mailpit):
       - All emails go to Mailpit — view at http://localhost:8025
       - No real emails sent during development
       - To use real email in production: change SMTP_HOST/PORT/USER/PASS in .env
  8. MongoDB management:
       - View data: MongoDB Compass → mongodb://localhost:27017
       - Wipe data: docker-compose down -v (WARNING: deletes all data + uploads)
       - Backup: docker exec brikienlabs_mongo mongodump --out /backup
  9. Running without Docker (local dev):
       - Install MongoDB locally, start mongod
       - Install Mailpit locally: https://github.com/axllent/mailpit
       - Set MONGODB_URI=mongodb://localhost:27017/brikienlabs
       - Set SMTP_HOST=localhost SMTP_PORT=1025
       - pnpm dev
  10. Default credentials: admin@brikienlabs.tech / Admin@123456
  11. Production hardening checklist:
        ✓ Restrict admin.brikienlabs.tech to your IP in nginx.conf
        ✓ Enable SSL with certbot
        ✓ Set NODE_ENV=production
        ✓ Generate strong JWT secrets
        ✓ Set up automated volume backups (cron)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE CODE QUALITY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✦ ZERO placeholder comments. Every function body complete.
  ✦ ZERO "// add your logic here". Write the logic.
  ✦ ZERO truncation. Every file written in full.
  ✦ TypeScript strict mode. No implicit `any`.
  ✦ Consistent naming: camelCase vars, PascalCase components, kebab-case files
  ✦ Every controller: { success: true, data: T } or { success: false, error: string }
  ✦ All API calls via centralized lib/api.ts Axios instance — no raw fetch()
  ✦ All images: Next.js <Image> component, src via getImageUrl() helper
  ✦ All forms: React Hook Form + Zod — no uncontrolled inputs
  ✦ Date formatting: date-fns only
  ✦ No magic numbers — named constants
  ✦ Image cleanup: when a record with an image is deleted, deleteImage() is called
  ✦ No Cloudinary imports anywhere — if you write one, you have made an error
  ✦ pnpm-lock.yaml committed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATION ORDER — FOLLOW EXACTLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PHASE 1 — MONOREPO FOUNDATION
    1.  pnpm-workspace.yaml
    2.  Root package.json (workspace scripts)
    3.  packages/types/index.ts
    4.  packages/validators/index.ts

  PHASE 2 — API SERVER (apps/api)
    5.  package.json + tsconfig.json
    6.  src/config/database.ts          ← retry logic mandatory
    7.  src/config/storage.ts           ← multer local disk (NO cloudinary)
    8.  src/config/email.ts             ← nodemailer → mailpit:1025
    9.  src/models/User.model.ts
    10. src/models/Project.model.ts
    11. src/models/Blog.model.ts
    12. src/models/Message.model.ts
    13. src/models/SiteConfig.model.ts
    14. src/utils/jwt.utils.ts
    15. src/utils/hash.utils.ts
    16. src/utils/slug.utils.ts
    17. src/utils/csv.utils.ts
    18. src/utils/email.utils.ts        ← sends to mailpit
    19. src/utils/image.utils.ts        ← sharp resize/webp + deleteImage()
    20. src/middleware/authenticate.ts
    21. src/middleware/authorize.ts
    22. src/middleware/rateLimiter.ts
    23. src/middleware/sanitize.ts
    24. src/middleware/errorHandler.ts
    25. src/controllers/auth.controller.ts
    26. src/controllers/public.controller.ts
    27. src/controllers/dashboard.controller.ts
    28. src/controllers/admin.controller.ts
    29. src/controllers/upload.controller.ts  ← local disk upload/delete
    30. src/routes/auth.routes.ts
    31. src/routes/public.routes.ts
    32. src/routes/dashboard.routes.ts
    33. src/routes/admin.routes.ts
    34. src/routes/upload.routes.ts
    35. src/server.ts                   ← express.static for /srv/uploads
    36. src/seed.ts

  PHASE 3 — ADMIN DASHBOARD (apps/admin-dashboard)
    37. package.json + tsconfig.json + next.config.ts + tailwind.config.ts
    38. app/layout.tsx
    39. app/login/page.tsx
    40. context/AuthContext.tsx
    41. lib/api.ts
    42. lib/auth.ts
    43. lib/utils.ts                    ← getImageUrl helper
    44. hooks/useAuth.ts
    45. hooks/useDebounce.ts
    46. components/layout/Sidebar.tsx
    47. components/layout/Topbar.tsx
    48. components/layout/AuthGuard.tsx
    49. components/shared/TagInput.tsx
    50. components/shared/ConfirmModal.tsx
    51. components/shared/StatusBadge.tsx
    52. components/editor/TipTapEditor.tsx
    53. components/editor/ImageUpload.tsx   ← local API upload, NO Cloudinary
    54. components/dashboard/StatsCard.tsx
    55. components/dashboard/ActivityFeed.tsx
    56. components/tables/BlogsTable.tsx
    57. components/tables/ProjectsTable.tsx
    58. components/tables/DevelopersTable.tsx
    59. components/tables/MessagesTable.tsx
    60. components/forms/BlogForm.tsx
    61. components/forms/ProjectForm.tsx
    62. components/forms/ProfileForm.tsx
    63. components/forms/DeveloperForm.tsx
    64. components/forms/HomepageForm.tsx
    65. app/dashboard/layout.tsx
    66. app/dashboard/page.tsx
    67. app/dashboard/blogs/page.tsx
    68. app/dashboard/blogs/new/page.tsx
    69. app/dashboard/blogs/[id]/edit/page.tsx
    70. app/dashboard/projects/page.tsx
    71. app/dashboard/projects/new/page.tsx
    72. app/dashboard/projects/[id]/edit/page.tsx
    73. app/dashboard/profile/page.tsx
    74. app/dashboard/admin/homepage/page.tsx
    75. app/dashboard/admin/developers/page.tsx
    76. app/dashboard/admin/developers/[id]/edit/page.tsx
    77. app/dashboard/admin/blogs/page.tsx
    78. app/dashboard/admin/projects/page.tsx
    79. app/dashboard/admin/messages/page.tsx

  PHASE 4 — PUBLIC WEBSITE (apps/public-web)
    80.  package.json + tsconfig.json + next.config.ts + tailwind.config.ts
    81.  app/layout.tsx
    82.  lib/api.ts
    83.  lib/utils.ts                   ← getImageUrl helper
    84.  components/layout/Navbar.tsx
    85.  components/layout/Footer.tsx
    86.  components/shared/StatusBadge.tsx
    87.  components/shared/TechChip.tsx
    88.  components/shared/SkeletonCard.tsx
    89.  components/shared/AnimatedSection.tsx
    90.  components/shared/RichTextRenderer.tsx
    91.  components/home/HeroSection.tsx
    92.  components/home/AboutSection.tsx
    93.  components/home/ProjectsPreview.tsx
    94.  components/home/TeamSection.tsx
    95.  components/home/ContactSection.tsx
    96.  components/projects/ProjectCard.tsx
    97.  components/projects/ProjectFilters.tsx
    98.  components/projects/ProjectGrid.tsx
    99.  components/blog/BlogCard.tsx
    100. components/developers/DeveloperCard.tsx
    101. app/page.tsx
    102. app/projects/page.tsx
    103. app/projects/[slug]/page.tsx
    104. app/developers/[slug]/page.tsx
    105. app/blog/page.tsx
    106. app/blog/[slug]/page.tsx
    107. app/not-found.tsx
    108. app/error.tsx

  PHASE 5 — DEVOPS
    109. docker-compose.yml             ← 5 services: mongo+mailpit+api+admin+public
    110. apps/public-web/Dockerfile
    111. apps/admin-dashboard/Dockerfile
    112. apps/api/Dockerfile
    113. nginx.conf                     ← includes /uploads/ static serving
    114. .env.example
    115. README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BEGIN INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Output this confirmation first:
   "✅ System understood. Building Brikien Labs — fully local, zero cloud.
   5 services: Public :3000 | Admin :4000 | API :5000 | MongoDB :27017 | Mailpit :1025/:8025
   File storage: local disk Docker volume. Email: Mailpit. No external accounts.
   Starting Phase 1."

2. Immediately begin Phase 1, file 1. Zero preamble.

3. After each file:  ═══════════════════ [filename] ✓ ═══════════════════

4. If output ends mid-file:
   ">>> CONTINUING — Part [N] — Resume from: [filename]"

5. Never re-explain. Never ask to continue. Just build.

Start now.