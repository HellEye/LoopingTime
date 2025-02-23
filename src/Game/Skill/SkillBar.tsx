import { ProgressBar } from "../../Components/ProgressBar";
import type { Skill } from "./skill";

type Props = {
  type: "prestige" | "normal";
  skill: Skill;
};

export const SkillBar = ({ type, skill }: Props) => {
  const value =
    type === "prestige" ? skill.prestigeExperience : skill.experience;
  const maxValue =
    type === "prestige"
      ? skill.prestigeExperienceToNextLevel
      : skill.experienceToNextLevel;

  return (
    <ProgressBar
      value={value}
      maxValue={maxValue}
      fillClassName={type === "prestige" ? "bg-blue-500" : "bg-green-500"}
      backgroundClassName="bg-slate-500"
      barClassName="h-1"
    />
  );
};
