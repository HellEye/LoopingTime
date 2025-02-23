import { Skill } from "./skill";

export const farming = new Skill("Farming");

export const mining = new Skill("Mining");

export const crafting = new Skill("Crafting");

export const woodcutting = new Skill("Woodcutting");

export const exploration = new Skill("Exploration");

export const skills = {
  farming,
  mining,
  crafting,
  woodcutting,
  exploration,
} as const;

export type SkillName = keyof typeof skills;
