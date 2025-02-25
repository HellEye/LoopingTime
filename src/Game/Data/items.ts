import { Item, type ItemId } from "../Inventory/item";

export const items = {
  wood1: new Item({
    name: "Oak Wood",
    icon: "wood1.png",
    description: "Relatively strong wood",
    type: "resource",
  }),
  smallEnergy: new Item({
    name: "Small Energy",
    icon: "smallEnergy.png",
    description: "Small energy ball",
    type: "food",
    energyValue: 5,
  }),
} as const satisfies Record<ItemId, Item>;

export const itemToIdMap = new Map<Item, ItemId>(
  Object.entries(items).map(([id, item]) => [item, id])
);
