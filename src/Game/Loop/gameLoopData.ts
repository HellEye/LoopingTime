import { effect, signal, type Signal } from "@preact/signals-react";
import { gameState, type GameState } from "../gameState";
export type GameLoopData = {
  loopTime: number;
  alive: boolean;
};
export class GameLoop {
  running: Signal<boolean>;
  loopTime: Signal<number>;
  alive: Signal<boolean>;
  constructor() {
    this.running = signal(false);
    this.loopTime = signal(0);
    this.alive = signal(true);
  }
  init(gameState: GameState) {
    // Auto pauses
    effect(() => {
      if (
        gameState.taskQueue.taskCount.value === 0 &&
        gameState.gameLoop.running.value
      ) {
        this.running.value = false;
      }
    });
  }
  onDeath() {
    this.alive.value = false;
  }
  onRestart() {
    this.alive.value = true;
    this.loopTime.value = 0;
  }
  tick(_gameState: GameState, deltaTime: number) {
    this.loopTime.value += deltaTime;
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
  toData(): GameLoopData {
    return {
      loopTime: this.loopTime.peek(),
      alive: this.alive.peek(),
    };
  }
  fromData(data: GameLoopData) {
    this.loopTime.value = data.loopTime;
    this.alive.value = data.alive;
  }
}
