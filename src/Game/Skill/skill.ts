import {
  computed,
  effect,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@preact/signals-react";

const INITIAL_EXPERIENCE_TO_NEXT_LEVEL = 10;
const EXPERIENCE_TO_NEXT_LEVEL_MULTIPLIER = 1.15;
const PRESTIGE_PER_LEVEL = 1.01;
const NORMAL_PER_LEVEL = 1.1;

export class Skill {
  name: string;
  level: Signal<number>;
  experience: Signal<number>;
  experienceToNextLevel: Signal<number>;
  prestigeLevel: Signal<number>;
  prestigeExperience: Signal<number>;
  prestigeExperienceToNextLevel: Signal<number>;
  multiplier: Signal<number>;
  prestigeMultiplier: Signal<number>;
  totalMultiplier: ReadonlySignal<number>;
  additionalMultiplier: Signal<number>;
  constructor(name: string) {
    // TODO load from storage

    // Static values
    this.name = name;

    // Dynamic values
    // Base
    this.level = signal(1);
    this.experience = signal(0);
    this.experienceToNextLevel = signal(INITIAL_EXPERIENCE_TO_NEXT_LEVEL);
    this.multiplier = signal(1);

    // Prestige
    this.prestigeLevel = signal(1);
    this.prestigeExperience = signal(0);
    this.prestigeExperienceToNextLevel = signal(
      INITIAL_EXPERIENCE_TO_NEXT_LEVEL
    );
    this.prestigeMultiplier = signal(1);

    // Additional
    this.additionalMultiplier = signal(1);

    // Computed values
    this.totalMultiplier = computed(
      () =>
        this.multiplier.value *
        this.prestigeMultiplier.value *
        this.additionalMultiplier.value
    );

    // Level up base
    effect(() => {
      while (this.experience.value >= this.experienceToNextLevel.value) {
        this.experience.value -= this.experienceToNextLevel.value;
        this.experienceToNextLevel.value *= EXPERIENCE_TO_NEXT_LEVEL_MULTIPLIER;
        this.level.value++;
        this.multiplier.value *= NORMAL_PER_LEVEL;
      }
    });

    // Level up prestige
    effect(() => {
      while (
        this.prestigeExperience.value >=
        this.prestigeExperienceToNextLevel.value
      ) {
        this.prestigeExperience.value -=
          this.prestigeExperienceToNextLevel.value;
        this.prestigeExperienceToNextLevel.value *=
          EXPERIENCE_TO_NEXT_LEVEL_MULTIPLIER;
        this.prestigeLevel.value++;
        this.prestigeMultiplier.value *= PRESTIGE_PER_LEVEL;
      }
    });
  }

  tick(deltaTime: number) {
    this.experience.value += deltaTime * this.totalMultiplier.value;
    this.prestigeExperience.value += deltaTime * this.totalMultiplier.value;
  }

  prestige() {
    this.experience.value = 0;
    this.level.value = 1;
    this.multiplier.value = 1;
    this.additionalMultiplier.value = 1;
  }

  reset() {
    this.prestige();
    this.prestigeExperience.value = 0;
    this.prestigeLevel.value = 1;
    this.prestigeMultiplier.value = 1;
    this.experienceToNextLevel.value = INITIAL_EXPERIENCE_TO_NEXT_LEVEL;
    this.prestigeExperienceToNextLevel.value = INITIAL_EXPERIENCE_TO_NEXT_LEVEL;
  }
}
