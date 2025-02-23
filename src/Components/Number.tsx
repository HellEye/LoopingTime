import type { Signal } from "@preact/signals-react";

type Props = {
  value: Signal<number>;
  precision?: number;
  className?: string;
};

export const NumberDisplay = ({ value, precision = 2, className }: Props) => {
  return <span className={className}>{value.value.toFixed(precision)}</span>;
};
