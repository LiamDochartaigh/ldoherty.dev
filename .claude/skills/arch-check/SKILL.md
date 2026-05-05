---
name: arch-check
description: Detect architectural drift and pattern violations. Use when asked to audit the codebase, check for violations, or before a PR/commit.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
---

# Architectural Drift Detection

Scan the codebase for violations of the project's architectural rules defined in CLAUDE.md. Report every violation found with the file path, the rule broken, and a suggested fix.

## Step 1 — Scan for cross-feature imports

Features must never import from each other directly.

```bash
grep -rn "from '.*features/" src/features/ --include="*.ts" --include="*.tsx"
```

Flag any import inside `src/features/<name>/` that imports from a different `src/features/<other>/`.

Valid:
```ts
// inside features/contact-form/
import { Button } from 'shared/components/Button'
```

Violation:
```ts
// inside features/contact-form/
import { useAuth } from 'features/auth/hooks/useAuth'
```

---

## Step 2 — Scan for deep feature imports from outside

Anything outside a feature must only import from the feature's `index.ts`, never from deep inside it.

```bash
grep -rn "from '.*features/[^']*/" src/routes/ src/app/ --include="*.ts" --include="*.tsx"
```

Flag any import that goes deeper than `features/<name>`:

Violation:
```ts
import { ContactForm } from 'features/contact-form/components/ContactForm'
```

Valid:
```ts
import { ContactForm } from 'features/contact-form'
```

---

## Step 3 — Scan for raw fetch calls in components and hooks

Raw fetch calls must never live in components or hooks — they belong in `shared/api/`.

```bash
grep -rn "fetch(" src/features/ src/routes/ --include="*.ts" --include="*.tsx"
grep -rn "axios\." src/features/ src/routes/ --include="*.ts" --include="*.tsx"
```

Flag any `fetch(` or `axios.` call found outside of `shared/api/`.

---

## Step 4 — Scan for business logic in shared components

Shared components must be dumb — no API calls, no feature-specific state, no domain knowledge.

```bash
grep -rn "useQuery\|useMutation\|useStore\|fetch(" src/shared/components/ --include="*.ts" --include="*.tsx"
```

Flag any data fetching or store usage found in `shared/components/`.

---

## Step 5 — Check features have an index.ts

Every feature folder must have a public `index.ts`.

```bash
for dir in src/features/*/; do
  if [ ! -f "${dir}index.ts" ] && [ ! -f "${dir}index.tsx" ]; then
    echo "Missing index.ts in: $dir"
  fi
done
```

Flag any feature folder missing an `index.ts`.

---

## Step 6 — Scan for logic in route files

Route files are composition only — they must not contain hooks, API calls, or local state beyond what TanStack Router provides.

```bash
grep -rn "useState\|useEffect\|useQuery\|useMutation\|fetch(" src/routes/ --include="*.tsx"
```

Flag any of the above found in `src/routes/`. If logic is needed, it should be extracted into a feature.

---

## Step 7 — Scan for passthrough feature api.ts files

A feature `api.ts` that does nothing but re-export a shared function with no transformation is noise.

```bash
find src/features -name "api.ts" | xargs grep -l "."
```

For each `api.ts` found, read the file and check:
- Does it transform the response shape?
- Does it orchestrate multiple calls?

If it is a straight passthrough with no transformation or orchestration, flag it as unnecessary.

---

## Output Format

Report findings in this format:

```
VIOLATION: <rule broken>
FILE: <file path>
LINE: <line number if available>
FIX: <what should be done instead>
```

If no violations are found, report:

```
✓ No architectural drift detected. All rules are being followed.
```

At the end, provide a summary:
```
── Drift Report ──────────────────────
  Cross-feature imports:     N violations
  Deep feature imports:      N violations
  Raw fetch in wrong place:  N violations
  Business logic in shared:  N violations
  Missing index.ts:          N violations
  Logic in route files:      N violations
  Passthrough api.ts:        N violations
  Total:                     N violations
──────────────────────────────────────
```
