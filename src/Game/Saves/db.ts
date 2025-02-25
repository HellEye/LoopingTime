import Dexie, { type EntityTable } from "dexie";
import type { SkillData } from "../Skill/skill";
import type { EnergyData } from "../Energy/energy";
import type { InventoryData } from "../Inventory/inventory";
import type { TaskSaveData } from "../Task/task";
import type { TaskQueueSaveData } from "../Task/TaskQueue/taskQueue";
import type { GameLoopData } from "../Loop/gameLoopData";

const db = new Dexie("game", {}) as Dexie & {
  skills: EntityTable<SkillData & { id: string }, "id">;
  energy: EntityTable<EnergyData & { id: string }, "id">;
  inventory: EntityTable<InventoryData & { id: string }, "id">;
  tasks: EntityTable<{ data: TaskSaveData[] } & { id: string }, "id">;
  taskQueue: EntityTable<{ data: TaskQueueSaveData } & { id: string }, "id">;
  gameLoop: EntityTable<{ data: GameLoopData } & { id: string }, "id">;
};

db.version(1).stores({
  skills: `&id, &name`,
  energy: `&id`,
  inventory: `&id`,
  tasks: `&id`,
  taskQueue: `&id`,
  gameLoop: `&id`,
});

export { db };
