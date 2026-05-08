# Role Creation — Complete Flow & Interaction Inventory

> Hand-off document. Everything needed to replace / redesign / re-implement the
> "Create a Role" experience. File paths are absolute from the repo root.
>
> Stack: Next.js (App Router) + Zustand store + Supabase persistence + a
> streaming Anthropic-Messages proxy. UI is plain React + inline styles +
> Tailwind utility classes. No design system library — just CSS variables.

---

## 1. Entry Points (how users land on the flow)

| # | Source | File | Code |
|---|--------|------|------|
| 1 | "Roles" page header → **Add Role** button | `app/(dashboard)/roles/page.js:298` | `<Link href="/roles/create">Add Role</Link>` |
| 2 | "Roles" empty state → **Create Role** button | `app/(dashboard)/roles/page.js:313` | `<Link href="/roles/create">Create Role</Link>` |
| 3 | Dashboard hero card "Create a Role" | `app/(dashboard)/dashboard/page.js:137` | `<Link href="/roles/create">` |
| 4 | Dashboard "Roles" panel **Create** chip | `app/(dashboard)/dashboard/page.js:199` | `addHref="/roles/create"` |
| 5 | Role detail page → **Edit JD** | `app/(dashboard)/roles/[id]/page.js:107` | `<Link href={'/roles/create?id=' + role.id}>` (resumes existing role) |
| 6 | Empty role detail → **Edit JD** | `app/(dashboard)/roles/[id]/page.js:168` | `<Link href="/roles/create">` |
| 7 | Assessment wizard step 1 (no roles yet) | `components/assessment/step-role.js:117` | `<Link href="/roles/create">` |
| 8 | Command palette `⌘K` → "Create Role" | `components/ui/command-palette.js:22` | shortcut `C R`, `href: '/roles/create'` |
| 9 | After-save "Create Another Role" card | `components/role-creation/role-complete.js:66` | `<Link href="/roles/create">` |

All entry points hit the same route: **`/roles/create`**.
`?id=<roleId>` resumes a saved role (state restored from Zustand on mount).

---

## 2. Route & Layout

```
app/(dashboard)/roles/create/
  layout.js          ← split-pane shell (chat | JD canvas), drag-to-resize
  page.js            ← orchestrates stages 0/1/2, all chat + save logic
  complete/page.js   ← optional “/roles/create/complete?title=…” page (rarely used)
```

### `layout.js` — split-pane shell
File: `app/(dashboard)/roles/create/layout.js`

- Listens to `window` event `'jd-panel-toggle'` (dispatched by `page.js` when
  stage ≥ 1) to reveal a right-hand panel `<div id="jd-canvas-panel" />`.
- Mounts a draggable divider between the two panes (28%–60% range, line 25).
- Measures `#role-create-header` height to position the right pane below the
  full-width header strip (lines 49–59).
- The right pane is a **portal target** — `page.js` uses
  `createPortal(<JDCanvas />, jdPortalTarget)` (page.js:769–780) to mount the
  JD editor into it.

### `page.js` — the controller
File: `app/(dashboard)/roles/create/page.js` (827 lines)

Three stages tracked by a single `stage` state:

| Stage | const | Renders |
|-------|-------|---------|
| 0 | `'describe'` | `<SearchPage />` (the initial big-prompt screen) |
| 1 | `'refine'` | `<ChatPanel />` left + `<JDCanvas />` right (canvas may be empty) |
| 2 | `'jd-ready'` | Same as stage 1, but `jdGenerated === true` |

Stage progression is rendered by **`<ProgressIndicator />`** (page.js:237–278):
three numbered dots labeled **Describe → Refine → JD Ready**.

Top-bar layout (page.js:680–747):
- **Left**: `← Back to Roles` (handler `handleBack` page.js:659)
- **Center**: `<ProgressIndicator currentStage={stage} />`
- **Right (only when `isCompact`/stage ≥ 1)**:
  - Download icon (`handleDownloadJD` — exports `*.md`, page.js:620–632)
  - Share icon (opens `showShareModal` — copy-to-clipboard `sharableLink`,
    page.js:782–811)
  - Primary CTA **"Create an Assessment"** (`handleGoToAssessment` →
    `router.push('/assessment/create')`, page.js:612)

