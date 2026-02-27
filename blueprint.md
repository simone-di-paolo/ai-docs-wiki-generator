# AI Code Wiki System - Project Blueprint

## Overview
The goal is to build an AI-powered documentation generation and reading system. The system leverages a "Docs-as-Code" approach where documentation in Markdown format resides alongside the source code in private repositories. This frontend application (`ai-docs-wiki-generator`) serves as the central hub to read and navigate this documentation via Git provider APIs.

## Design & Features
**Current Version:** 0.1.0

### Key Features Planned:
- **GitHub API Integration**: Read private repositories securely using a Personal Access Token.
- **Redux State Management**: Centralized store for auth, repository lists, and file caching.
- **Dynamic Sidebar**: Render repository file trees dynamically.
- **Markdown Rendering**: Robust parser (`react-markdown` + `remark-gfm`) for GitHub-flavored markdown.
- **History Viewer**: Fetch and show commit history for specific documentation files to track AI revisions.

### Technology Stack:
- **Framework**: React 18, TypeScript, Vite
- **Routing**: React Router DOM
- **State**: Redux Toolkit & React-Redux
- **Icons**: Lucide React
- **Styling**: Tailwind CSS (planned for next step)

## Implementation Plan

### Phase 1: Core Setup & Authentication
- [x] Initial Vite React-TS setup
- [x] Install core dependencies (`redux`, `react-router`, `lucide-react`, etc.)
- [x] Create `.env` file to securely store GitHub Personal Access Token
- [x] Setup Redux Store (`store.ts`) and Auth Slice (`appReducer.ts`)
- [x] Create GitHub API utility service (`githubService.ts`)

### Phase 2: App Layout & Navigation
- [x] SCSS Setup & Styling (Skipped Tailwind per request)
- [x] Build Main Layout (Sidebar + Content Area)
- [x] Implement Sidebar component to navigate the `docs/` folder
- [x] Implement Markdown Viewer component

### Phase 3: Data Fetching & Rendering
- [x] Connect Redux perfectly with API fetching logic
- [x] Render `.md` content directly from private target repository
- [x] Implement History Component with Sub-tabs (Article | History)
- [x] Connect History Component to GitHub API (`/commits` endpoint for the specific file)

### Phase 4: Intelligent AI Docs Automation (Target Repo)
- [ ] Develop a Node.js script in the target repo to replace simple component-based generation.
- [ ] Implement full-repository context analysis (to understand logic regardless of naming conventions).
- [ ] Parse and include existing manual documentation as context for the AI.
- [ ] Generate functional, architectural, and development-level documentation automatically.
- [ ] CI/CD Github Action to automatically trigger the documentation update on codebase changes.

### Phase 5: Omniscient AI Chatbot (Wiki App)
- [ ] Build a floating or split-screen Chat UI within the Wiki.
- [ ] Train/Setup context using the generated documentation (RAG approach or System Prompts).
- [ ] Enable multi-role answers (Developer, Functional Analyst, Product Owner).
