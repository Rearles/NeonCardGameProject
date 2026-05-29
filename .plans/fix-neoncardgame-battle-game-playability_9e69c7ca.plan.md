---
title: "Fix the NeonCardGame battle game so a full match is playable again (2021 fidelity)"
type: "bugfix"
created: "2026-05-29"
status: complete
related: []
---

# Fix NeonCardGame Battle Game Playability

## Context

The battle screen loads but is unplayable: buttons/cards render in the wrong
positions ("garbled") and clicking them does nothing. The 2021 modernize commit
`704c412` regenerated `package-lock.json`, removed `node-sass`, and swapped the
backend to SQLite — but did **not** touch the game component (`game.component.*`
is byte-identical to the working 2021 build at `ef73b61`). So the game *code* is
correct; the regression is environmental (build/layout/asset) plus latent
data-layer bugs. Goal: restore the original 2021 behavior — do not rewrite the
game logic. Constraints: keep SQLite + Angular 12 (Node pinned), match 2021 play.

## Todos

- [x] Reproduce — run app, load `/game`, capture console + network + layout failures
- [x] Diff baseline `ef73b61` vs `704c412` — ClientApp/src is byte-identical (no build regression)
- [x] Diagnose mispositioned buttons/cards and why overlap intercepts clicks — DONE in Todo 1
- [x] Fix `game.component.css` overlap — Attack button unclickable under card slot; clean play area
- [x] Fix `CardRepo.cs:69` off-by-one — `random.Next(0, cardCount)` for rarity draw
- [x] Fix turn-loop halt — MOOT: turn loop verified healthy in Todo 1 (no stuck `going`)
- [x] Fix `GameController.UpdateCurrency` reward path — POST reward + persist + result-page call
- [x] Verify full match end-to-end (Easy) — play→attack→result all work; Med/Hard share component
- [x] Add regression artifact — puppeteer board hit-test harness committed + documented

## Notes

**Architecture.** ASP.NET Core 6 + EF Core 6 (SQLite, `cardgame.db`) serving an
Angular 12 SPA via `SpaServices` (`ng serve` as child of `dotnet run`).
Battle flow: `play` (set `difficulty` in localStorage) → `deck` (build 10-card
deck from `GET /api/user/collection/{username}`) → `game` (battle; fetch enemy
cards from `GET /api/game/card/{difficulty}`) → `result` (award currency).

**What's already healthy (verified statically + via SQLite).** The committed
`cardgame.db` has 27 Cards across all 4 rarities, the 4 Rarity rows, 1 Color, the
`test`/`test` user, and **18 `UsersCards`** for that user (enough to build a deck).
`EnsureCreated()` is a no-op because the DB file is committed, so the `HasData`
seed never runs — the committed DB is the source of truth. Login persists
`localStorage("user")`, deck-maker loads the collection, `/api/game/card/*`
resolves a valid card for every rarity. So login → deck → enter-game all work;
the break is *inside* the battle screen.

**Primary root-cause hypothesis (confirm in Reproduce/Diagnose).** Both symptoms
("garbled" + "clicks do nothing") are most parsimoniously explained by one cause:
the game's interactive elements (`.concede-button`, `.end-turn`, `.enemy-face`,
`.playerCard`, `.enemyCardPlay`, `.player-hand`) all use `position:absolute`, but
`.game-board` is **not** a positioned ancestor (no `position:relative`). They
anchor to the viewport/nearest positioned ancestor; if the modernized app-shell
wrapper differs from 2021, everything shifts and overlapping elements swallow
clicks. Note `Concede()` has no `going` guard, so if even Concede does nothing the
cause is interception (CSS), not game state. Confirm by inspecting computed styles
/ DOM hit-testing in the running app.

**Latent data-layer bugs to fix for full fidelity (independent of layout).**
- `CardRepo.GetRandomCardofRarity` (`Models/CardRepo.cs:69`) uses
  `random.Next(0, cardCount - 1)` → never selects a rarity's last card and throws
  `ArgumentOutOfRangeException` if a rarity ever has 0 cards. Use `Next(0, cardCount)`.
- `GameController.GetCard` (`Controllers/GameController.cs`): `random.Next(1,100)`
  never yields 100 (top branches `<=100` unreachable at 100); Easy branches overlap
  at 95. Cosmetic odds skew, not a crash — restore intended 2021 ranges.
- `GameController.UpdateCurrency` is `[HttpGet("{currency}")]` taking a `User` body
  — won't bind on a GET, so wins likely don't persist currency. Confirm 2021 intent
  (POST/PUT with proper params) before changing; the `result` component computes a
  reward but nothing calls the endpoint correctly.

**Turn-loop watch points (`game.component.ts`).** `enemyTurn()` sets `going=true`,
`await sleep(3000)`, then HTTP `subscribe`, then `going=false`. If the HTTP call
errors or throws before `going=false`, `going` stays true and every guarded button
(`playCard`, `endTurn`, `attackEnemy`, `CardBattlePlayer`) silently no-ops. Win
checks use `< 0` not `<= 0` (health exactly 0 not a loss). Treat as fidelity items.

**2021 baseline.** Last-known-good = `ef73b61` (merge before modernize). Use
`git show ef73b61:<path>` / `git diff ef73b61 704c412 -- ClientApp` to compare
build config, `angular.json`, `index.html`, global `styles.css`, and app-shell
templates. Bootstrap 4.6 + jQuery remain wired in `angular.json`; only `node-sass`
was dropped (CSS files are plain `.css`, so that removal should be inert — verify).