Auto-save is **debounced 3 s** after every JD or messages change (page.js:355–
386). First save calls `addRole`; subsequent saves call `updateRole`. The
real DB id is captured into `savedRoleId.current` so we don't duplicate.

---

## 3. STAGE 0 — The very first screen ⭐ (this is what you want to redesign)

File: **`components/role-creation/search-page.js`** (372 lines)

### Visual layout
```
┌──────────────────────────────────────────────────┐
│                                                  │
│     [typewriter] What role do you want to        │
│                  recruit?                        │
│                                                  │
│     ┌──────────────────────────────────────┐     │
│     │  Paste a link to your JD or          │     │
│     │  describe your next hire...          │     │
│     │                                      │     │
│     │  📎  🔗                          ⬆  │     │
│     └──────────────────────────────────────┘     │
│                                                  │
│       [Role ▾] [Level ▾] [Skills ▾] [Location ▾] │
│                                                  │
└──────────────────────────────────────────────────┘
```

### All the interactions on stage 0

#### 3.1 Typewriter headline
- Constant: `TYPEWRITER_TEXT = 'What role do you want to recruit?'` (line 7)
- Speed: `TYPEWRITER_SPEED = 38` ms/char (line 8)
- Typewriter sets `twDone=true` to fade in (`opacity` transition) the rest of
  the page (line 124).
- Caret element blinks via `animation: 'blink 1s step-end infinite'` (line 116).

#### 3.2 Composer (textarea + toolbar)
- 3-row textarea, no border, autoresizes nothing — submits on **Enter**, allows
  newline on **Shift+Enter** (line 165–169).
- Subtle pulsing border via `animation: 'inputGlow 3s infinite'` while empty
  (line 138).
- **Ghost-text overlay** — when user hovers a category option, that prompt is
  rendered at 25 % opacity inside the textarea behind the cursor. Cleared on
  any keystroke (line 164) or click-out (handled by CategoryDropdown).
- **📎 Paperclip** (line 227–242): opens hidden `<input type="file" multiple
  accept=".pdf,.doc,.docx,.txt">`. On file pick, file names are appended to the
  textarea as `[Attached: filename.pdf]` and shown as removable chips
  (line 191–217).
- **🔗 Link icon** (line 251–266): opens "Paste a link" modal (line 306–368).
  URL is appended on its own line.
- **⬆ Submit button**: round, 34×34, gradient
  `var(--btn-primary-from)→var(--btn-primary-to)` when input non-empty;
  greyed when empty (line 270–286).

#### 3.3 Category chips (under the composer)
Component: **`components/role-creation/category-dropdown.js`**

Source data: `SEARCH_CATEGORIES` in `lib/constants.js:423–458`. Four pills:
**Role / Level / Skills / Location**. Each pill, when clicked:
- Drops down with up to **3** options (`MAX_VISIBLE = 3`, line 8) plus a
  fade-bottom **"View More"** row.
- **Hover** an option → calls `onPreview(prompt)` → renders ghost text in the
  composer (search-page.js:41–45).
