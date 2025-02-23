import type { Signal } from "@preact/signals-react";
import { cx } from "class-variance-authority";
import { type ReactNode } from "react";

type Props = {
  value: Signal<number>;
  maxValue: Signal<number> | number;
  fillClassName?: string;
  backgroundClassName?: string;
  label?: ReactNode;
  barClassName?: string;
};

export const ProgressBar = (props: Props) => {
  const maxValue =
    typeof props.maxValue === "number" ? props.maxValue : props.maxValue.value;
  return (
    <div className={cx("w-full relative p-0 m-0", props.barClassName)}>
      <div
        className={cx("w-full h-full inset-0 z-10", props.backgroundClassName)}
      />
      <div
        className={cx("h-full absolute top-0 left-0 z-20", props.fillClassName)}
        style={{
          width: `${(props.value.value / maxValue) * 100}%`,
        }}
      />
      {props.label && (
        <div className="absolute top-0 left-0 w-full h-full z-30">
          {props.label}
        </div>
      )}
    </div>
  );
};
