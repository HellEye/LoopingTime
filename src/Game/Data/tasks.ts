import { type GameData, type GameState } from "../gameState";
import {
  CraftingTask,
  Task,
  type AnyTaskData,
  type CraftTaskData,
  type TaskData,
} from "../Task/task";

function defineTasks<const Keys extends string>(
  tasks: Record<Keys, AnyTaskData<Keys>>
): Record<Keys, Task<Keys>> {
  return Object.fromEntries(
    Object.entries(tasks).map(([key, v]) => {
      const value = v as AnyTaskData<Keys>;
      const task =
        value.type === "craft"
          ? new CraftingTask<Keys>(value as CraftTaskData<Keys>)
          : new Task<Keys>(value as TaskData<Keys>);
      return [key as Keys, task] as const;
    })
  ) as { [K in Keys]: Task<Keys> };
}

export type TaskId = keyof typeof tasks;
export const tasks = defineTasks({
  gatherWood: {
    name: "Gather Oak Wood",
    description: "Extract one wood",
    skill: "woodcutting",
    type: "gather",
    xpCost: 10,
    enables: () => ["craftWoodenStick"],
    gives: [{ item: "wood1", amount: 1 }],
  },
  gatherSmallEnergy: {
    name: "Gather Small Energy",
    description: "Change energy to SYSTEM compatible. High potential.",
    skill: "absorbtion",
    type: "gather",

    xpCost: 1,
    available: true,
    gives: [{ item: "smallEnergy", amount: 1 }],
  },
  craftWoodenStick: {
    name: "Craft Wooden Stick",
    description: "Gives one wooden stick",
    skill: "crafting",
    type: "craft",
    xpCost: 10,
    cost: [{ item: "wood1", amount: 5 }],
    gives: [{ item: "smallEnergy", amount: 1 }],
    isRepeatable: true,
  },
  /* beggining quote
  |Awakening protocoll initialized|

          System status: integrity decreasing
          Reason: unknown

          System support protocoll: available

          Main task: grow, learn
  */
  exitCapsule: {
    name: "Exit capsule",
    description: "Exit evacuation capsule",
    lore: `Landing area burnt some local unknown flora
    No flames spread -> Reason: rain
    "Plains" biome nearby`,
    skill: "exploration",
    type: "explore",
    available: true,
    xpCost: 30,
    enables: () => ["scanBurntFlora", "scanGrass", "scanTrees", "scanRocks"],
    disables: () => ["exitCapsule"],
  },

  scanBurntFlora: {
    name: "Scan burnt flora",
    description: `Fire changed flora
    Scan to learn`,
    lore: `Coal from trees unusable
    Future flora state -> highly likely to regrow`,
    skill: "scanning",
    type: "explore",
    xpCost: 5,
    disables: () => ["scanBurntFlora"],
    //one timer
  },
  scanGrass: {
    name: "Scan grass",
    description: `Grass indicates surroundings state
    Scan to learn`,
    lore: `Terrain stable
    Observation: Some small and tiny animals exist`,
    skill: "scanning",
    type: "explore",
    xpCost: 30,
    disables: () => ["scanGrass"],
    //one timer
  },
  scanTrees: {
    name: "Scan trees",
    description: `Types of trees vary
    Scan to identify`,
    lore: "Trees close with their structure to oak type identified",
    skill: "scanning",
    type: "explore",
    xpCost: 20,
    enables: () => ["gatherWood"],
    disables: () => ["scanTrees"],
  },
  scanRocks: {
    name: "Scan rocks",
    description: `Observation: Decomposed flora with rocks creates unique minerals
    Hypothesis: Rocks indicate whether minerals are nearby`,
    lore: `Very few minerals detected
    Probable directions broadened`,
    skill: "scanning",
    type: "explore",
    xpCost: 24,
    enables: () => ["exploreNorthPlains", "exploreNorthEastPlains"],
    disables: () => ["scanRocks"],
  },
  exploreNorthPlains: {
    name: "Explore north plains",
    description: "",
    skill: "exploration",

    type: "explore",
    xpCost: 50,
    // enables: () => ["othertaskName"],
    disables: () => ["exploreNorthEastPlains", "scanBurntFlora"],
  },
  exploreNorthEastPlains: {
    name: "Explore north east plains",
    description: "",
    skill: "exploration",
    type: "explore",
    xpCost: 35,
    //enables: () => ["othertaskName"],
    disables: () => ["exploreNorthPlains", "scanBurntFlora"],
  },
  gatherStone: {
    name: "Gather Stone",
    description: "Gives one stone",
    skill: "mining",
    type: "gather",
    xpCost: 10,
    onComplete: (_state) => {
      // state.inventory.addItem(items.stone);
    },
  },
});
export const initTasks = (gameState: GameState, gameData: GameData) => {
  Object.values(tasks).forEach((task) => task.init(gameState, gameData));
};

export const taskToIdMap = new Map<Task, TaskId>(
  Object.entries(tasks).map(([taskId, task]) => [task, taskId as TaskId])
);
