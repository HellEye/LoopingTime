import type { Inventory, InventoryData } from "../Inventory/inventory";
import { db } from "./db";

export const saveInventory = async (inventory: Inventory) => {
  await db.inventory.put({ id: "inventory", ...inventory.toData() });
};

export const loadInventory = async (): Promise<InventoryData | undefined> => {
  const inventory = await db.inventory.get("inventory");
  return inventory;
};
