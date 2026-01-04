# 🚀 Full-Stack Portfolio Website

A modern, scalable **personal portfolio website** built with **Next.js, TypeScript, TailwindCSS, MongoDB, and Cloudinary**, featuring an **admin-only dashboard** for managing content without code changes.

---

## 📌 Project Overview

This project is a **full-stack portfolio website** designed to showcase professional skills, projects, and experience.  
The website follows **industry-standard architecture** with a hybrid content strategy:
- **Static content** for branding
- **Dynamic content** managed via an **admin panel**

Only the **admin (owner)** can log in and update content.

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS
- ShadCN UI
- Framer Motion (animations)

### Backend
- Next.js API Routes
- MongoDB + Mongoose
- Cloudinary (image storage)

### Auth & Security
- Admin-only authentication
- Middleware-protected routes
- Environment-based secrets

### Deployment
- Vercel
- MongoDB Atlas
- Cloudinary CDN

---

## 🎯 Target Users

- Recruiters & Hiring Managers
- Freelance Clients
- Tech Community

---

## 🧠 Content Strategy (Hybrid)

| Content Type | Storage | Reason |
|-------------|--------|--------|
| Name, bio, role | Hardcoded | Rarely changes |
| Skills | MongoDB | Frequently updated |
| Projects | MongoDB | Grows over time |
| Experience | MongoDB | Needs updates |
| Images | Cloudinary | Optimized & CDN |
| Contact messages | MongoDB | Dynamic |

---

## 🔐 Access Control

### Roles
- **Admin (only one)** → Full CRUD access
- **Public users** → Read-only

There is **no public registration**.

---

## 🌍 Public Website Features

### 🏠 Home
- Hero section
- Short intro
- CTA buttons
- Social links

### 👤 About
- Bio
- Education
- Experience summary
- Resume download

### 🛠 Skills
- Categorized skills
- Proficiency levels
- Auto-updated from database

### 📂 Projects
- Project listing
- Filters (Frontend / Full-Stack / AI)
- Live demo & GitHub links
- Cloudinary-hosted images

### 🧑‍💼 Experience
- Timeline-based layout
- Tech stack per role

### 📬 Contact
- Contact form
- Message storage in DB
- Admin view panel

---

## 🔑 Admin Panel Features

### Authentication
- Admin-only login
- Protected routes (`/admin/*`)

### 📊 Dashboard
- Total projects
- Total skills
- Unread messages
- Quick actions

### 🛠 Skills Management
- Add / Edit / Delete skills
- Category & level control
- Sorting & visibility toggle

### 📂 Projects Management
- Add / Edit / Delete projects
- Tech stack tags
- Featured projects
- Image upload via Cloudinary

### 🧑‍💼 Experience Management
- Add / Edit / Delete experience
- Timeline ordering

### 📬 Messages
- View contact messages
- Mark as read
- Delete messages

### ⚙️ Settings (Optional)
- Change admin password
- SEO defaults

---

## ☁️ Cloudinary Integration

### Why Cloudinary?
- No local image storage
- Automatic optimization
- CDN delivery
- Fast & SEO-friendly

### Image Flow
1. Admin uploads image
2. Image sent to Cloudinary
3. Cloudinary returns `secure_url` & `public_id`
4. Only URLs stored in MongoDB
5. Images rendered via Next.js `<Image />`

### Stored Data Example

```typescript
images: [
  {
    url: string,
    publicId: string,
    alt: string,
    order: number
  }
]
```

---

## 🗄 Database Schemas

### Admin User

```typescript
{
  name: string
  email: string
  passwordHash: string
  role: "admin"
}
```

### Skill

```typescript
{
  name: string
  category: string
  level: number
  order: number
  isActive: boolean
}
```

### Project

```typescript
{
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  images: Image[]
  isFeatured: boolean
}
```

### Experience

```typescript
{
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string
  techStack: string[]
}
```

### Contact Message

```typescript
{
  name: string
  email: string
  message: string
  isRead: boolean
}
```

---

# 🧱 Scalable & Modular Architecture Documentation

**Next.js App Router | TypeScript | MongoDB | Cloudinary | TailwindCSS**

This document describes the **full scalable folder structure**, **architectural decisions**, and **admin-controlled theming system** for a professional personal portfolio website.

---

## 🌳 High-Level Project Structure

```
portfolio/
├─ src/
│ ├─ app/
│ ├─ modules/
│ ├─ components/
│ ├─ lib/
│ ├─ services/
│ ├─ hooks/
│ ├─ store/
│ ├─ styles/
│ ├─ types/
│ ├─ constants/
│ ├─ utils/
│ └─ middleware.ts
│
├─ public/
├─ .env.local
├─ next.config.js
├─ tailwind.config.ts
├─ tsconfig.json
└─ README.md
```