- **Click** an option → calls `onSelect(prompt)` → appends prompt to the
  textarea (joined with `, ` if there's existing text, search-page.js:47–54).
- **View More** opens a centred modal (line 199–286) with the *full* options
  list. Closes on Escape (line 29–36) or backdrop click (line 215). Sidebar
  width is respected so the modal sits over the content area, not the sidebar
  (line 6, line 206).

#### 3.4 Submit
`handleSubmit` (page.js:34–39) → calls parent `onSubmit(text)` →
`handleSearchSubmit` in `app/(dashboard)/roles/create/page.js:504`:

1. Stores raw text into `description` and `allText`.
2. Runs **`analyzeInput(text)`** (page.js:22–105) — pure regex extraction:
   `title`, `responsibilities[]`, `skills[]`, `experience`, `location`,
   `workMode`, `salary`. Returns a `coverage` flag map.
3. Runs **`matchRole(text)`** (`lib/constants.js:381–403`) — scores against
   `ROLE_DB` (5 hard-coded canonical roles) and picks best match.
4. Sets `stage = 1`, seeds messages with `{ role:'user', content:text }`, and
   immediately calls `callNeo(text, [])` → starts streaming.

> **The first user input is the only "free-form" text in the whole flow.**
> Everything after stage 0 is dock-driven (chips/options/confirm/paste).

---

## 4. STAGE 1+ — Chat & JD canvas

### 4.1 ChatPanel (left side)
File: **`components/role-creation/chat-panel.js`** (397 lines)

Composition:
- **Messages area** (line 230–249): scrolls on every content change (line 181)
  and on `isTyping` toggle (line 189).
- **Bottom dock** (line 252–392) — *always* visible. Contains:
  1. **Chips strip** — confirmed facts from the latest AI message
     (`DockChips`, line 52–78). Mandatory in every AI response per system
     prompt.
  2. One of **three** mutually-exclusive interactive zones, derived from the
     `[UI]` block in the latest AI message:
     - **CONFIRM** (`DockConfirm`, line 80–134): yes/no buttons. Sends "Yes,
       that's right" or "No, that's not right". Shown alone — no other
       interactives.
     - **PASTE** (`DockPasteArea`, line 136–166): a textarea + Submit. Shown
       with a separate small text input below it for free-text companion.
     - **OPTIONS + free text** (line 279–351): up to 3 `DockOptionCard`s
       (line 10–50, click sends the label) stacked into a single bordered
       card, with a connected text input (`Or type something else…`) at the
       bottom. This is the most common state.

### 4.2 ChatBubble — message renderer
File: **`components/role-creation/chat-bubble.js`** (61 lines)

Strips the following markers before display (line 5–22):
- `[JD_START]…[JD_END]` blocks (sent to canvas instead)
- `[UI]…[/UI]` blocks (sent to dock instead)
- Streaming partial markers (`[JD_S`, `[U`, `[/U`, etc.)
- Markdown bold/italic/headings/list bullets

Bubble shape: AI is left-aligned `4 14 14 14` corners on `--cream-sidebar`;
user is right-aligned `14 4 14 14` corners on the gold gradient. Animated in
with `animation: 'fsu 0.2s ease both'` for the most recent message only.

Exports `parseUIBlock(content)` — pulls JSON out of `[UI]…[/UI]` (line 55–60).

### 4.3 TypingIndicator
File: `components/role-creation/typing-indicator.js`

3 dots, staggered `0 / 0.16 / 0.32` s delay, `dotBounce 1s` keyframe.

### 4.4 JDCanvas (right side, portaled in)
File: **`components/role-creation/jd-canvas.js`** (305 lines)

Two tabs (line 129–132): **Job Description** | **Hiring Profile**.

JD tab:
- **Header strip** (line 176–242): matched-role check chip + word count +
  formatting toolbar (only in edit mode: heading / bold / italic / list — all
  `insertMarkdown(prefix, suffix)`, line 103–127) + **Edit ↔ Preview** toggle.
- **Body** (line 245–292):
  - Edit mode → mono-font `<textarea>` with `var(--font-mono)`, full-pane.
  - Preview mode → `<ReactMarkdown remarkPlugins={[remarkGfm]} components={…}>`
    using a custom component map (lines 9–74) for `h1–h4 / p / ul / ol / li /
    strong / em / hr / a / blockquote`. Double-click anywhere flips into edit.
- Empty state: "Your job description will appear here / Answer the questions
  on the left to generate it" (line 268–281).

Hiring Profile tab → renders `<HiringProfileView>` (see 4.5).

### 4.5 HiringProfileView — structured "brief" sidebar
File: **`components/role-creation/hiring-profile-view.js`** (207 lines)

Built from `extractedData + matched role + company` (page.js:641–657 —
`hiringBrief` memo). 7 collapsible cards:

| Card | Icon | Default open | Source field(s) |
|------|------|--------------|-----------------|
| Role Identity | Briefcase | yes | `title`, `experience`, `department` |
| Location & Comp | MapPin | no | `location`, `workMode`, `salary` |
| Must-Have Skills | Target | yes | `skills[]` (Tags add/remove) |
| Nice-to-Haves | Plus | no | `niceToHaves[]` |
| Dealbreakers | Shield | no | `antiPatterns[]` (red theme) |
| AI vs Human | Cpu | no | `aiDisplacementRisk`, `aiNarrative` |
| Team Context | Users | no | `companyName`, `companyIndustry`, `teamSize` |

Each `FieldRow` is click-to-edit (autoFocus input, save on blur or Enter,
escape to cancel — line 46–70). `Tags` lets you add/remove with a dashed
"+ Add" pill (line 73–123). Currently `onChange` is **not wired up** in
`page.js` — the sidebar is read-only in practice (the `onHiringBriefChange`
prop on `<JDCanvas>` is omitted).

### 4.6 SemanticPills (currently not mounted)
File: `components/role-creation/semantic-pills.js`. Reads
`SEMANTIC_PILLS` from `lib/constants.js:460–466` (Role / Skills / Experience /
Location / Compensation) and lights one up if any keyword is in the input.
Imported nowhere — keep or drop as you like.

### 4.7 ChipSuggestions (currently not mounted)
File: `components/role-creation/chip-suggestions.js`. Same status.

---

## 5. The streaming contract — `POST /api/generate-jd`

File: **`app/api/generate-jd/route.js`** (190 lines)

### Request
```json
{
  "message": "string (the latest user turn)",
  "history": [{ "role": "user" | "ai", "content": "..." }]
}
```

### Response — Server-Sent Events (`text/event-stream`)
The route shells out to `curl` (line 140–147!) and re-streams Anthropic's
`content_block_delta` events as:
```
data: {"type":"delta","text":"..."}
data: {"type":"done","fullText":"..."}
data: {"type":"error","text":"..."}
```
> ⚠️ Uses `child_process.spawn('curl', …)` not `fetch`. Probably needs to be
> swapped for `fetch` + `ReadableStream` if you redeploy on a serverless edge.

### Model & system prompt
- Model: `claude-haiku-4-5` (line 124)
- `max_tokens: 2048`, `stream: true`
- System prompt (`SYSTEM_PROMPT`, lines 8–82) defines **the entire interaction
  protocol**:
  - Every AI reply MUST contain text **+** a `[UI]{…}[/UI]` JSON block.
  - `[UI].components` may be:
    - `{type:"options", items:[{label,desc}]}` — max 3
    - `{type:"chips", title, items:[]}` — **mandatory** every turn
    - `{type:"confirm", text}` — shown alone
    - (paste type used by `DockPasteArea` — from prior versions of the prompt)
  - When **title + level + ≥ 2 other facts** are present, model emits a JD
    bookended by `[JD_START]…[JD_END]`.
  - 3–4 turns max before the JD must appear.

### Streaming consumption
`callNeo(text, history)` in `page.js:405–489`:
- Reads SSE, splits on `\n\n`, parses each `data: {…}`.
- Detects `[JD_START]` mid-stream → flips `jdMode`, sets `stage = 2`,
  `setJdGenerated(true)` (lines 441–445), and pipes the slice between
  `[JD_START]` and `[JD_END]` into `setJDContent` live (lines 447–467).
- Text **outside** `[JD_START..JD_END]` becomes the chat bubble content.
- Strips trailing partial markers like `[J`, `[U`, `[/U` while streaming so the
  user never sees a half-written tag (line 470).

### Safety nets
- After **6 user turns** with no JD: `handleChatSend` injects a forced
  system-tag prompt asking the model to emit a JD now (page.js:554–559).
- If the API fails or still no JD: `generateJD(extracted, matched, company,
  text)` (page.js:134–222) builds a JD locally from regex extraction. Same
  fallback runs if the fetch throws (page.js:521–533, 568–576).

---

## 6. State machine (full picture)

```
Component states (page.js:288–306)
┌──────────────────────────────────────────────────────────┐
│ stage              0|1|2                                 │
│ messages           [{role, content}]                     │
│ isTyping           bool                                  │
│ jdContent          string  (markdown)                    │
│ description        string  (raw stage-0 input)           │
│ allText            string  (concat of every user turn)   │
│ extractedData      object  (from analyzeInput)           │
│ matchedRole        ROLE_DB row | null                    │
│ matchScore         int                                   │
│ followUpRound      int                                   │
│ jdGenerated        bool                                  │
│ saveVersion        int     (increments on Save)          │
│ sharableLink       string  (one-time random URL)         │
│ savedRoleId.ref    string|null  (set after first add)    │
│ showSuccessModal   bool                                  │
│ showShareModal     bool                                  │
└──────────────────────────────────────────────────────────┘
```

Transitions:
```
stage 0  ──onSubmit(text)──▶  stage 1
                              callNeo(text,[])
                              ↓
                              stream delta…
stage 1  ──[JD_START] seen──▶ stage 2 + jdContent populated
stage 1  ──user msg────────▶  callNeo(text, history)  (loop)
stage 2  ──Save Role──────▶   addRole(...) + success modal
stage 2  ──Create Another─▶   reset everything (page.js:597–610)
stage 2  ──Create Assessment▶ router.push('/assessment/create')
any      ──Back──────────▶    router.push('/roles')  (or stage 1→0)
```

Auto-save runs in parallel: every change to `jdContent` or `messages.length`
schedules a 3 s debounce that calls `addRole` once then `updateRole`
afterwards (page.js:355–386).

---

## 7. Data persistence

### Zustand store
File: **`stores/app-store.js`**

Relevant action signatures:
- `addRole(role)` — line 158: optimistic insert with `temp-<ts>` id, then
  `createRole(orgId, role, dbUser.id)` swaps it for the DB row.
- `updateRole(id, data)` — line 131: optimistic merge + `updateRoleDb`.
- Each role carries: `title, dept, status, salary, jd, sharableLink,
  chatHistory, hiringProfile`.

### Supabase
File: **`lib/api/roles.js`**

Table: `hiring_roles` (see `supabase/schema.sql:16`). Columns the create flow
writes:
```
organization_id   ← from store.orgId
title             ← extractedData.title || matched.title || description.slice(0,40)
department        ← inferDepartment(extractedData, allText)   page.js:224–235
status            ← 'intake' | 'draft' | 'active'
salary_range      ← extractedData.salary || 'TBD'
job_description   ← jdContent
chat_history      ← messages (jsonb)
hiring_profile    ← hiringBrief (jsonb, page.js:641–657)
sharable_link     ← random URL (page.js:304–306)
created_by        ← dbUser.id
```
Field mapping happens in `toAppRole` (line 4–19) and the insert in `createRole`
(line 32–52). `updateRoleDb` (line 54–74) only writes the keys actually
changed.

---

## 8. Constants & data sources

File: **`lib/constants.js`**

| Export | Lines | Used by |
|--------|-------|---------|
| `SEARCH_CATEGORIES` | 423–458 | `category-dropdown.js` (Stage 0 chip menu) |
| `ROLE_DB` | 329–379 | `matchRole()` for the JD canvas check chip |
| `matchRole(text)` | 381–403 | `page.js:388–393` |
| `ROLE_CREATION_QUESTIONS` | 415–421 | (legacy — not currently mounted) |
| `SEMANTIC_PILLS` | 460–466 | `semantic-pills.js` (currently not mounted) |
| `AI_ACKS` | 407–413 | (legacy) |
| `MOCK_ROLES` | 285–289 | Fallback when Supabase is offline (`app-store.js:60`) |
| `STATUS_MAP` | 263–273 | Roles list, role detail badges |

A reference JSON schema for the structured "hiring brief" lives at
**`lib/brief-schema.json`** (54 lines). It's not enforced anywhere; treat it
as a target shape if you re-implement the brief module.

---

## 9. After save — the success modal

File: **`components/role-creation/save-success-modal.js`** (91 lines)

Triggered by `handleSaveRole` (page.js:578–595) — note: there's **no Save
button** in the current UI; this only fires from the auto-save path *if* the
user hits the explicit "Save" CTA (which has been removed in favor of
auto-save). Practically the modal mainly appears after a manual `addRole` is
invoked. Three actions:
1. **Create Assessment** → `router.push('/assessment/create')`
2. **Create Another Role** → `handleCreateAnother` (resets all state, stage→0)
3. **Keep editing** → just closes the modal

A separate route exists at `app/(dashboard)/roles/create/complete/page.js`
that renders **`role-complete.js`** (a richer "you're done" landing page).
It's reachable by manual URL only — `router.push('/roles/create/complete')`
is **not** wired up.

---

## 10. CSS variables & animations referenced

The flow is built on these variables (define them or remap when you redesign):

```
--cream, --cream-card, --cream-sidebar
--brown, --brown-soft, --brown-muted, --brown-light
--gold, --accent-green, --red, --orange, --blue
--border-default, --border-light, --border-hover
--btn-primary-from, --btn-primary-to
--shadow-modal, --shadow-dropdown
--font-body, --font-mono
```

Custom keyframes used (must be in global CSS):
- `blink` — caret on the typewriter
- `inputGlow` — pulsing border on the empty composer
- `fadeScale` — modals
- `fsu` — message-in (fade-slide-up)
- `fi` — typing indicator fade-in
- `fsd` — dropdown enter
- `dotBounce` — typing dots
- `canvasIn` — JD canvas slide-in
- `pillPop` — semantic pill activation

---

## 11. File-by-file inventory (one-glance hand-off list)

```
app/(dashboard)/roles/create/
├── layout.js                     [SHELL]    split-pane + portal target
├── page.js                       [CORE]     stages, chat, save, streaming consumer
└── complete/page.js              [OPTIONAL] separate "you're done" landing

components/role-creation/
├── search-page.js                [STAGE 0]  ⭐ the one you want to redesign
├── category-dropdown.js          [STAGE 0]  Role/Level/Skills/Location chips + modal
├── chat-panel.js                 [STAGE 1+] dock, options, paste, confirm
├── chat-bubble.js                [STAGE 1+] message rendering + UI block parser
├── typing-indicator.js           [STAGE 1+] 3-dot bouncer
├── jd-canvas.js                  [STAGE 1+] right-pane: JD editor + Hiring Profile tabs
├── hiring-profile-view.js        [STAGE 1+] 7 collapsible brief cards
├── save-success-modal.js         [POST]     after-save modal
├── role-complete.js              [POST]     /complete landing (rarely used)
├── chip-suggestions.js           [unused]
└── semantic-pills.js             [unused]

app/api/generate-jd/route.js      [BACKEND]  SSE stream → Claude (curl-spawned)

stores/app-store.js               [STATE]    addRole / updateRole / company / orgId
lib/api/roles.js                  [DB]       hiring_roles CRUD
lib/constants.js                  [DATA]     SEARCH_CATEGORIES, ROLE_DB, matchRole
lib/brief-schema.json             [SCHEMA]   target shape for hiring brief
supabase/schema.sql               [REF]      hiring_roles columns
```

---

## 12. If you redesign Stage 0, here's the contract you must keep

The downstream code (`page.js → handleSearchSubmit`) only needs:
```ts
type Stage0Output = string;     // single concatenated free-text string
```
That's it. As long as the new screen calls `onSubmit(text: string)` with
something `analyzeInput()` and the model can chew on, nothing else has to
change. You can drop:
- Typewriter
- Category dropdown (`SEARCH_CATEGORIES`)
- File upload (it's just appended as `[Attached: filename]` text — never read)
- Link paste (also just appended as a URL line — never fetched)

You **must** keep:
- A way to produce a non-empty trimmed string and call `onSubmit(text)`.
- Or change `handleSearchSubmit` to accept structured input — currently every
  downstream regex assumes free text.