**Tooling.** Reproduce/verify with the browser/preview MCP tools (load the running
game, read console + network, inspect computed layout, hit-test clicks). Pin the
old Node toolchain via nvm before `dotnet run` so the spawned `ng serve` inherits
it (legacy Angular 12 won't build on modern Node) — see assist-memory lesson
`lsn_c7376dff85b3`. Data-layer revival context: lesson `lsn_3f36a2cd67e1`.

**Execution.** Run via the `implement-plan` skill (auto-consults/records
assist-memory). Plan file is uncommitted; commit to the `modernize-card-game`
branch if you want it tracked.

---

## Reproduction findings (Todo 1 — CONFIRMED via headless Chrome / puppeteer-core)

Ran the app from this clone (Node 16 pinned → `ng serve`; served HTTP on :5001),
drove a real Chrome through login→deck→game and played 6 turns.

**The game logic and data are fully healthy:**
- `/game` reached; 10-card deck built; **zero failed network requests** (all card
  art, `Empty.png`, rarity PNGs, and board bg `vwb4.jpg` load — bg IS applied,
  it's just a pink "vaporwave" image, not a missing-asset bug).
- **Zero console / page JS errors.**
- Turn loop works: turns advance 1→6, mana grows 1→2→3→4, cards draw each turn,
  enemy AI plays cards and attacks (player 25→23), playing a card triggers a card
  battle ("liam fought Snowman!"), and **attacking dealt damage (enemy 15→13)**.
- The `going` 3s-lock releases correctly — **no stuck turn-loop**. (Original Todo
  "Fix turn-loop halt" is therefore moot — see below.)

**The actual bug — overlap / stacking, not logic:**
- `.game-board` is `position: static`; every child (`position:absolute`) anchors to
  `BODY` and is placed by viewport-percentage offsets.
- Cards are 320×420. `.enemyCardPlay` (top:13%) and `.playerCard` (bottom:23%)
  overlap each other AND sit **on top of** the red `.enemy-face` "Attack!" button
  (DOM order: button is emitted before the card → card paints over it; same auto
  z-index). Hit-test: click at Attack's center (578,190) → hits `IMG.card-image`,
  not the button. Attack only fired when I clicked its non-overlapped left edge
  (x≈500). **This is the "buttons do nothing" report** — the primary action
  (Attack) is unclickable; Concede/End-Turn happen to be clickable.
- The empty played-card slots render as large black boxes dominating the center —
  the "garbled / wrong place" appearance.

**Secondary fidelity issues:**
- Turn-1 mana=1 but starting hands are often all cost ≥3 (e.g. Smug Dragon 6, Doom
  Cannon 6) → no playable card turn 1; only "End Turn" advances. Feels dead.
- `GetRandomCardofRarity` off-by-one (last card per rarity unreachable) still holds.
- Currency reward on win (result page → `UpdateCurrency`) still unverified; the GET
  endpoint signature can't bind a `User` body.

**Frontend is unchanged since 2021** (modernize commit didn't touch ClientApp app
code), so a 2021 build renders identically — the overlap is original layout that
only "worked" on the original dev's viewport. Fix must restore *playability* (make
Attack clickable, stop card/button overlap) while preserving the original look/logic.

**Verification harness:** `/tmp/pp/shot.js` (layout + hit-test + screenshot) and
`/tmp/pp/play.js` (scripted 6-turn playthrough) drive system Chrome via
puppeteer-core against http://localhost:5001 — reuse these to verify the fix (Todo 8).

---

## Final outcome (all todos complete)

**Primary fix — board playability (`game.component.css`, `game.component.html`):**
`.game-board` is now `position: relative` (children anchor to the board, not the
page), action buttons (`.concede-button`, `.end-turn`, `.enemy-face`) carry
`z-index: 30`, the in-play/hand cards are scaled (0.6/0.5) so nothing overlaps, the
Attack button moved clear to the right, and the long-orphaned `.turn-counter` rule
was reconnected (the `<p>` never had the class). Verified: all 3 buttons pass an
`elementFromPoint` hit-test; a full match plays login→deck→play→**attack (enemy
15→13)**→result.

**Off-by-one (`CardRepo.cs`):** `random.Next(0, cardCount-1)` → `Next(0, cardCount)`
so the last card of each rarity (e.g. Robo-Serpant) is now drawable.

**Currency rewards (user opted in, beyond strict 2021 fidelity):**
- `GameController`: broken `[HttpGet("{currency}")]` → `POST api/game/reward/{username}/{amount}` returning the updated user.
- `CardRepo.AddCurrency(username, amount)` (new) + `UpdateUserCurrency` fixed to call `SaveChanges()`; `LogIn` now returns `Currency` so the nav shows it.
- `result-component.ts` posts the earned reward and refreshes the nav balance.
- Verified end-to-end: a finished match increments the DB currency (10005→10006 for an Easy loss = +1); direct `POST reward/test/6` returned `currency:10005` and persisted.

**Regression artifact:** `ClientApp/verify-game/board-layout.check.js` (+ README) —
puppeteer hit-test that fails if any action button is overlapped. Passes.

**Not changed (strict 2021 fidelity):** game turn logic, card art/assets, SQLite
seed/data, build config. Nav currency display after a fresh login now works as a
side-effect of the `LogIn` currency fix.
