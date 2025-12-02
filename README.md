# AI Content Lite

A fast, futuristic, multi-page Next.js application for generating AI-powered social media content. Built with Next.js 14, Tailwind CSS, Framer Motion, and TypeScript.

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom futuristic theme
- **Animations**: Framer Motion
- **Theme**: Dark/Light mode with system preference
- **Testing**: Vitest + React Testing Library

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── create/            # Create post page
│   ├── gallery/           # Gallery page
│   ├── dashboard/         # Dashboard page
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── data/                  # Sample data
├── public/                # Static assets
└── ...

```

## 🎨 Features

- **AI Content Generation**: Mock API route for generating social media posts
- **Multiple Platforms**: Support for LinkedIn, Twitter, Instagram, Facebook, Pinterest
- **Custom Tones**: Professional, Casual, Inspirational, Educational, Friendly
- **Gallery View**: Browse generated content with lazy loading
- **Dashboard**: Track stats and manage generated posts
- **Dark Mode**: Automatic theme switching with system preference
- **Responsive Design**: Mobile-first, works on all devices
- **Performance Optimized**: Code splitting, lazy loading, and optimized images

## 🐛 Troubleshooting

### Node Version

This project requires Node.js 18+ or 20+. Check your version:

```bash
node --version
```

If you need to update Node.js, visit [nodejs.org](https://nodejs.org/).

### Port Already in Use

If port 3000 is already in use, Next.js will automatically try the next available port. Alternatively, you can specify a port:

```bash
PORT=3001 npm run dev
```

### Build Errors

If you encounter build errors:

1. Clear the `.next` directory: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules`
3. Reinstall dependencies: `npm install`
4. Try building again: `npm run build`

## 📝 Environment Variables

Create a `.env.local` file in the project root with your OpenRouter API key to enable real LLM generation. You can use the provided `.env.local.example` as a template.

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

If no key is provided, the app falls back to deterministic sample data to guarantee the UX still works.

### LLM Integration

- The app calls a server-side API route at `POST /api/generate` which proxies requests to OpenRouter's chat completions endpoint (`https://api.openrouter.ai/v1/chat/completions`).
- The server validates the request body (`topic`, `tone`, `platform`) and sends a controlled prompt instructing the model to output JSON only.
- If parsing the model reply fails, or if the `OPENROUTER_API_KEY` is missing, the server returns a deterministic fallback using `data/samplePosts.json` (first entry) and sets `fallback: true` in the response.
- The client page at `/create` sends the form to `/api/generate`, displays a skeleton while waiting, shows generated `main_post`, `variants`, `hashtags`, and `imagePrompt`, and allows adding the package to the gallery which stores it in `localStorage` under the key `ai_content_packages`.


## 📄 License

This project is open source and available for personal and commercial use.

---

Built with ❤️ using Next.js and modern web technologies.
