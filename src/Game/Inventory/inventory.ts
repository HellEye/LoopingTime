import {
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@preact/signals-react";
import { ItemStack, type Item } from "./items/item";
import type { GameState } from "../gameState";

export class Inventory {
  capacity: Signal<number>;
  remainingCapacity: ReadonlySignal<number>;
  items: Signal<ItemStack[]>;
  count: Signal<number>;
  foodCooldown: Signal<number>;
  constructor() {
    this.capacity = signal(10);
    this.items = signal([]);
    this.foodCooldown = signal(5);

    // Computed values
    this.count = computed(() =>
      this.items.value.reduce((acc, item) => acc + item.count.value, 0)
    );
    this.remainingCapacity = computed(
      () =>
        this.capacity.value -
        this.items.value.reduce((acc, item) => acc + item.count.value, 0)
    );
  }
  init(_gameState: GameState) {}
  removeStack(itemStack: ItemStack) {
    this.items.value = this.items.peek().filter((i) => i !== itemStack);
  }
  removeItem(item: Item, amount: number = 1) {
    const itemStack = this.items.peek().find((i) => i.item === item);
    if (itemStack && itemStack.count.value >= amount) {
      itemStack.count.value -= amount;
    }
  }
  tick(deltaTime: number, gameState: GameState) {
    // Reduce cooldowns and such
    this.items.peek().forEach((item) => {
      item.tick(deltaTime, gameState);
    });
    // Consume food
    this.items.peek().forEach((item) => {
      if (item.item.type === "food" && item.canConsume.peek()) {
        item.onConsume(gameState);
      }
    });
  }
  /**
   * Add an item to the inventory
   * @param item - The item to add
   * @param amount - The amount of the item to add
   */
  addItem(item: Item, amount: number = 1) {
    if (this.remainingCapacity.value < amount) return;
    const itemStack = this.items.peek().find((i) => i.item === item);
    if (itemStack) {
      itemStack.count.value += amount;
    } else {
      this.items.value = [...this.items.value, new ItemStack(item, amount)];
    }
  }
  reset() {
    this.items.value = [];
  }
}
