# Battle-game board regression check

`board-layout.check.js` guards the fix made on `modernize-card-game` for the
**unplayable battle game**: the in-play card slots used to render on top of the
`Attack!` button (`.enemy-face`), so clicking it hit the card instead of the
button, and the board looked "garbled". Root cause + fix are in
`src/app/game/game.component.css` (`.game-board` is now `position: relative`,
buttons carry a `z-index`, and the in-play/hand cards are scaled so nothing
overlaps).

The check logs in as the seeded `test` user, builds a deck, enters `/game`, and
asserts each action button is hit-testable (no overlapping element steals the
click).

## Run

The app must be running locally (the legacy stack needs Node 16 for `ng serve`,
inherited from the shell that launches `dotnet run`):

```bash
# terminal 1 — start the app (Node 16 on PATH so the spawned ng serve uses it)
export PATH="$HOME/.nvm/versions/node/v16.20.2/bin:$PATH"
cd Project2-TCG/Project2-TCG
ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5001 \
  dotnet run --no-launch-profile

# terminal 2 — run the check (puppeteer-core is intentionally NOT a project dep)
npm i puppeteer-core
node verify-game/board-layout.check.js   # exit 0 = pass
```

Override `CHROME_PATH` / `BASE_URL` env vars if your Chrome path or port differ.
