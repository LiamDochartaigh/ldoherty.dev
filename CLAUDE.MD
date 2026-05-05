# Project

React project for my personal portfolio. It's primarily for learning React and showing off my previous projects.
It will be an SPA.
---

# Stack

- **Framework**: React
- **Language**: TypeScript
- **Routing**: TanStack Router
- **Styling**: > Tailwind
- **State**: > Zustand
- **Data fetching**: > TanStack Query
- **Testing**: > Vitest

---

# Architecture

Feature-based vertical slicing. Every feature lives in `src/features/<name>/`.

## Folder structure

```
src/
  app/
    main.tsx                    # entry point, router config and root providers
  routes/                       # route definitions + composition
    __root.tsx                  # root layout — navbar, providers, outlet
    index.tsx                   # /
    <route>.tsx                 # one file per route
  features/
    <feature-name>/
      components/               # UI for this feature only
      hooks/                    # state and logic
      api.ts                    # only if transformation or orchestration needed
      types.ts
      index.ts                  # public contract — only export what outside needs
  shared/
    api/                        # only if external APIs are needed
      <service-name>/
        client.ts               # base fetch, auth headers, base URL — always exists
        <resource>.ts           # one file per API resource group
    components/                 # zero business logic
    hooks/
    utils/                      # generic helper functions with no business logic or UI
```

---

# Rules

## Imports
- Always import from `features/<name>` never from deep inside e.g. `features/auth/components/LoginForm`
- Features must not import from each other directly
- Cross-feature communication goes through shared store or URL params
- Dependency direction: `routes → features → shared`

## Features
- A feature = something the user *does*, not something the UI renders
- If it has its own API call and meaningful local state → it's a feature
- If it's purely compositional → it's a page or shared component

## API layer
- Raw fetch calls never live in components or hooks
- Feature `api.ts` only exists when transformation or multi-call orchestration is needed
- Otherwise call shared API layer directly from hooks

## Pages
- Pages are composition only — they assemble features, nothing else
- If a page has its own hooks or API calls, extract them into a feature

## Tests
- Co-locate test files next to the file they test (`useChat.ts` → `useChat.test.ts`)
- E2e tests live in top-level `e2e/` folder
- One test file per module, not one test file per feature

## index.ts
- Every feature must have an `index.ts` that defines its public API
- Only export what other layers actually need — keep internals internal

---

# Commands

```bash
# Install
pnpm install

# Dev server
pnpm dev

# Tests
pnpm test

# Build
pnpm build
```

---

# Do not

- Write raw fetch calls inside components or hooks
- Import across features directly
- Add business logic to shared components
- Create a feature `api.ts` as a passthrough with no transformation — call shared directly
- Export internal implementation details from `index.ts`