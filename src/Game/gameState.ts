import { items } from "./Data/items";
import { skills } from "./Data/skills";
import { initTasks, tasks } from "./Data/tasks";
import { Energy } from "./Energy/energy";
import { initCache, type GameStateCache } from "./gameStateCache";
import { Inventory } from "./Inventory/inventory";
import { GameLoop } from "./Loop/gameLoopData";
import { loadGameFromDb, saveGameToDb } from "./Saves/SaveManager";
import { TaskQueue } from "./Task/TaskQueue/taskQueue";

type Player = {
  name: string;
};
/**
 * Main game state
 */
export const gameState = {
  player: {
    name: "test",
  } as Player,
  inventory: new Inventory(),
  gameLoop: new GameLoop(),
  energy: new Energy(),
  taskQueue: new TaskQueue(),
} as const;
export const gameData = {
  items,
  skills,
  tasks,
};
export type GameState = typeof gameState;
export type GameData = typeof gameData;

let gameStateLoaded = false;
gameState.taskQueue.init(gameState);
gameState.inventory.init(gameState);
gameState.energy.init(gameState);
gameState.gameLoop.init(gameState);
initTasks(gameState, gameData);

export const saveGame = async () => {
  await saveGameToDb(gameState, gameData);
};

export const prestigeGame = () => {
  gameState.taskQueue.reset();
  gameState.inventory.reset();
  gameState.energy.prestige(gameState);
  Object.values(gameData.tasks).forEach((task) => {
    task.available.value = task.initialAvailable;
  });
  Object.values(gameData.skills).forEach((skill) => {
    skill.prestige();
  });
  gameState.gameLoop.onRestart();
};

declare global {
  interface Window {
    gameState: GameState;
    gameData: GameData;
    debug: Record<string, () => void>;
  }
}
window.gameState = gameState;
window.gameData = gameData;

if (!gameStateLoaded) {
  loadGameFromDb(gameState, gameData);
  gameStateLoaded = true;
}

export const gameCache = initCache(gameState, gameData);
export type GameCache = GameStateCache;
