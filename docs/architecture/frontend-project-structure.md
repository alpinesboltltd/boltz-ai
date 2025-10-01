---
title: Frontend Project Structure
sidebar_position: 2
---

Document migrated from original project-structure.md with edits for clarity.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Zustand state management

## High-Level Directories

```text
src/app         # App Router pages & API routes
src/components  # UI components (dashboard, chatbot, common)
src/lib         # API clients & helpers
src/store       # Zustand stores
src/types       # Type definitions
src/utils       # Utility functions
public/         # Static assets & widget.js
```

## Key Feature Areas

1. Landing & Marketing sections
2. Dashboard & analytics
3. Chatbot creation & appearance configuration
4. Knowledge ingestion pipeline (in progress)
5. Widget embedding & API interaction

See roadmap in Architecture docs for upcoming phases.
