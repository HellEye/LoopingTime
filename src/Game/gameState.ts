import { items } from "./Data/items";
import { skills } from "./Data/skills";
import { initTasks } from "./Data/tasks";
import { Energy } from "./Energy/energy";
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
  items,
  skills,
  inventory: new Inventory(),
  gameLoop: new GameLoop(),
  energy: new Energy(),
  taskQueue: new TaskQueue(),
} as const;
export type GameState = typeof gameState;
let gameStateLoaded = false;
gameState.taskQueue.init(gameState);
gameState.inventory.init(gameState);
gameState.energy.init(gameState);
gameState.gameLoop.init(gameState);
initTasks(gameState);
declare global {
  interface Window {
    gameState: GameState;
  }
}
export const saveGame = async () => {
  await saveGameToDb(gameState);
};
window.gameState = gameState;

if (!gameStateLoaded) {
  loadGameFromDb(gameState);
  gameStateLoaded = true;
}
