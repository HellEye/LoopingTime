import type { Skill, SkillData } from "../Skill/skill";
import { db } from "./db";

export const saveAllSkills = async (skills: Record<string, Skill>) => {
  await db.skills.bulkPut(
    Object.entries(skills).map(([id, skill]) => ({ id, ...skill.toData() }))
  );
};
export const saveSkill = async (id: string, skill: Skill) => {
  await db.skills.put({ id, ...skill.toData() });
};

export const loadSkills = async (): Promise<[string, SkillData][]> => {
  const skills = await db.skills.toArray();
  return skills.map((skill) => {
    return [skill.id, skill] as const;
  });
};
