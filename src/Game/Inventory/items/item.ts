import {
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@preact/signals-react";
import { gameState, type GameState } from "../../gameState";
export type ItemId = string & { __type?: "itemId" };

export type ItemData = {
  readonly id: ItemId;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
} & (
  | {
      type: "food";
      energyValue: number;
    }
  | {
      type: "resource";
      energyValue?: never;
    }
  | {
      type: "consumable";
      energyValue?: never;
    }
);

export class Item {
  readonly id: ItemId;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly type: "food" | "resource" | "consumable";
  readonly energyValue: number = 0;
  canConsume: ReadonlySignal<boolean>;
  // TODO gamestate reference
  constructor(data: ItemData) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.description = data.description;
    this.type = data.type;
    if (data.energyValue) this.energyValue = data.energyValue;
    this.canConsume = computed(() => {
      if (this.type !== "food" && this.type !== "consumable") {
        return false;
      }
      if (
        this.type === "food" &&
        gameState.energy.missingEnergy.value < this.energyValue
      ) {
        return false;
      }
      return true;
    });
  }
  init() {}
}
export class ItemStack {
  item: Item;
  count: Signal<number>;
  cooldown: Signal<number>;
  canConsume: ReadonlySignal<boolean>;
  constructor(item: Item, amount: number = 0) {
    this.item = item;
    this.count = signal(amount);
    this.cooldown = signal(0);
    this.canConsume = computed(
      () => this.item.canConsume.value && this.cooldown.value <= 0
    );
  }
  onConsume(gameState: GameState, amount = 1) {
    if (!this.canConsume.value) return;
    if (this.item.type === "food") {
      this.cooldown.value = gameState.inventory.foodCooldown.value;
      gameState.energy.addEnergy(this.item.energyValue * amount);
    }
    this.count.value -= amount;
  }
  add(amount: number) {
    this.count.value += amount;
  }
  remove(amount: number) {
    this.count.value -= amount;
  }
  tick(deltaTime: number, gameState: GameState) {
    if (this.cooldown.peek() > 0) {
      this.cooldown.value -= deltaTime;
    }
    if (this.cooldown.peek() < 0) {
      this.cooldown.value = 0;
    }
    if (this.count.peek() <= 0 && this.cooldown.peek() <= 0) {
      gameState.inventory.removeStack(this);
    }
  }
}
