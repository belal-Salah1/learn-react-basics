# UI Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the debug scaffolding in this React learning project with a "hooks lab" visual design built on Tailwind v4 design tokens.

**Architecture:** Semantic CSS custom properties live in `:root` and are re-declared inside a `prefers-color-scheme: dark` block, then exposed to Tailwind through `@theme inline`. Because `inline` resolves each token to `var(--x)` at the use site, utilities such as `bg-surface` re-theme automatically and **no `dark:` variants are needed** for base surfaces. A new `Card` primitive carries the repeated visual language; a new client-only `Nav` isolates `usePathname` so the root layout stays a server component.

**Tech Stack:** Next.js 16.2.12 (App Router), React 19.2.4, Tailwind CSS 4.3.3, TypeScript 5.

**Spec:** `docs/superpowers/specs/2026-07-31-ui-styling-design.md`

### Verification strategy (read before starting)

This repo has no test runner, and the spec forbids new dependencies. Each task is
therefore verified by:

1. `npx tsc --noEmit` — must exit 0.
2. `npx next build` — must exit 0.
3. Assertions against build output (`grep` on `.next/server/app/*.html` and
   `.next/static/chunks/*.css`) where there is a concrete, non-tautological claim
   to check.

Run commands from the repo root: `/home/belal/Documents/personal_projects/learn-react`.

---

### Task 1: Design tokens and debug-style removal

**Files:**
- Modify: `app/globals.css` (full rewrite)
- Modify: `app/page.tsx` (remove CSS-module import and its usage)
- Delete: `app/home.module.css`

- [ ] **Step 1: Record the current baseline**

Run: `npx next build 2>&1 | tail -5`
Expected: `BUILD` succeeds. This confirms you start from a green build.

- [ ] **Step 2: Rewrite `app/globals.css`**

Replace the entire file with:

```css
@import "tailwindcss";

:root {
  --background: #fbfbfc;
  --surface: #ffffff;
  --border: #e6e7eb;
  --foreground: #17181c;
  --muted: #6b7280;
  --accent: #4f46e5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0b;
    --surface: #141417;
    --border: #26262b;
    --foreground: #ededed;
    --muted: #9095a1;
    --accent: #818cf8;
  }
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

Three deliberate removals: the `.section { outline: 1px solid red }` debug rule,
the `font-family: Arial, Helvetica, sans-serif` that was overriding Geist, and the
old two-token `@theme inline` block.

Note the fallback stacks on `--font-sans` / `--font-mono`. The original scaffold
had a bare `var(--font-geist-sans)`, which renders with no fallback if the font
request fails.

- [ ] **Step 3: Remove the CSS-module usage from `app/page.tsx`**

Delete this import line:

```tsx
import styles from "./home.module.css";
```

And change the `Header` usage from:

```tsx
<Header text="An amazing header " textSubtitle="This is a subtitle" className={styles.border}/>
```

to:

```tsx
<Header text="An amazing header " textSubtitle="This is a subtitle" />
```

This is safe because `className` is declared optional (`className?: string`) on
`HeaderParams`. Task 7 replaces this markup entirely; this step only keeps the
build green in the interim.

- [ ] **Step 4: Delete the now-unreferenced module**

```bash
git rm app/home.module.css
```

`git rm` both deletes the file and stages the deletion, so Step 8 does not need a
separate `git add` for it.

- [ ] **Step 5: Verify no debug styles or dangling references remain**

```bash
grep -rn "home.module\|outline: 1px solid red\|font-family: Arial" app/ || echo "CLEAN"
```

Expected: `CLEAN`

- [ ] **Step 6: Verify typecheck and build**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -8
```

Expected: `tsc` exits 0; build reports `✓ Compiled successfully` and prerenders
routes `/`, `/_not-found`, `/about`.

- [ ] **Step 7: Verify the dark theme actually emits**

```bash
grep -o "prefers-color-scheme: *dark" .next/static/chunks/*.css | head -1
```

Expected: one match. If empty, the media query was dropped and the dark palette
will never apply.

- [ ] **Step 8: Commit**

