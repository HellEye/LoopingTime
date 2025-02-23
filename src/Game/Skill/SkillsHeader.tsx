import Box from "../../Components/Box";
import { NumberDisplay } from "../../Components/Number";
import { gameState } from "../gameState";
import type { Skill } from "./skill";
import { SkillBar } from "./SkillBar";
const SkillField = ({ skill }: { skill: Skill }) => {
  return (
    <Box key={skill.name} rounded="none" className="gap-4 p-4 w-full">
      <div>
        Skill: <span>{skill.name}</span>
      </div>
      <div>
        <NumberDisplay value={skill.totalMultiplier} />x
      </div>
      <div className="flex flex-col gap-1">
        <SkillBar type="normal" skill={skill} />
        <SkillBar type="prestige" skill={skill} />
      </div>
      <div className="flex flex-row gap-4">
        Debug:
        <button
          className="border-slate-500 border-2 rounded-sm bg-gray-800 px-4 py-2 cursor-pointer active:bg-gray-600 hover:bg-gray-700"
          onClick={() => {
            skill.experience.value += 5;
          }}
        >
          Add xp
        </button>
      </div>
    </Box>
  );
};
export const SkillsHeader = () => {
  return (
    <div className="flex flex-row w-full bg-slate-800 items-stretch">
      {Object.values(gameState.skills).map((skill) => {
        return <SkillField key={skill.name} skill={skill} />;
      })}
    </div>
  );
};
