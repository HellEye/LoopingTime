import { gameState, saveGame } from "../gameState";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const TARGET_FPS = 60;
const TARGET_FRAME_TIME = 1000 / TARGET_FPS;

/**
 * Main logic loop of the game
 */
const processTick = (deltaTime: number) => {
  gameState.taskQueue.tick(deltaTime, gameState);
  gameState.inventory.tick(deltaTime, gameState);
  gameState.energy.tick(deltaTime);
};

const SAVE_INTERVAL = 15000; // 15 seconds

let frameStart = 0;
let saveIntervalStart = 0;

/**
 * "Engine" loop that keeps constant time between frames
 */
export const tick = async () => {
  const deltaTime =
    frameStart === -1 ? TARGET_FRAME_TIME : performance.now() - frameStart;
  frameStart = performance.now();
  processTick(deltaTime / 1000);
  if (performance.now() - saveIntervalStart > SAVE_INTERVAL) {
    saveGame();
    saveIntervalStart = performance.now();
  }
  if (performance.now() - frameStart < TARGET_FRAME_TIME) {
    await wait(TARGET_FRAME_TIME - (performance.now() - frameStart));
  }

  if (gameState.gameLoop.running.peek()) {
    requestAnimationFrame(tick);
  }
};

export const startLoop = async () => {
  frameStart = -1;
  requestAnimationFrame(tick);
};