### ✅ Why this structure?
- Separates **UI**, **business logic**, **data**, and **infrastructure**
- Easy to scale and maintain
- Mirrors real-world SaaS architecture
- Interview & recruiter friendly

---

## 📁 `src/app/` → Routing & Layouts (App Router)

```
app/
├─ layout.tsx              // Root layout
├─ page.tsx                // Home page
├─ not-found.tsx
├─ loading.tsx
│
├─ about/
│ └─ page.tsx
│
├─ projects/
│ ├─ page.tsx
│ └─ [slug]/
│   └─ page.tsx
│
├─ contact/
│ └─ page.tsx
│
├─ admin/
│ ├─ layout.tsx
│ ├─ login/
│ │ └─ page.tsx
│ ├─ dashboard/
│ │ └─ page.tsx
│ ├─ projects/
│ │ ├─ page.tsx
│ │ ├─ new/
│ │ │ └─ page.tsx
│ │ └─ [id]/edit/
│ │   └─ page.tsx
│ ├─ skills/
│ ├─ experience/
│ └─ messages/
│
└─ api/
  ├─ auth/
  ├─ projects/
  ├─ skills/
  ├─ experience/
  ├─ contact/
  └─ upload/
```

### Why this works
- Clean URL mapping
- Admin area fully isolated
- API routes clearly separated
- Easy to add blog, testimonials, analytics later

---

## 🧩 `src/modules/` → Feature-Based Architecture ⭐ (Very Important)

```
modules/
├─ projects/
│ ├─ components/
│ ├─ services.ts
│ ├─ hooks.ts
│ ├─ schema.ts
│ └─ types.ts
│
├─ skills/
│ ├─ components/
│ ├─ services.ts
│ ├─ schema.ts
│ └─ types.ts
│
├─ experience/
│ ├─ components/
│ ├─ services.ts
│ ├─ schema.ts
│ └─ types.ts
│
├─ auth/
│ ├─ services.ts
│ ├─ guards.ts
│ └─ types.ts
│
├─ contact/
│ ├─ services.ts
│ └─ types.ts
│
└─ cloudinary/
  ├─ upload.ts
  ├─ delete.ts
  └─ types.ts
```

### Why this is professional
- ✔ Feature isolation
- ✔ Easy maintenance
- ✔ Scales like SaaS
- ✔ Interview-approved

---

## 🧱 `src/components/` → Shared UI Components

```
components/
├─ ui/                     // ShadCN UI components
├─ layout/
│ ├─ Navbar.tsx
│ ├─ Footer.tsx
│ └─ Sidebar.tsx
├─ common/
│ ├─ Button.tsx
│ ├─ Modal.tsx
│ ├─ Loader.tsx
│ └─ EmptyState.tsx
```

Reusable across **public website and admin panel**.

---

## 🔌 `src/services/` → External Integrations

```
services/
├─ apiClient.ts            // Fetch wrapper
├─ mongodb.ts
├─ cloudinary.ts
├─ auth.ts
└─ email.ts                // Future use
```

Keeps infrastructure **clean, centralized, and reusable**.

---

## 🧠 `src/hooks/` → Custom Hooks

```
hooks/
├─ useAuth.ts
├─ useProjects.ts
├─ useSkills.ts
└─ useDebounce.ts
```

---

## 🗂 `src/types/` → Global Types

```
types/
├─ project.ts
├─ skill.ts
├─ experience.ts
├─ user.ts
└─ api.ts
```

---

## 📌 `src/constants/` → Static Config

```
constants/
├─ site.ts                 // Name, socials, bio
├─ seo.ts
└─ routes.ts
```

---

## 🛠 `src/utils/` → Helper Functions

```
utils/
├─ slugify.ts
├─ formatDate.ts
├─ validators.ts
└─ logger.ts
```

---

## 🎨 `src/styles/`

```
styles/
├─ globals.css
├─ theme.css
└─ animations.css
```

---

## 🧪 `src/store/` → Redux Toolkit State Management

```
store/
├─ store.ts                 // Redux store configuration
├─ hooks.ts                 // Typed hooks (useAppDispatch, useAppSelector)
├─ slices/                  // Redux slices
│ ├─ authSlice.ts
│ ├─ uiSlice.ts
│ ├─ projectsSlice.ts
│ ├─ skillsSlice.ts
│ ├─ experienceSlice.ts
│ └─ themeSlice.ts
├─ middleware/              // Custom Redux middleware
└─ types/                   // Redux-related types
```

