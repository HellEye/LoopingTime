import { effect, signal, type Signal } from "@preact/signals-react";
import type { GameState } from "../gameState";
import type { ItemStack } from "../Inventory/items/item";
import type { SkillName } from "../Skill/skills";
import { tasks, type TaskId } from "./tasks";

export type TaskData = {
  /**
   * Task name for display
   */
  name: string;
  /**
   * Task description for display
   *
   * unused for now
   */
  description: string;
  /**
   * Task lore
   *
   * unused for now
   */

  lore?: string;
  /**
   * XP cost for the task
   *
   * skills give <multiplier> xp per second
   */
  xpCost: number;
  /**
   * Skill that the task belongs to
   */
  skill: SkillName;
  /**
   * Which task should be enabled when completing this one
   */
  enables?: () => TaskId[];
  /**
   * Which task should be disabled when completing this one
   */
  disables?: () => TaskId[];
  /**
   * Type of task
   *
   * gather tasks are repeatable by default
   */
  type: "gather" | "craft" | "explore";
  /**
   * NOT IMPLEMENTED
   *
   * Cost of the task
   *
   * energy is consumed from energy pool
   *
   *
   */
  cost?: {
    items?: ItemStack | ItemStack[];
    energy?: number;
  };
  /**
   * What should happen when the task is completed
   *
   * i.e. add items to inventory
   */
  onComplete?: (state: GameState) => void;
  /**
   * Should this task be available multiple times
   *
   * Gather tasks are repeatable by default
   */
  isRepeatable?: boolean;
  /**
   * Should this task be available to at the start of the loop
   */
  available?: boolean;
};

export class Task {
  name: string;
  description: string;
  lore?: string;
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
    this.lore = data.lore;
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
