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
declare global {
  interface Window {
    gameState: GameState;
  }
}
export const saveGame = async () => {
  await saveGameToDb(gameState, gameData);
};
window.gameState = gameState;

if (!gameStateLoaded) {
  loadGameFromDb(gameState, gameData);
  gameStateLoaded = true;
}

export const gameCache = initCache(gameState, gameData);
export type GameCache = GameStateCache;
