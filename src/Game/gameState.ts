import { Energy } from "./Energy/energy";
import { Inventory } from "./Inventory/inventory";
import { items } from "./Inventory/items/items";
import { GameLoop } from "./Loop/gameLoopData";
import { skills } from "./Skill/skills";
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

gameState.taskQueue.init(gameState);
gameState.inventory.init(gameState);
gameState.energy.init(gameState);
gameState.gameLoop.init(gameState);

declare global {
  interface Window {
    gameState: GameState;
  }
}

window.gameState = gameState;
