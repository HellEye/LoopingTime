import { gameState } from "../gameState";
import { Task } from "./task";

export const tasks = {
  gatherWood: new Task({
    name: "Gather Oak Wood",
    description: "Extract one wood",
    skill: "woodcutting",
    type: "gather",
    xpCost: 10,

    onComplete: (state) => {
      state.inventory.addItem(state.items.wood1);
    },
  }),
  gatherSmallEnergy: new Task({
    name: "Gather Small Energy",
    description: "Change energy to SYSTEM compatible. High potential.",
    skill: "absorbtion",
    type: "gather",

    xpCost: 1,
    available: true,
    onComplete: (state) => {
      state.inventory.addItem(state.items.smallEnergy);
    },
  }),
  craftWoodenStick: new Task({
    name: "Craft Wooden Stick",
    description: "Gives one wooden stick",
    skill: "crafting",
    type: "craft",
    xpCost: 10,
    onComplete: (_state) => {
      // state.inventory.addItem("wooden-stick");
    },
  }),
  /* beggining quote
  |Awakening protocoll initialized|

          System status: integrity decreasing
          Reason: unknown

          System support protocoll: available

          Main task: grow, learn
  */
  exitCapsule: new Task({
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
  }),

  scanBurntFlora: new Task({
    name: "Scan burnt flora",
    description: `Fire changed flora
    Scan to learn`,
    lore: `Coal from trees unusable
    Future flora state -> highly likely to regrow`,
    skill: "scanning",
    type: "explore",
    xpCost: 5,
    disables: () => ["scanBurntFLora"],
    //one timer
  }),
  scanGrass: new Task({
    name: "Scan grass",
    description: `Grass indicates surroundings state
    Scan to learn`,
    lore: `Terrain stable
    Thesis: Some small and tiny animals exist`,
    skill: "scanning",
    type: "explore",
    xpCost: 30,
    disables: () => ["scanGrass"],
    //one timer
  }),
  scanTrees: new Task({
    name: "Scan trees",
    description: `Types of trees vary
    Scan to identify`,
    lore: "Trees close with their structure to oak type identified",
    skill: "scanning",
    type: "explore",
    xpCost: 20,
    enables: () => ["gatherWood"],
    disables: () => ["scanTrees"],
  }),
  scanRocks: new Task({
    name: "Scan rocks",
    description: `Thesis: Decomposed flora with rocks creates unique minerals
    Hypothesis: Rocks indicate whether minerals are nearby`,
    lore: `Very few minerals detected
    Probable directions broadened`,
    skill: "scanning",
    type: "explore",
    xpCost: 24,
    enables: () => ["exploreNorthPlains", "exploreNorthEastPlains"],
    disables: () => ["scanRocks"],
  }),
  exploreNorthPlains: new Task({
    name: "Explore north plains",
    description: "",
    skill: "exploration",
    type: "explore",
    xpCost: 50,
    //enables: () => ["othertaskName"],
    disables: () => ["exploreNorthEastPlains", "scanBurntFlora"],
  }),
  exploreNorthEastPlains: new Task({
    name: "Explore north east plains",
    description: "",
    skill: "exploration",
    type: "explore",
    xpCost: 35,
    //enables: () => ["othertaskName"],
    disables: () => ["exploreNorthPlains", "scanBurntFlora"],
  }),

  gatherStone: new Task({
    name: "Gather Stone",
    description: "Gives one stone",
    skill: "mining",
    type: "gather",
    xpCost: 10,
    onComplete: (_state) => {
      // state.inventory.addItem(items.stone);
    },
  }),
} as const;
Object.values(tasks).forEach((task) => task.init(gameState));
export type TaskId = keyof typeof tasks;
