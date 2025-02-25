import { tasks, type TaskId } from "../Data/tasks";
import type { GameState } from "../gameState";
import { loadEnergy, saveEnergy } from "./saveEnergy";
import { loadInventory } from "./saveInventory";
import { loadSkills, saveAllSkills } from "./saveSkill";
import { loadTaskQueue, saveTaskQueue } from "./saveTaskQueue";
import { loadTasks, saveTasks } from "./saveTasks";

export const saveGameToDb = async (gameState: GameState) => {
  console.time("saveGame");
  await Promise.all([
    saveAllSkills(gameState.skills),
    saveEnergy(gameState.energy),
    saveTasks(Object.values(tasks).filter((task) => task.available.peek())),
    saveTaskQueue(gameState.taskQueue.toData()),
  ]);
  console.timeEnd("saveGame");
};
export const loadGameFromDb = async (gameState: GameState) => {
  console.time("loadGame");
  const [skills, energy, inventory, dbTasks, taskQueue] = await Promise.all([
    loadSkills(),
    loadEnergy(),
    loadInventory(),
    loadTasks(),
    loadTaskQueue(),
  ]);
  skills.forEach(([id, skill]) => {
    if (gameState.skills[id as keyof typeof gameState.skills]) {
      gameState.skills[id as keyof typeof gameState.skills].fromData(skill);
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
      tasks[task.id as TaskId].fromData(task.progress);
    });
  }
  if (taskQueue) {
    gameState.taskQueue.fromData(taskQueue);
  }
  console.timeEnd("loadGame");
};
