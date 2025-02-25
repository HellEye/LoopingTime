import type { ReactNode } from "react";

const DeathScreen = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-gray-800">
        <div className="flex flex-col gap-20">
          <div className="flex flex-row gap-4">
            <span className="text-white text-4xl font-bold">
              System malfunction
            </span>
            <span className="text-xl">Uploading data to server...</span>
            <span className="text-xl">Skill increases here or something</span>
          </div>

          <div className="flex flex-row gap-4">
            <button
              className="bg-green-700 text-white px-12 py-8 rounded-md text-4xl"
              onClick={() => {}}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeathScreen;
