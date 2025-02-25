import {
  batch,
  computed,
  effect,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@preact/signals-react";
import { type GameState } from "../gameState";
import { registerDebug } from "../../util/debug/registerDebug";

const INITIAL_DECAY = 0.5;

const DECAY_MULTIPLIER_PER_MINUTE = 1.25;
const DECAY_MULTIPLIER_PER_SECOND = Math.log(DECAY_MULTIPLIER_PER_MINUTE) / 60;

const HP_MULTIPLIER_PER_MINUTE = 1.05;
const HP_MULTIPLIER_PER_SECOND = Math.log(HP_MULTIPLIER_PER_MINUTE) / 60;

// console.time("hpTimes");

// const hpTimes = Array.from({ length: 10000 }).reduce((acc: number[], _v, i) => {
//   const hpIncrease = Math.pow(1 + HP_MULTIPLIER_PER_MINUTE, i);
//   acc.push(hpIncrease);
//   return acc;
// }, [] as number[]);
// console.timeEnd("hpTimes");

export type EnergyData = {
  energy: number;
  energyMax: number;
  energyDecay: number;
  temporaryDecay: number;
};
let loops = 0;
let totalTime = 0;
export class Energy {
  energy: Signal<number>;
  energyMax: Signal<number>;
  energyDecay: Signal<number>;
  temporaryDecay: Signal<number>;
  missingEnergy: ReadonlySignal<number>;
  totalDecay: ReadonlySignal<number>;

  // #loopBaseHp: Signal<number>;
  // #loopHpMultiplier: Signal<number>;
  #hpIncreaseAfterLoop: Signal<number>;
  loopAdditionalHpMultiplier: Signal<number>;
  totalEnergyIncreaseAfterLoop: ReadonlySignal<number>;
  // additionlHpMultiplier: Signal<number>;
  constructor() {
    this.energy = signal(100);
    this.energyMax = signal(100);
    this.energyDecay = signal(INITIAL_DECAY);
    this.temporaryDecay = signal(0);
    this.missingEnergy = computed(
      () => this.energyMax.value - this.energy.value
    );
    this.totalDecay = computed(
      () => this.energyDecay.value + this.temporaryDecay.value
    );
    this.#hpIncreaseAfterLoop = signal(0);
    this.loopAdditionalHpMultiplier = signal(1);
    this.totalEnergyIncreaseAfterLoop = computed(() =>
      Math.floor(
        this.#hpIncreaseAfterLoop.value * this.loopAdditionalHpMultiplier.value
      )
    );
  }

  init(gameState: GameState) {
    effect(() => {
      if (this.energy.value <= 0) {
        gameState.gameLoop.onDeath();
      }
    });
    effect(() => {
      const startTime = performance.now();
      const minutesSinceStart = gameState.gameLoop.loopTime.value / 60;
      const baseHpAfterTime = minutesSinceStart;
      const hpMultiplier = Math.pow(
        1 + HP_MULTIPLIER_PER_SECOND,
        minutesSinceStart
      );
      this.#hpIncreaseAfterLoop.value = Math.floor(
        baseHpAfterTime * hpMultiplier
      );
      totalTime += performance.now() - startTime;
      loops++;
    });
  }
  addEnergy(energy: number) {
    this.energy.value += energy;
  }
  tick(deltaTime: number) {
    batch(() => {
      this.energy.value -=
        (this.energyDecay.value + this.temporaryDecay.value) * deltaTime;
      this.energyDecay.value *= 1 + DECAY_MULTIPLIER_PER_SECOND * deltaTime;
    });
  }
  multiplyDecay(multiplier: number) {
    this.energyDecay.value *= multiplier;
  }
  prestige(_gameState: GameState) {
    this.energyMax.value += this.totalEnergyIncreaseAfterLoop.peek();
    this.energy.value = this.energyMax.value;
    this.energyDecay.value = INITIAL_DECAY;
    this.#hpIncreaseAfterLoop.value = 0;
    this.loopAdditionalHpMultiplier.value = 1;
  }
  /**
   * Full reset of the hp
   */
  reset() {
    this.energyMax.value = 100;
    this.energy.value = this.energyMax.value;
    this.energyDecay.value = INITIAL_DECAY;
    this.temporaryDecay.value = 0;
    this.#hpIncreaseAfterLoop.value = 0;
    this.loopAdditionalHpMultiplier.value = 1;
  }

  setTemporaryDecay(decay: number) {
    this.temporaryDecay.value = decay;
  }
  resetTemporaryDecay() {
    this.temporaryDecay.value = 0;
  }

  toData(): EnergyData {
    return {
      energy: this.energy.peek(),
      energyMax: this.energyMax.peek(),
      energyDecay: this.energyDecay.peek(),
      temporaryDecay: this.temporaryDecay.peek(),
    };
  }
  fromData(data: EnergyData) {
    this.energy.value = data.energy;
    this.energyMax.value = data.energyMax;
    this.energyDecay.value = data.energyDecay;
    this.temporaryDecay.value = data.temporaryDecay;
  }
}
