import { cn } from "cn";
import { useRef, useState } from "react";

export interface HorizontalResizablePanelProps {
  children: React.ReactNode;
  className?: string;
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
  handleSide?: "left" | "right";
  handleGap?: number;
  onFinishResized?: (size: number) => void;
}

export function HorizontalResizablePanel(props: HorizontalResizablePanelProps) {
  const {
    children,
    className,
    defaultSize,
    minSize = 0,
    maxSize = Number.POSITIVE_INFINITY,
    handleSide = "right",
    handleGap = 0,
    onFinishResized,
  } = props;

  const [size, setSize] = useState(() => clamp(defaultSize, minSize, maxSize));
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ pointerX: number; size: number } | null>(null);
  const sizeRef = useRef(size);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { pointerX: event.clientX, size: sizeRef.current };
    setIsResizing(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart) return;

    const deltaX = event.clientX - dragStart.pointerX;
    const nextSize = clamp(
      handleSide === "right" ? dragStart.size + deltaX : dragStart.size - deltaX,
      minSize,
      maxSize,
    );
    sizeRef.current = nextSize;
    setSize(nextSize);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStartRef.current = null;
    setIsResizing(false);
    onFinishResized?.(sizeRef.current);
  };

  return (
    <div
      className={cn("relative shrink-0", isResizing && "select-none", className)}
      style={{ width: size }}
    >
      {children}
      <div
        role="separator"
        className={cn(
          "group absolute inset-y-0 z-10 flex w-2 cursor-col-resize touch-none justify-center",
          handleSide === "right" ? "translate-x-1/2" : "-translate-x-1/2",
        )}
        style={{ [handleSide]: -handleGap }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="h-full w-0.5 bg-transparent transition-colors group-hover:bg-primary/60 group-data-resizing:bg-primary" />
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