```bash
git add app/globals.css app/page.tsx
git commit -m "style: add semantic design tokens, remove debug styles"
```

---

### Task 2: `Nav` component

**Files:**
- Create: `app/components/Nav.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight"
        >
          learn-react
        </Link>
        <ul className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "font-medium text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Nav;
```

`'use client'` is on line 1, before all imports — required by Next, and the
directive placement error hit earlier in this repo. `usePathname` is why this file
is a client component; keeping it separate lets `layout.tsx` stay a server
component. `aria-current="page"` conveys the active route to screen readers
rather than relying on color alone.

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: exits 0. (The component is not yet rendered anywhere; Task 3 wires it in.)

- [ ] **Step 3: Commit**

```bash
git add app/components/Nav.tsx
git commit -m "feat: add Nav with active-route highlighting"
```

---

### Task 3: Layout shell

**Files:**
- Modify: `app/layout.tsx` (full rewrite)

- [ ] **Step 1: Rewrite the file**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "learn-react — React Hooks Playground",
  description:
    "A playground for practicing React hooks: state, refs, effects, and memoization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Nav />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
```

The `<main>` element now lives here, so page components must **not** render their
own `<main>` (Tasks 7 and 8 handle that). `font-sans` on `<body>` is what makes
Geist apply now that the Arial override is gone.

- [ ] **Step 2: Verify typecheck and build**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -8
```

Expected: both succeed, three routes prerendered.

- [ ] **Step 3: Verify the nav renders and metadata updated**

```bash
grep -o "learn-react" .next/server/app/index.html | head -1
grep -c "Create Next App" .next/server/app/index.html || echo "SCAFFOLD TITLE GONE"
```

