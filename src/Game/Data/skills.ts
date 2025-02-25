import { Skill } from "../Skill/skill";

export const absorbtion = new Skill("Absorbtion");

export const scanning = new Skill("Scanning");

export const crafting = new Skill("Crafting");

export const woodcutting = new Skill("Woodcutting");

export const mining = new Skill("Mining");

export const exploration = new Skill("Exploration");

export const skills = {
  absorbtion,
  scanning,
  crafting,
  woodcutting,
  mining,
  exploration,
} as const;

export type SkillName = keyof typeof skills;
