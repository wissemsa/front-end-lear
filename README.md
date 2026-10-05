# PortfolioCraft

**A customizable, editorial-style developer portfolio with a built-in live editor, project showcase, service blueprints, and a working contact pipeline.**

PortfolioCraft is a single-page portfolio for software engineers, product architects, and creative technologists. Every piece of content, from the hero headline to project case studies, can be edited in the browser through an integrated **Studio Editor**, with changes applied instantly and saved automatically. No code changes are needed to make it yours.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Customization](#customization)
- [Contact Form & Integrations](#contact-form--integrations)
- [Project Structure](#project-structure)
- [Data Persistence](#data-persistence)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Features

### Portfolio Sections

- **Hero**: split-screen layout with oversized editorial typography, rotating role titles, an availability badge, a portrait with caption, and a grid of quantitative proof metrics.
- **Marquee ribbon**: an animated text band highlighting core disciplines.
- **Selected Works**: a media-first bento grid of projects. Each opens in a lightbox case study covering an executive summary, the technical challenge, the system architecture, and measurable outcomes, with links to the live site and repository.
- **Services & Capabilities**: numbered service blueprints with deliverables, timeline, investment range, ideal client, and a supporting proof point, each expandable into a detail modal.
- **About & Experience**: a personal introduction, core disciplines, and an experience timeline with impact summaries.
- **Testimonials**: attributable client quotes paired with before-state and outcome metrics.
- **Contact**: a project brief form, a direct WhatsApp shortcut, direct email and phone details, and a log of recently submitted inquiries.

### Studio Editor

A slide-in drawer that edits the portfolio live across five tabs:

| Tab | What you can edit |
| --- | --- |
| **Identity** | Name, wordmark, title, rotating roles, headline, subheadline, location, availability, contact details, hero image, and hero metrics |
| **Projects** | Add, edit, and remove projects, including category, year, role, challenge, architecture, outcome, technologies, and links |
| **Services** | Service titles, summaries, deliverables, timelines, and pricing ranges |
| **About** | Biography, core disciplines, marquee items, experience timeline, and testimonials |
| **Config** | Theme mode, accent color, social profiles, EmailJS credentials, and configuration export |

### Design & Experience

- Two theme modes: **Warm Paper** (light) and **Stark Black** (dark)
- Three accent color options
- Smooth animations powered by Motion
- Resilient image loading with graceful fallbacks
- Keyboard-accessible modals (close with `Esc`)
- Fully responsive layout

### Configuration Export

Export your portfolio configuration as **JSON** (copy or download) or as **Flutter/Dart config files**, useful for sharing a setup or reusing the same content in a Flutter portfolio.

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI framework | React 19 |
| Language | TypeScript |
| Build tooling | Vite |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons | Lucide React |
| Email delivery | EmailJS (optional) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm (bundled with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/wissemsa/front-end-lear.git
cd portfoliocraft

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site is served at **http://localhost:3000**.

### Production Build

```bash
npm run build     # Outputs optimized assets to dist/
npm run preview   # Serves the production build locally
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check the project with `tsc --noEmit` |
| `npm run clean` | Remove build output |

## Customization

There are two ways to make the portfolio your own.

**1. Use the Studio Editor (no code).** Open the editor from the site and update your identity, projects, services, timeline, testimonials, theme, and social links. Changes appear immediately and are saved in your browser.

**2. Edit the defaults in code.** The starting content lives in `src/config/portfolioData.ts` as `DEFAULT_PORTFOLIO_CONFIG`. Update it to change what visitors see by default, and replace the images in `src/assets/images/` with your own.

> The default content is placeholder data. Replace the name, email, phone number, and any other personal details before publishing.

## Contact Form & Integrations

### EmailJS

To receive inquiries by email, create a free [EmailJS](https://www.emailjs.com/) account and enter your **Service ID**, **Template ID**, and **Public Key** (and optionally a **Private Key**) in the Studio Editor's Config tab.

The form sends these template parameters, so make sure your EmailJS template uses them:

| Parameter | Description |
| --- | --- |
| `name` | Sender's name |
| `email` | Sender's email address |
| `service_type` | Service the visitor is interested in |
| `message` | Project brief |
| `to_email` | Your configured contact email |

If EmailJS is not configured, or delivery fails, the inquiry is still recorded in the on-page inquiry log so the form never fails silently.

> EmailJS credentials entered in the editor are stored in the visitor's own browser and used for client-side requests. Use the Public Key for production, and avoid entering a private key on a publicly hosted site.

### WhatsApp

Set your number in the Studio Editor. The WhatsApp button opens a chat with a pre-filled message that includes the visitor's selected service and brief.

## Project Structure

```
portfoliocraft/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                        # Application entry point
    ├── App.tsx                         # Page layout, sections, contact logic
    ├── index.css                       # Tailwind and base styles
    ├── config/
    │   └── portfolioData.ts            # Types and default portfolio content
    ├── assets/images/                  # Portrait and project images
    └── components/
        ├── PortfolioStudioDrawer.tsx   # Live Studio Editor
        ├── ProjectLightboxModal.tsx    # Project case study modal
        ├── ServiceDetailModal.tsx      # Service blueprint modal
        └── ResilientImage.tsx          # Image component with fallback
```

## Data Persistence

Customizations made in the Studio Editor are stored in the browser's `localStorage` and restored on the next visit. They apply only to the browser where they were made. To publish changes for all visitors, export your configuration and copy it into `DEFAULT_PORTFOLIO_CONFIG` in `src/config/portfolioData.ts`, then rebuild. A reset action restores the original defaults.

## Deployment

PortfolioCraft builds to a static site, so it can be hosted on any static hosting provider, such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

```bash
npm run build
```

Deploy the generated `dist/` directory.

## Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and run `npm run lint` to confirm the project type-checks
3. Commit with a clear message and open a pull request describing the change

## License

Add your preferred license here (for example MIT) and include a `LICENSE` file in the repository root.
