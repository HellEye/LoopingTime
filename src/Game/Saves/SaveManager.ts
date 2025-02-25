import { tasks, type TaskId } from "../Data/tasks";
import type { GameData, GameState } from "../gameState";
import { loadEnergy, saveEnergy } from "./saveEnergy";
import { loadGameLoop, saveGameLoop } from "./saveGameLoop";
import { loadInventory, saveInventory } from "./saveInventory";
import { loadSkills, saveAllSkills } from "./saveSkill";
import { loadTaskQueue, saveTaskQueue } from "./saveTaskQueue";
import { loadTasks, saveTasks } from "./saveTasks";

export const saveGameToDb = async (
  gameState: GameState,
  gameData: GameData
) => {
  console.time("saveGame");
  await Promise.all([
    saveAllSkills(gameData.skills),
    saveEnergy(gameState.energy),
    saveInventory(gameState.inventory),
    saveTasks(Object.values(tasks).filter((task) => task.available.peek())),
    saveTaskQueue(gameState.taskQueue.toData()),
    saveGameLoop(gameState.gameLoop),
  ]);
  console.timeEnd("saveGame");
};
export const loadGameFromDb = async (
  gameState: GameState,
  gameData: GameData
) => {
  console.time("loadGame");
  const [skills, energy, inventory, dbTasks, taskQueue, gameLoop] =
    await Promise.all([
      loadSkills(),
      loadEnergy(),
      loadInventory(),
      loadTasks(),
      loadTaskQueue(),
      loadGameLoop(),
    ]);
  skills.forEach(([id, skill]) => {
    if (gameData.skills[id as keyof typeof gameData.skills]) {
      gameData.skills[id as keyof typeof gameData.skills].fromData(skill);
    }
  });
  if (energy) {
    gameState.energy.fromData(energy);
  }
  if (inventory) {
    gameState.inventory.fromData(inventory);
  }
  if (dbTasks) {
    Object.values(tasks).forEach((task) => (task.available.value = false));
    dbTasks.data.forEach((task) => {
      tasks[task.id as TaskId].fromData(task);
    });
  }
  if (taskQueue) {
    gameState.taskQueue.fromData(taskQueue);
  }
  if (gameLoop) {
    gameState.gameLoop.fromData(gameLoop.data);
  }
  console.timeEnd("loadGame");
};
