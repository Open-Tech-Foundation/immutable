import { DiffResult, diff } from "@opentf/obj-diff";
import { clone, isArr, isObj, set } from "@opentf/std";

function applyPatches(obj: object, patches: Array<DiffResult>) {
  let out, curObj;

  if (Array.isArray(obj)) {
    out = [...obj];
  }

  if (isObj(obj)) {
    out = { ...obj };
  }

  for (const patch of patches) {
    curObj = out;
    const len = patch.p.length;

    for (let i = 0; i < len; i++) {
      const k = patch.p[i];

      if (i === len - 1) {
        if (patch.t === 0) {
          if (Array.isArray(curObj)) {
            curObj.splice(k as number, 1);
            continue;
          }
          delete curObj[k];
          continue;
        }
        curObj[k] = patch.v;
      }

      const val = curObj[k];

      if (typeof val === "object") {
        if (isArr(val)) {
          curObj[k] = [...val];
          curObj = curObj[k];
          continue;
        }

        if (isObj(val)) {
          curObj[k] = { ...val };
          curObj = curObj[k];
          continue;
        }
      }
    }
  }

  return out;
}

export default function immutate<T>(obj: T, fn: (draft: T) => void): T {
  const c = clone(obj);

  fn(c);

  const patches = diff(obj as object, c as object);

  if (patches.length > 0) {
    return applyPatches(obj as object, patches) as T;
  }

  return obj;
}
