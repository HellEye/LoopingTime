import {
  computed,
  effect,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@preact/signals-react";
import { tasks, taskToIdMap, type TaskId } from "../../Data/tasks";
import { gameCache, type GameData, type GameState } from "../../gameState";
import type { Task } from "../task";

export type TaskQueueSaveData = {
  tasks: TaskId[];
};

export class TaskQueue {
  tasks: Signal<Task[]>;
  taskCount: ReadonlySignal<number>;
  constructor() {
    this.tasks = signal([]);
    this.taskCount = computed(() => this.tasks.value.length);
  }
  init(gameState: GameState) {
    // Remove gather tasks if inventory full
    effect(() => {
      if (gameState.inventory.remainingCapacity.value === 0) {
        this.removeTask((task) => task.type === "gather");
      }
    });
  }
  addTask(task: Task) {
    this.tasks.value = [...this.tasks.peek(), task];
  }
  addTaskInFront(task: Task) {
    this.tasks.value = [task, ...this.tasks.peek()];
  }
  tick(deltaTime: number, gameState: GameState, gameData: GameData) {
    if (this.tasks.peek().length === 0) {
      return;
    }
    const currentTask = this.tasks.value[0];
    const taskSkill = gameData.skills[currentTask.skill];
    const tickResult = currentTask.tick(deltaTime, gameState, gameData);
    if (tickResult) {
      if (tickResult.type === "notEnoughResources") {
        const gatherTask = gameCache.gatherItemTaskMap
          .get(tickResult.itemId)
          ?.find((task) => task.available.peek());
        if (gatherTask) {
          this.addTaskInFront(gatherTask);
        } else {
          this.removeTask(0);
        }
      }
    }
    taskSkill.tick(deltaTime);
  }
  reset() {
    this.tasks.value = [];
  }
  /**
   * Remove task at given index from queue
   */
  removeTask(index: number): void;
  /**
   * Remove all instances of specific task from queue
   */
  removeTask(task: Task): void;
  /**
   * Remove all tasks that match the predicate from queue
   */
  removeTask(predicate: (task: Task) => boolean): void;
  removeTask(task: Task | number | ((task: Task, index: number) => boolean)) {
    if (typeof task === "function") {
      this.tasks.value = this.tasks.peek().filter((t, i) => !task(t, i));
    } else if (typeof task === "number") {
      this.tasks.value = this.tasks.peek().filter((_, i) => i !== task);
    } else {
      this.tasks.value = this.tasks.peek().filter((t) => t !== task);
    }
  }

  clearTasks() {
    this.tasks.value = [];
  }
  toData(): TaskQueueSaveData {
    return {
      tasks: this.tasks.peek().map((task) => taskToIdMap.get(task)!),
    };
  }
  fromData(data: TaskQueueSaveData) {
    this.tasks.value = data.tasks.map((id) => tasks[id as TaskId]);
  }
}
