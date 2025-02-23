import { signal } from "@preact/signals-react";

const testValue = signal<number[]>([]);

export const Test = () => {
  return (
    <div>
      <button
        className="bg-gray-600 text-white active:bg-gray-700"
        onClick={() => {
          testValue.value = testValue.value.concat([0]);
        }}
      >
        Increment
      </button>
      <p className="text-2xl font-bold">
        {testValue.value.map((v) => (
          <span>{v}</span>
        ))}
      </p>
    </div>
  );
};
