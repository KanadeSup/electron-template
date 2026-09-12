import { cn } from "cn";
import "./three-dot.css";

export type ThreeDotProps = React.ComponentProps<"div">;

export function ThreeDot(props: ThreeDotProps) {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-1 py-0.5 text-muted-foreground",
        className,
      )}
      {...rest}
    >
      <span className="size-1.25 animate-wave-bounce rounded-full bg-current" />
      <span
        className="size-1.25 animate-wave-bounce rounded-full bg-current"
        style={{ animationDelay: "0.15s" }}
      />
      <span
        className="size-1.25 animate-wave-bounce rounded-full bg-current"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}
