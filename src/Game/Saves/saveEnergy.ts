import type { Energy, EnergyData } from "../Energy/energy";
import { db } from "./db";

export const saveEnergy = async (energy: Energy) => {
  await db.energy.put({ id: "energy", ...energy.toData() });
};

export const loadEnergy = async (): Promise<EnergyData | undefined> => {
  const energy = await db.energy.get("energy");
  return energy;
};
