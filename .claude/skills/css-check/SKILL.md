---
name: css-check
description: Detect CSS fragmentation and style drift. Use when auditing styles, before a PR, or when custom styles may have been applied outside of the project's theme tokens.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
---

# CSS Drift Detection

## Step 0 — Read the project's CSS source of truth

Read the full CSS entry point — this is the single source of truth for all styles, tokens, and base rules in this project:

```!
cat src/app/index.css 2>/dev/null || cat src/index.css 2>/dev/null || echo "NO CSS ENTRY POINT FOUND"
```

Use this file to understand:
- What design tokens are available (anything defined as a CSS custom property)
- What base styles are intentionally defined
- What styling approach the project uses (Tailwind, plain CSS, CSS Modules etc)
- What is and isn't a legitimate style to use elsewhere in the codebase

Everything in this file is intentional and valid. Your job is to find styles in components, routes, and other files that bypass or duplicate what's already defined here.

---

## Step 1 — Scan for hardcoded color values in JSX/TSX

```bash
grep -rn "text-\[#\|bg-\[#\|border-\[#\|fill-\[#\|stroke-\[#\|text-\[rgb\|bg-\[rgb" src/ --include="*.tsx" --include="*.ts" --include="*.jsx"
```

Cross-reference findings against the CSS source of truth. If a token exists for this color, flag it as a violation.

---

## Step 2 — Scan for inline style props

```bash
grep -rn "style={{" src/ --include="*.tsx" --include="*.jsx"
```

Flag static hardcoded values. Accept dynamic values that cannot be expressed as a class at build time.

---

## Step 3 — Scan for arbitrary spacing and sizing values

```bash
grep -rn "w-\[\|h-\[\|p-\[\|m-\[\|gap-\[\|top-\[\|left-\[\|right-\[\|bottom-\[" src/ --include="*.tsx" --include="*.jsx"
```

Use judgement — `w-[1px]` and `z-[9999]` are acceptable. Magic numbers like `mt-[23px]` or `w-[347px]` are violations.

---

## Step 4 — Scan for hardcoded font values

```bash
grep -rn "font-family:\|fontSize:\|font-size:\|text-\[1\|text-\[2\|text-\[0\." src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Cross-reference against font tokens defined in the CSS source of truth.

---

## Step 5 — Scan for rogue CSS files

```bash
find src/ -name "*.css" ! -name "index.css"
```

Flag any CSS files found outside the main entry point unless the project has an established CSS Modules pattern.

---

## Step 6 — Scan for !important

```bash
grep -rn "!important" src/ --include="*.css" --include="*.tsx" --include="*.jsx"
```

Flag all usage.

---

## Output Format

```
VIOLATION: <rule broken>
FILE: <file path>
LINE: <line number if available>
FOUND: <the actual value found>
FIX: <what should be used instead based on the CSS source of truth>
```

If no violations:

```
✓ No CSS drift detected. All styles reference the project's CSS source of truth correctly.
```

Summary:

```
── CSS Drift Report ──────────────────────────────────────
  CSS source of truth: src/app/index.css
  Styling approach: <detected approach>
  Tokens available: <list extracted from source of truth>

  Hardcoded colors in JSX:        N violations
  Inline style props:             N violations
  Arbitrary spacing/sizing:       N violations
  Hardcoded fonts:                N violations
  Rogue CSS files:                N violations
  !important usage:               N violations
  Total:                          N violations
─────────────────────────────────────────────────────────
```
