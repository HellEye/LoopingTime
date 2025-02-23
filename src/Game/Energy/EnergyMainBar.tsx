import { NumberDisplay } from "../../Components/Number";
import { ProgressBar } from "../../Components/ProgressBar";
import { gameState } from "../gameState";

export const EnergyMainBar = () => {
  return (
    <ProgressBar
      value={gameState.energy.energy}
      maxValue={gameState.energy.energyMax}
      barClassName="h-12"
      fillClassName="bg-green-700"
      label={
        <div className="flex flex-row gap-4 w-full h-full items-center justify-center font-bold text-lg">
          <div>
            Energy: <NumberDisplay value={gameState.energy.energy} /> /{" "}
            <NumberDisplay value={gameState.energy.energyMax} />
          </div>
          <div>
            Decay: <NumberDisplay value={gameState.energy.totalDecay} />
          </div>
          <div>
            Debug{" "}
            <button
              className="border-2 border-gray-500"
              onClick={() => gameState.energy.reset()}
            >
              reset
            </button>
          </div>
        </div>
      }
      backgroundClassName="bg-gray-800"
    />
  );
};
