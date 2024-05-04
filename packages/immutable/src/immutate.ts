import { diff } from "@opentf/obj-diff";
import { clone } from "@opentf/std";
import applyPatches from "./applyPatches";

export default function immutate<T>(
  obj: T,
  fn: (draft: T, replace: (val: unknown) => void) => void
): T {
  let c = clone(obj);

  let replace = false;

  fn(c, (val: unknown) => {
    replace = true;
    c = val as T;
  });

  if (replace) {
    return c
  }

  const patches = diff(obj as object, c as object);

  if (patches.length > 0) {
    return applyPatches(obj as object, patches) as T;
  }

  return obj;
}
