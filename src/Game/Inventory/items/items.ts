import { Item, type ItemId } from "./item";

export const items = {
  wood1: new Item({
    id: "wood1",
    name: "Wood",
    icon: "wood1.png",
    description: "A piece of wood",
    type: "resource",
  }),
  berry: new Item({
    id: "berry",
    name: "Berry",
    icon: "berry1.png",
    description: "A berry, yum",
    type: "food",
    energyValue: 5,
  }),
} as const satisfies Record<ItemId, Item>;
