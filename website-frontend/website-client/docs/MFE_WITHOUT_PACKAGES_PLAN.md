# Plan: Micro Frontends without component packages

**For:** KRAN upcoming projects where **client-driven changes** can alter UI, flows, and components — and **auth is always project-specific**.

This document resolves a common mix-up:

| Idea | True / false |
|------|----------------|
| “MFE means we must publish `@kran/ui`” | **False** |
| “MFE means each team can own and edit UI in their app” | **True** |
| “Design system must stay one fixed login for all products” | **False** (portal auth is demo only) |
| “We still want a consistent *starting* look (KRAN standard)” | **True** |

---

## 1. Your model in one sentence

**Use Micro Frontends to split deployable apps; copy the KRAN UI source into each app and change it freely when the client requires — do not depend on a shared npm component package.**

---

## 2. What Micro Frontend means here

```
┌─────────────────────────────────────────────────────────┐
│  HOST (Project A shell)                                  │
│  • Project A auth / login (any flow backend requires)   │
│  • Top nav, load remotes, session for Project A         │
│  • May include its own editable copy of shared UI       │
└───────────────────────────┬─────────────────────────────┘
                            │  runtime: remoteEntry.js
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Remote: Finance     Remote: Asset      Remote: HR
   (own src/, own       (own src/,          (own src/,
    modified            modified             modified
    components)         components)          components)
```

- **MFE** = several **builds**, several **deploy units**, composed in the browser.
- **Not MFE** = publishing DataTable to npm and hoping nobody breaks it.

Module Federation (or similar) only **must** share **React / ReactDOM** (and usually router) as singletons so the page does not break. **Buttons, tables, forms live inside each remote’s bundle** — copied and edited there.

---

## 3. Role of *this* design-system repository

| It is | It is not |
|-------|-----------|
| **Golden reference** UI + patterns + workbench | A package all projects `npm install` |
| **Template to copy** (`src/shared`, example domains) | The only place components may exist |
| **Portal demo** (mock auth for `/design-system/`) | Production auth for SPFO, Probity, etc. |
| **Doc + rules** for how to build screens | A frozen flow every client must follow |

**New project workflow:**

1. Create **host** + one or more **remote** Vite apps (MFE setup).
2. **Copy** `src/shared/` (and optionally example domain folders) from design-system into host/remotes.
3. Wire **project auth** and APIs in the **host** (or a dedicated auth remote if you prefer).
4. When **client changes** UI or flow → edit files **in that project’s repo** (host or remote). No package release.

Optional: a **sync script** (“pull KRAN UI updates from design-system tag vX”) — merge consciously, not blind overwrite.

---

## 4. “No new design” vs “everything can change”

Both are true at different times:

| Stage | Meaning |
|-------|---------|
| **Day 0** | Start from KRAN copy — same buttons, tables, spacing as portal (no blank Figma rebuild). |
| **Day N (client)** | Change components, screens, flows **in that project** — including forking a shared component inside the remote. |

Design-system **does not block change**; it **reduces day-0 cost**. After that, the **project repo** is source of truth for that client.

---

## 5. Auth (fixed rule)

- **Never** a shared auth package.
- **Host** (or project team) implements login/session per backend instructions.
- Portal `domain/auth` = **example UI** only; other projects may reuse **layout look** or ignore it entirely.

---

## 6. What to federate vs duplicate

| Share at federation layer (singleton) | Duplicate per host/remote (editable) |
|---------------------------------------|-------------------------------------|
| `react`, `react-dom` | `DataTable`, forms, modals |
| Often `react-router-dom` | Domain pages and workflows |
| Optional tiny **shell contract** types (not UI) | Auth implementation |
| | Tailwind config (copy; tweak per client) |

---

## 7. Practical phases (MFE + copy, no packages)

| Phase | Action |
|-------|--------|
| **1** | Use current design-system monolith as template ([NEW_PROJECT_FROM_THIS_CONTEXT.md](./NEW_PROJECT_FROM_THIS_CONTEXT.md)). |
| **2** | Decide **one pilot program** (not design-system portal itself): host repo + 1 remote (e.g. asset). Document URLs on Galaxy. |
| **3** | Add federation to **pilot host + remote**; copy `shared/` into both; prove one route loads from remote. |
| **4** | Document **“New KRAN MFE project”** checklist: scaffold, copy UI, auth in host, customize freely. |
| **5** | Keep **this repo** as reference; tag releases (`ui-ref-2026.11`) for teams to diff/merge — still **not** npm UI package. |
| **6** | Split more domains into remotes only when **deploy independence** is needed. |

**Skip:** `@kran/ui` npm, mandatory shared login module, forcing all products to stay identical to portal.

---

## 8. This portal (design-system) and MFE

The design-system site can stay a **single SPA** for catalogue and demos. It does **not** have to become the federation host for every product.

Production programs (SPFO, Probity, client X) get their **own host + remotes**, seeded from this repo’s copy.

Later, if you want, one domain of *this* portal could be a remote **as an experiment** — optional, not required for your product MFE strategy.

---

## 9. Answers to “I'm still confused”

**Q: MFE or packages?**  
**A:** MFE for **app boundaries and deploy**. **No** UI packages — **copy & edit** components per project/remote.

**Q: Client changes everything?**  
**A:** Change in **that remote’s** (or host’s) codebase. Design-system is updated only if you want to refresh the **template** for *future* copies.

**Q: Do other projects use our login?**  
**A:** No. They use KRAN **UI starting point**; auth is theirs.

**Q: What do developers share?**  
**A:** Git history / tags / docs / optional sync script — not a runtime dependency on a component npm package.

---

## 10. Related docs

- [NEW_PROJECT_FROM_THIS_CONTEXT.md](./NEW_PROJECT_FROM_THIS_CONTEXT.md) — default: fork full app, project-owned auth  
- [ARCHITECTURE.md](./ARCHITECTURE.md) — shell, registry, optional future federation notes
