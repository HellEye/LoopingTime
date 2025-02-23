import {
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@preact/signals-react";
import type { GameState } from "../gameState";

const INITIAL_DECAY = 0.5;

const DECAY_MULTIPLIER_PER_MINUTE = 1.25;
const DECAY_MULTIPLIER_PER_SECOND = Math.log(DECAY_MULTIPLIER_PER_MINUTE) / 60;
const getDecayAfterTimeMultiplier = (time: number) => {
  return Math.exp(DECAY_MULTIPLIER_PER_SECOND * time);
};

export class Energy {
  energy: Signal<number>;
  energyMax: Signal<number>;
  energyDecay: Signal<number>;
  temporaryDecay: Signal<number>;
  missingEnergy: ReadonlySignal<number>;
  totalDecay: ReadonlySignal<number>;
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
  }
  init(_gameState: GameState) {}
  addEnergy(energy: number) {
    this.energy.value += energy;
  }
  tick(time: number) {
    this.energy.value -=
      (this.energyDecay.value + this.temporaryDecay.value) * time;
    this.energyDecay.value *= getDecayAfterTimeMultiplier(time);
  }
  multiplyDecay(multiplier: number) {
    this.energyDecay.value *= multiplier;
  }
  prestige() {
    this.energy.value = this.energyMax.value;
    this.energyDecay.value = INITIAL_DECAY;
  }
  reset() {
    this.energyMax.value = 100;
    this.energy.value = this.energyMax.value;
    this.energyDecay.value = INITIAL_DECAY;
    this.temporaryDecay.value = 0;
  }
  setTemporaryDecay(decay: number) {
    this.temporaryDecay.value = decay;
  }
  resetTemporaryDecay() {
    this.temporaryDecay.value = 0;
  }
}
