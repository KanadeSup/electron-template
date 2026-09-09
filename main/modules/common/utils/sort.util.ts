// ========== Move item by direction ==============
export type MoveItemByDirectionSuccessResult<T> = {
  success: true;
  reordered: T[];
};

export type MoveItemByDirectionErrorResult = {
  success: false;
  errorMessage: string;
};

export type MoveItemByDirectionResult<T> =
  | MoveItemByDirectionSuccessResult<T>
  | MoveItemByDirectionErrorResult;

export function moveItemByDirection<T>(
  items: T[],
  movedIndex: number,
  direction: "up" | "down",
): MoveItemByDirectionResult<T> {
  const targetIndex = direction === "up" ? movedIndex - 1 : movedIndex + 1;
  if (targetIndex < 0 || targetIndex >= items.length) {
    return {
      success: false,
      errorMessage: "Cannot move item further in this direction",
    };
  }

  const reordered = [...items];
  const movedItem = reordered.splice(movedIndex, 1)[0];
  if (!movedItem) {
    return {
      success: false,
      errorMessage: "Cannot move item further in this direction",
    };
  }

  reordered.splice(targetIndex, 0, movedItem);

  return {
    success: true,
    reordered,
  };
}