**Redux Toolkit** for centralized state management.

---

## 🔐 `src/middleware.ts`

```
middleware.ts
```

**Responsibilities:**
- Protect `/admin/*`
- Check admin session
- Redirect unauthenticated users

---

## ☁️ `public/`

```
public/
├─ favicon.ico
├─ resume.pdf
└─ og-image.png
```

---

# 🎨 Admin-Controlled Theme System

A **premium, SaaS-level feature** allowing the admin to control the entire website theme from the dashboard.

---

## 🎯 Goal

- Admin selects theme from dropdown
- Theme saved in database
- Public + admin UI updates automatically
- No redeploy
- Fully scalable

---

## 🧠 Core Idea (Best Practice)

**CSS Variables + TailwindCSS + MongoDB**

- Tailwind → layout & utilities
- CSS variables → colors & design tokens
- MongoDB → active theme storage

---

## 🧩 High-Level Theme Flow

```
Admin selects theme
    ↓
Theme saved in MongoDB
    ↓
Theme loaded on app start (server-side)
    ↓
CSS variables applied to <html>
    ↓
Entire app adopts theme
```

---

## 🗄 Theme Data Model (MongoDB)

```typescript
Theme {
  _id
  name
  isActive
  variables: {
    primary
    secondary
    background
    foreground
    accent
    border
  }
}
```

### Example

```json
{
  "name": "Ocean",
  "isActive": true,
  "variables": {
    "primary": "#0ea5e9",
    "secondary": "#38bdf8",
    "background": "#020617",
    "foreground": "#e5e7eb",
    "accent": "#22d3ee",
    "border": "#1e293b"
  }
}
```

---

## 🎛 Admin Theme Management

### Routes
- `/admin/themes`
- `/admin/themes/new`

### Features
- Select active theme (dropdown/radio)
- Preview theme
- Create new theme
- Edit existing theme
- Only ONE active theme at a time

---

## 🧱 Where Theme Is Applied

**Best place:** `app/layout.tsx`

**Why?**
- Runs server-side
- Prevents FOUC (flash of unstyled content)
- Applies theme before render

---

## 🎨 CSS Variable Strategy (Tailwind-Friendly)

### Design tokens:

```css
--color-primary
--color-secondary
--color-bg
--color-text
--color-accent
--color-border
```

Tailwind utilities reference these variables.

### Result
- ✔ No Tailwind rebuild
- ✔ Unlimited themes
- ✔ Instant switching

---

## 🧩 Theme-Specific Folder Structure

```
modules/
├─ theme/
│  ├─ schema.ts
│  ├─ services.ts
│  ├─ types.ts
│  └─ constants.ts

components/
├─ theme/
│  ├─ ThemeProvider.tsx
│  └─ ThemePreview.tsx
```

---

## 🔄 How Public Pages Update Automatically

1. Pages use Tailwind classes only
2. Tailwind classes map to CSS variables
3. Variables change → UI changes
4. Pages remain theme-agnostic

---

## 🧠 Why NOT Hardcode Themes?

- ❌ Requires redeploy
- ❌ Tailwind rebuild
- ❌ Not scalable
- ❌ No admin control

---

## 🌈 Example Future Themes

| Theme Name | Use Case |
|------------|----------|
| Default | Light |
| Dark Pro | Dark |
| Ocean | Blue |
| Emerald | Green |
| Cyberpunk | Neon |
| Minimal | Gray |

---

## 🔐 Security Rules

**Only admin can:**
- Create themes
- Activate themes

**Public users:**
- Read-only access to active theme

---

## 🧪 Performance Impact

**Negligible**
- Single DB read (or cached)
- Can be ISR cached (24h)

---

## 🔍 SEO & Performance

- Server-side rendering (SSR)
- Incremental Static Regeneration (ISR)
- Optimized images
- Meta tags & OpenGraph
- Sitemap & robots.txt

---

## 🚀 Deployment

- Vercel for frontend & backend
- MongoDB Atlas
- Cloudinary CDN
- Environment variables for secrets

---

## 🔮 Future Enhancements

- Blog (MDX or CMS)
- Testimonials
- Analytics dashboard
- Multi-admin support
- AI chatbot assistant
- Internationalization (i18n)

---

## 🏆 Why This Project Matters

- ✔ Industry-standard architecture
- ✔ Admin-only CMS experience
- ✔ Scalable & maintainable
- ✔ Strong portfolio for interviews & freelancing

---

## 📄 License

MIT License

---

## 👤 Author

**Aftab Bashir**  
Full-Stack Web Developer
