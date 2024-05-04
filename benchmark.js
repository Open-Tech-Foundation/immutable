import { Bench, hrtimeNow } from "tinybench";
import { immutate } from "./packages/immutable/src";
import { produce } from "immer";
import { create } from "mutative";
import { produce as sProduce } from "structurajs";

const bench = new Bench({ time: 100, now: hrtimeNow });

const o = [
  {
    title: "Learn TypeScript",
    done: true,
  },
  {
    title: "Try Immer",
    done: false,
  },
  {
    title: "New Todo",
    done: false,
    extraProp: null,
  },
];

bench
  .add("immutate", () => {
    immutate(o, (draft) => {
      draft[1].done = true;
      delete draft[2].extraProp;
      draft.push({ title: "Tweet about it" });
    });
  })
  .add("structurajs", () => {
    sProduce(o, (draft) => {
      draft[1].done = true;
      delete draft[2].extraProp;
      draft.push({ title: "Tweet about it" });
    });
  })
  .add("immer", () => {
    produce(o, (draft) => {
      draft[1].done = true;
      delete draft[2].extraProp;
      draft.push({ title: "Tweet about it" });
    });
  })
  .add("mutative", () => {
    create(o, (draft) => {
      draft[1].done = true;
      delete draft[2].extraProp;
      draft.push({ title: "Tweet about it" });
    });
  });

await bench.warmup();
await bench.run();

console.table(bench.table());
