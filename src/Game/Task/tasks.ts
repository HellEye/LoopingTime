import { gameState } from "../gameState";
import { Task } from "./task";

export const tasks = {
  gatherWood: new Task({
    name: "Gather Wood",
    description: "Gives one wood",
    skill: "woodcutting",
    type: "gather",
    xpCost: 10,
    available: true,

    onComplete: (state) => {
      state.inventory.addItem(state.items.wood1);
    },
  }),
  gatherBerry: new Task({
    name: "Gather Berry",
    description: "Gives one berry, yum",
    skill: "farming",
    type: "gather",

    xpCost: 1,
    available: true,
    onComplete: (state) => {
      state.inventory.addItem(state.items.berry);
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
  explore1_1: new Task({
    name: "Explore 1-1",
    description: "Explore the area",
    skill: "exploration",
    type: "explore",
    available: true,
    xpCost: 30,
    enables: () => ["gatherStone"],
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
