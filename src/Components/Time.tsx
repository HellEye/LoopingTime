import type { Signal } from "@preact/signals-react";

type Props = {
  value: Signal<number>;
};

export const Time = ({ value }: Props) => {
  const minutes = Math.floor(value.value / 60);
  const seconds = Math.floor(value.value % 60);
  return (
    <span>
      {minutes > 10 ? minutes : "0" + minutes}:
      {seconds > 10 ? seconds : "0" + seconds}
    </span>
  );
};