Expected: first prints `learn-react`; second prints `SCAFFOLD TITLE GONE` (or `0`).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add layout shell with nav and real metadata"
```

---

### Task 4: `Card` primitive

**Files:**
- Create: `app/components/Card.tsx`

- [ ] **Step 1: Create the component**

```tsx
type CardProps = {
  hook: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

function Card({ hook, title, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-surface p-5 ${className}`}
    >
      <span className="font-mono text-xs text-muted">{hook}</span>
      <h2 className="mt-0.5 text-base font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default Card;
```

`className` is appended last so callers can add layout concerns such as
`sm:col-span-2` without the component knowing about the grid.

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add app/components/Card.tsx
git commit -m "feat: add Card primitive for hook demos"
```

---

### Task 5: Restyle `Header`

**Files:**
- Modify: `app/components/Header.tsx` (full rewrite)

- [ ] **Step 1: Rewrite the file**

```tsx
type HeaderParams = {
  text: string;
  textSubtitle: string;
  className?: string;
};

function Header({ text, textSubtitle, className = "" }: HeaderParams) {
  return (
    <div className={`border-b border-border pb-6 ${className}`}>
      <h1 className="text-2xl font-semibold tracking-tight">{text}</h1>
      <p className="mt-1 text-sm text-muted">{textSubtitle}</p>
    </div>
  );
}

export default Header;
```

The public API is unchanged — still `text`, `textSubtitle`, and optional
`className`. Only the rendering changes.

- [ ] **Step 2: Verify typecheck and build**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -6
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add app/components/Header.tsx
git commit -m "style: restyle Header as page title"
```

---

### Task 6: Restyle `Description` and `List`

**Files:**
- Modify: `app/components/Description.tsx` (full rewrite)
- Modify: `app/components/List.tsx` (full rewrite)

- [ ] **Step 1: Rewrite `app/components/List.tsx`**

```tsx
type ListParams = {
  description: string;
};

function List(props: ListParams) {
  return (
    <li className="px-4 py-3 text-sm">
      <span className="text-muted">detail: </span>
      {props.description}
    </li>
  );
}

export default List;
```

This now returns an `<li>`, so its parent must be a list element — handled in the
next step. The `description` prop is unchanged.

- [ ] **Step 2: Rewrite `app/components/Description.tsx`**

```tsx
import Card from "./Card";
import List from "./List";

function Desc() {
  return (
    <Card hook="props" title="Description">
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        <List description="This is a sample description" />
      </ul>
    </Card>
  );
}

export default Desc;
```

The fragment wrapper and bare `<div>desc</div>` are gone; the card title now
carries that label. The `<ul>` provides the valid parent for `List`'s `<li>`.

- [ ] **Step 3: Verify typecheck and build**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -6
```

Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add app/components/Description.tsx app/components/List.tsx
git commit -m "style: restyle Description and List as a card with rows"
```

---

### Task 7: Home page

**Files:**
- Modify: `app/page.tsx` (full rewrite)

- [ ] **Step 1: Rewrite the file**

```tsx
'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./components/Card";
import Desc from "./components/Description";
import Header from "./components/Header";

const GOAL = 10;

function Home() {
  const showDescription = true;
  const [counter, setCounter] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldCalculate, setShouldCalculate] = useState<boolean>(false);

  const CalculateIncome = () => {
    let number = 10;
    for (let i = 0; i < 10000; i++) {
      number += i;
    }
    console.log("Calculation....");
    return number;
  };

  const income = useMemo(() => CalculateIncome(), [shouldCalculate]);

  const handleClick = () => {
    setCounter(counter + 1);
    if (counter + 1 === GOAL) {
      setSuccess(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input value changed:", event.target.value);
  };

  const handleFocus = () => {
    inputRef.current?.focus();
    console.log("Input is focused", inputRef.current?.value);
  };

  useEffect(() => {
    console.log("event is successful");
  }, [success]);

  useEffect(() => {
    console.log("Counter is triggered");
  }, [counter]);

  return (
    <div className="space-y-8">
      <Header
        text="React Hooks Playground"
        textSubtitle="Practicing state, refs, effects, and memoization."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card hook="useState" title="Counter">
          <p className="text-4xl font-semibold tabular-nums tracking-tight">
            {counter}
          </p>
          <button
            onClick={handleClick}
            className="mt-4 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Increment
          </button>
          <p className="mt-3 text-xs text-muted">
            {success
              ? `Unlocked at ${GOAL}`
              : `${GOAL - counter} more to unlock`}
          </p>
        </Card>

        <Card hook="useRef" title="Focus an input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter your name"
            onChange={handleInputChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <button
            onClick={handleFocus}
            className="mt-3 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Focus input
          </button>
        </Card>

        <Card
          hook="useMemo"
          title="Expensive calculation"
          className="sm:col-span-2"
        >
          <p className="font-mono text-sm">
            <span className="text-muted">cached result: </span>
            {income.toLocaleString("en-US")}
          </p>
          <button
            onClick={() => setShouldCalculate((v) => !v)}
            className="mt-3 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Recalculate
          </button>
        </Card>
      </div>

      {showDescription && <Desc />}
    </div>
  );
}

export default Home;
```

Four changes beyond styling, all sanctioned by the spec's "Behavioral Changes":

1. `income` is now rendered, clearing its unused-variable hint.
2. `setShouldCalculate` is wired to Recalculate, clearing its hint and making
   memoization observable.
3. `counter === 10` became `counter + 1 === GOAL`, fixing the off-by-one where
   `success` flipped at 11 because `counter` still holds the pre-update value.
4. `hideDescription` was renamed `showDescription` and changed from `let` to
   `const`. The old name was inverted — `true` meant *show*. Behavior is identical.

The outer `<main>` and its inline `color: red` / `backgroundColor: green` are
gone; `<main>` now lives in `layout.tsx`.

- [ ] **Step 2: Verify typecheck and build**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -8
```

Expected: both succeed. The build log should include `Calculation....`, printed
while prerendering — proof `CalculateIncome` executes rather than throwing.

- [ ] **Step 3: Verify the debug colors are gone and content renders**

```bash
grep -rn "color: *\"red\"\|backgroundColor" app/ || echo "NO INLINE DEBUG STYLES"
grep -o "49,995,010" .next/server/app/index.html | head -1
```

Expected: `NO INLINE DEBUG STYLES`, then `49,995,010` — confirming the memoized
value reaches the DOM formatted.

- [ ] **Step 4: Verify no unused-variable hints remain**

Check IDE diagnostics for `app/page.tsx` (or run `npx tsc --noEmit` with
`noUnusedLocals` if configured).
Expected: no `is declared but its value is never read` for `income` or
`setShouldCalculate`.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "style: rebuild home page as hook demo cards"
```

---

### Task 8: About page

**Files:**
- Modify: `app/about/page.tsx` (full rewrite)

- [ ] **Step 1: Rewrite the file**

```tsx
import Link from "next/link";
import Header from "../components/Header";

function About() {
  return (
    <div className="space-y-8">
      <Header text="About" textSubtitle="What this project is for." />

      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          This is a learning project for practicing React and Next.js
          fundamentals — components, props, conditional rendering, and hooks.
        </p>
        <p className="text-muted">
          Built with Next.js 16, React 19, and Tailwind CSS 4.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block text-sm font-medium text-accent hover:underline"
      >
        ← Back to the playground
      </Link>
    </div>
  );
}

export default About;
```

No `<main>` here either — the layout supplies it.

- [ ] **Step 2: Verify typecheck and build**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -8
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "style: restyle about page"
```

---

### Task 9: Final verification sweep

**Files:** none modified.

- [ ] **Step 1: Confirm a clean full build from scratch**

```bash
rm -rf .next && npx tsc --noEmit && npx next build 2>&1 | tail -12
```

Expected: `tsc` exits 0; build prerenders `/`, `/_not-found`, `/about`.

- [ ] **Step 2: Confirm every debug artifact is gone**

```bash
grep -rnE '"red"|"green ?"|outline: 1px|home\.module|Arial|\.section' app/ \
  || echo "ALL CLEAN"
```

Expected: `ALL CLEAN`. Any hit is a leftover debug value.

The patterns are quoted/anchored deliberately. A bare `grep "red"` would be a
false-positive magnet across utility class names, so this matches the literal
string values that actually appeared in the debug styles.

- [ ] **Step 3: Confirm both themes and all tokens emit**

```bash
grep -o "prefers-color-scheme: *dark" .next/static/chunks/*.css | head -1
grep -o "\-\-surface: *#[0-9a-f]*" .next/static/chunks/*.css | sort -u
```

Expected: one dark-scheme match, and two distinct `--surface` values (light
`#ffffff` and dark `#141417`). One value only means the dark override was lost.

- [ ] **Step 4: Confirm no horizontal overflow risk**

```bash
grep -rn "w-\[\|min-w-\[\|whitespace-nowrap" app/ || echo "NO FIXED WIDTHS"
```

Expected: `NO FIXED WIDTHS`. The layout is `max-w-3xl` plus a responsive grid, so
nothing should force a fixed width.

- [ ] **Step 5: Visual check in the running app**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm: sticky nav with `learn-react` wordmark and
Home highlighted in indigo; three cards with mono hook badges; Increment raises
the counter and the "more to unlock" line counts down; Focus input moves the
caret into the field; Recalculate logs `Calculation....` while Increment does not.
Navigate to About and confirm the nav highlight moves. Then toggle your OS to dark
mode and confirm surfaces darken and the accent stays legible.

- [ ] **Step 6: Commit any residual fixes**

If Steps 1–5 required changes, commit them:

```bash
git add -A && git commit -m "fix: address final verification findings"
```

Otherwise skip — there should be nothing to commit.

---

## Notes for the implementer

- **Do not add dependencies.** No component library, no icons, no animation
  library. Everything here uses Tailwind utilities already available.
- **Do not add `dark:` variants** for background, surface, border, foreground,
  muted, or accent. Those tokens re-theme themselves through the `:root` override.
  `dark:` is only appropriate for a one-off that must diverge from the token.
- **`'use client'` goes on line 1**, before every import. Placing it after imports
  is a build error in Next 16.
- **Page components must not render `<main>`** — `app/layout.tsx` owns it. Two
  nested `<main>` elements is invalid HTML.
- Read `node_modules/next/dist/docs/` before reaching for any Next API not shown
  in this plan; this version differs from older releases.
