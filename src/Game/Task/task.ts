import { effect, signal, type Signal } from "@preact/signals-react";
import type { ItemId } from "../Data/items";
import type { SkillName } from "../Data/skills";
import { tasks, taskToIdMap } from "../Data/tasks";
import type { GameData, GameState } from "../gameState";

export type TaskData<TKey extends string = string> = {
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
   * List of items that completing this task will give
   */
  gives?: Items[];
  /**
   * Which task should be enabled when completing this one
   */
  enables?: () => NoInfer<TKey>[];
  /**
   * Which task should be disabled when completing this one
   */
  disables?: () => NoInfer<TKey>[];
  /**
   * Type of task
   *
   * gather tasks are repeatable by default
   *
   */
  type: "gather" | "explore" | "craft";

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
  /**
   * Items required to craft
   */
  cost?: Items[];
};
export type Items = { item: ItemId; amount: number };

export type AnyTaskData<TKey extends string = string> = TaskData<TKey>;

export type TaskSaveData = {
  id: string;
  progress: number;
  cost?: {
    item: ItemId;
    used: number;
  }[];
};

export class TaskProgress {
  task: Task;
  currentXp: Signal<number>;
  constructor(task: Task, progress: number) {
    this.task = task;
    this.currentXp = signal(progress);
  }
  tick(deltaTime: number, _gameState: GameState, gameData: GameData) {
    const skill = gameData.skills[this.task.skill];
    this.currentXp.value += deltaTime * skill.totalMultiplier.peek();
  }

  toData(): TaskSaveData {
    return {
      id: taskToIdMap.get(this.task)!,
      progress: this.currentXp.peek(),
    };
  }
}
export type TaskTickResult =
  | undefined
  | { type: "notEnoughResources"; itemId: ItemId };
export class Task<TKey extends string = string> {
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
  gives?: Items[];
  progress: Signal<TaskProgress>;

  // for crafting
  cost?: Signal<
    Array<
      Items & {
        used: Signal<number>;
        useXpStep: number;
      }
    >
  >;

  // Temporary function references necessary for defining task relations
  enablesFunc?: () => NoInfer<TKey>[];
  disablesFunc?: () => NoInfer<TKey>[];
  constructor(data: AnyTaskData<TKey>) {
    this.name = data.name;
    this.description = data.description;
    this.lore = data.lore;
    this.xpCost = data.xpCost;
    this.skill = data.skill;
    this.onCompleteCallback = data.onComplete;
    this.enablesFunc = data.enables;
    this.disablesFunc = data.disables;
    if (data.cost) {
      this.cost = signal(
        data.cost.map((itemCost) => ({
          ...itemCost,
          used: signal(0),
          useXpStep: this.xpCost / itemCost.amount,
        }))
      );
    }

    this.gives = data.gives;
    this.progress = signal(new TaskProgress(this, 0));
    this.type = data.type;
    this.available = signal(data.available ?? false);
    if (data.type === "gather") {
      this.isRepeatable = true;
    } else {
      this.isRepeatable = data.isRepeatable ?? false;
    }

    // effects
  }
  tick(
    deltaTime: number,
    gameState: GameState,
    gameData: GameData
  ): TaskTickResult {
    // tick progress
    this.progress.value.tick(deltaTime, gameState, gameData);
    // check and subtract resources first
    if (this.cost) {
      const craftingRes = this.#tickCrafting(gameState, gameData);
      if (craftingRes) return craftingRes;
    }
    return undefined;
  }

  #tickCrafting(gameState: GameState, gameData: GameData): TaskTickResult {
    if (!this.cost) return undefined;
    for (const itemCost of this.cost.peek()) {
      // while loop just to avoid overflows, usually it'll only run once, like an if statement
      while (
        this.progress.peek().currentXp.peek() >=
        itemCost.useXpStep * itemCost.used.peek()
      ) {
        const item = gameData.items[itemCost.item];
        if (gameState.inventory.hasItem(item)) {
          gameState.inventory.removeItem(item);
          itemCost.used.value++;
        } else {
          return { type: "notEnoughResources", itemId: itemCost.item };
        }
      }
    }
    return undefined;
  }
  init(gameState: GameState, gameData: GameData) {
    this.enables = this.enablesFunc?.().map(
      (id) => tasks[id as TKey & keyof typeof tasks]
    );
    this.disables = this.disablesFunc?.().map(
      (id) => tasks[id as TKey & keyof typeof tasks]
    );
    effect(() => {
      if (this.progress.value.currentXp.value >= this.xpCost) {
        this.onComplete?.(gameState, gameData);
        this.progress.value.currentXp.value = 0;
      }
    });
    // Delete the function references to clean up memory
    delete this.enablesFunc;
    delete this.disablesFunc;
  }
  onComplete(state: GameState, gameData: GameData) {
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
    if (this.gives) {
      this.gives.forEach((item) => {
        state.inventory.addItem(gameData.items[item.item], item.amount);
      });
    }
    if (this.cost) {
      for (const itemCost of this.cost.peek()) {
        itemCost.used.value = 0;
      }
    }
    if (this.onCompleteCallback) {
      this.onCompleteCallback(state);
    }
  }
  toData(): TaskSaveData {
    return {
      ...this.progress.value.toData(),
      cost: this.cost?.peek().map((itemCost) => ({
        item: itemCost.item,
        used: itemCost.used.peek(),
      })),
    };
  }
  fromData(data: TaskSaveData) {
    this.progress.value.currentXp.value = data.progress;
    data.cost?.forEach((itemCost) => {
      const currentCost = this.cost
        ?.peek()
        .find((c) => c.item === itemCost.item);
      if (currentCost) {
        currentCost.used.value = itemCost.used;
      }
    });
    this.available.value = true;
  }
}
