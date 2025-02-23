import { effect, signal, type Signal } from "@preact/signals-react";
import type { GameState } from "../gameState";

export class GameLoop {
  running: Signal<boolean>;
  constructor() {
    this.running = signal(false);
  }
  init(gameState: GameState) {
    // Auto pauses
    effect(() => {
      console.log("try pause");
      if (
        gameState.taskQueue.taskCount.value === 0 &&
        gameState.gameLoop.running.value
      ) {
        this.running.value = false;
      }
    });
  }
  start() {
    this.running.value = true;
  }
  pause() {
    this.running.value = false;
  }
  toggle() {
    this.running.value = !this.running.peek();
  }
}
