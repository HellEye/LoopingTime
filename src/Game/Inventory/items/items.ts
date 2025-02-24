import { Item, type ItemId } from "./item";

export const items = {
  wood1: new Item({
    id: "wood1",
    name: "Oak Wood",
    icon: "wood1.png",
    description: "Relatively strong wood",
    type: "resource",
  }),
  smallEnergy: new Item({
    id: "smallEnergy",
    name: "Small Energy",
    icon: "smallEnergy.png",
    description: "Small energy ball",
    type: "food",
    energyValue: 5,
  }),
} as const satisfies Record<ItemId, Item>;
