import { ComponentProps } from "react";
import { cn } from "../utils";

export default function RemoteButton({
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "absolute bg-transparent cursor-pointer w-[18%] h-[6.5%] rounded-full",
        className
      )}
      {...props}
    />
  );
}
