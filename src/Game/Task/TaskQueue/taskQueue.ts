import {
  computed,
  effect,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@preact/signals-react";
import { type GameState } from "../../gameState";
import type { Task } from "../task";

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
  tick(deltaTime: number, gameState: GameState) {
    if (this.tasks.peek().length === 0) {
      return;
    }
    const currentTask = this.tasks.value[0];
    const taskSkill = gameState.skills[currentTask.skill];
    taskSkill.tick(deltaTime);
    currentTask.progress.value += deltaTime * taskSkill.totalMultiplier.value;
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
}
