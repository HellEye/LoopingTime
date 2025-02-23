import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";

const style = cva("rounded-md border-2 border-gray-500 bg-slate-800 flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
    },
  },
  defaultVariants: {
    direction: "column",
    rounded: "md",
  },
});
type Props = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof style>;
const Box = ({ children, className, ...props }: Props) => {
  return <div className={style({ ...props, className })}>{children}</div>;
};

export default Box;
