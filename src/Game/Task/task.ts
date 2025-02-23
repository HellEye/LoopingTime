import { effect, signal, type Signal } from "@preact/signals-react";
import type { GameState } from "../gameState";
import type { ItemStack } from "../Inventory/items/item";
import type { SkillName } from "../Skill/skills";
import { tasks, type TaskId } from "./tasks";

export type TaskData = {
  name: string;
  description: string;
  xpCost: number;
  skill: SkillName;
  enables?: () => TaskId[];
  disables?: () => TaskId[];
  type: "gather" | "craft" | "explore";
  cost?: {
    items?: ItemStack | ItemStack[];
    energy?: number;
  };
  onComplete?: (state: GameState) => void;
  isRepeatable?: boolean;
  available?: boolean;
};

export class Task {
  name: string;
  description: string;
  xpCost: number;
  skill: SkillName;
  type: "gather" | "craft" | "explore";
  onCompleteCallback?: (state: GameState) => void;
  available: Signal<boolean>;
  isRepeatable: boolean;
  enables?: Task[];
  disables?: Task[];
  progress: Signal<number>;
  // Temporary function references necessary for defining task relations
  enablesFunc?: () => TaskId[];
  disablesFunc?: () => TaskId[];
  constructor(data: TaskData) {
    this.name = data.name;
    this.description = data.description;
    this.xpCost = data.xpCost;
    this.skill = data.skill;
    this.onCompleteCallback = data.onComplete;
    this.enablesFunc = data.enables;
    this.disablesFunc = data.disables;
    this.progress = signal(0);
    this.type = data.type;
    this.available = signal(data.available ?? false);
    if (data.type === "gather") {
      this.isRepeatable = true;
    } else {
      this.isRepeatable = data.isRepeatable ?? false;
    }

    // effects
  }
  init(gameState: GameState) {
    this.enables = this.enablesFunc?.().map((id) => tasks[id]);
    this.disables = this.disablesFunc?.().map((id) => tasks[id]);
    effect(() => {
      if (this.progress.value >= this.xpCost) {
        this.onComplete?.(gameState);
        this.progress.value = 0;
      }
    });
    // Delete the function references to clean up memory
    delete this.enablesFunc;
    delete this.disablesFunc;
  }
  onComplete(state: GameState) {
    // Enable tasks that this task enables
    if (this.enables) {
      this.enables.forEach((task) => {
        task.available.value = true;
      });
    }
    // Disable repeatable tasks after one completion
    if (!this.isRepeatable) {
      this.available.value = false;
      state.taskQueue.removeTask(this);
    }
    // Disable tasks that this task disables
    if (this.disables) {
      this.disables.forEach((task) => {
        task.available.value = false;
      });
    }
    if (this.onCompleteCallback) {
      this.onCompleteCallback(state);
    }
  }
}
