# LoopingTime

Game engine + content for an incremental game

## Development setup

1. Install node (on Linux `sudo apt install node`)
2. (Optional but recommended) install pnpm `npm install -g pnpm`
3. Clone the repository
4. Install required packages:
   1. Open the repository directory in the terminal
   2. Run `pnpm install` (or `npm install`)
5. Run the project locally
   1. `pnpm dev` or `npm run dev`

## Overview

- The game is mostly separated between the logic and visual layers
- all the logic flows through the `gameState` object (in `src/Game/gameState.ts`)
- Logic is coupled with display via `@preact/signals-react` for faster refresh rate. Any variable that's used for display should be a signal.
  - Use the premade components (`NumberDisplay`, `ProgressBar`) for displaying common UI elements
- Main game loop (in `src/Game/Loop/gameLoop.ts`) controls the ticks of all logic components
- All the data is initialized in the collection files `src/Game/Inventory/items/items.ts`, `src/Game/Skill/skills.ts` and `src/Game/Task/tasks.ts`
  - (subject to change, maybe it would be good to move all the collection files to a separate directory)
