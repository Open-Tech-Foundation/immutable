import { immutate } from "../src";

describe("immutate", () => {
  test("empty object with no change", () => {
    const o = {};
    const out = immutate(o, (draft) => {});
    expect(out).toBe(o);
  });

  test("empty object with a addition", () => {
    const o = {};
    const out = immutate(o, (draft) => {
      draft.a = 1;
    });
    expect(out).not.toBe(o);
    expect(out.a).toBe(1);
  });

  test("update a object prop", () => {
    const o = { a: 1 };
    const out = immutate(o, (draft) => {
      draft.a = 2;
    });
    expect(out).not.toBe(o);
    expect(out.a).toBe(2);
  });

  test("delete a object prop", () => {
    const o = { a: 1 };
    const out = immutate(o, (draft) => {
      delete draft.a;
    });
    expect(out).not.toBe(o);
    expect(Object.keys(out).length).toBe(0);
  });

  test("all ops on object at first level", () => {
    const o = { a: 1, b: 2 };
    const out = immutate(o, (draft) => {
      draft.a++;
      delete draft.b;
      draft.c = 3;
    });
    expect(out).not.toBe(o);
    expect(out).toEqual({ a: 2, c: 3 });
  });

  test("change ref only modified at second level", () => {
    const o = { a: { b: 1 }, c: { d: 2 } };
    const out = immutate(o, (draft) => {
      draft.a.b = 2;
    });
    expect(out).not.toBe(o);
    expect(out.a).not.toBe(o.a);
    expect(out.c).toBe(o.c);
    expect(out.a.b).toBe(2);
  });

  test("deep nested objects", () => {
    const o = { a: { b: { c: { d: 5 }, e: { f: "f" } } }, b: { d: 2 } };
    const out = immutate(o, (draft) => {
      draft.a.b.e.f = "F";
    });
    expect(out).not.toBe(o);
    expect(out.a.b).not.toBe(o.a.b);
    expect(out.a.b.c).toBe(o.a.b.c);
    expect(out.b).toBe(o.b);
    expect(out.a.b.e).not.toBe(o.a.b.e);
    expect(out.a.b.e.f).toBe("F");
  });

  test("empty arrays", () => {
    const o = [];
    const out = immutate(o, (draft) => {});
    expect(out).toBe(o);
  });

  test("change an array value", () => {
    const o = [1, 2, 3];
    const out = immutate(o, (draft) => {
      draft[0] = 5;
    });
    expect(out).not.toBe(o);
    expect(out[0]).toBe(5);
  });

  test("push an array value", () => {
    const o = [1, 2, 3];
    const out = immutate(o, (draft) => {
      draft.push(5);
    });
    expect(out).not.toBe(o);
    expect(out[3]).toBe(5);
  });

  test("pop an array value", () => {
    const o = [1, 2, 3];
    const out = immutate(o, (draft) => {
      draft.pop();
    });
    expect(out).not.toBe(o);
    expect(out[2]).toBe(undefined);
  });

  test("shift an array value", () => {
    const o = [1, 2, 3];
    const out = immutate(o, (draft) => {
      draft.shift();
    });
    expect(out).not.toBe(o);
    expect(out[0]).toBe(2);
  });

  test("unshift an array value", () => {
    const o = [1, 2, 3];
    const out = immutate(o, (draft) => {
      draft.unshift({ id: "3", done: false, body: "Buy bananas" });
    });
    expect(out).not.toBe(o);
    expect(out[0]).toEqual({ id: "3", done: false, body: "Buy bananas" });
  });

  test("remove an array index", () => {
    const o = [1, 2, 3];
    const out = immutate(o, (draft) => {
      delete draft[1];
    });
    expect(out).not.toBe(o);
    expect(out).toEqual([1, 3]);
  });

  test("array of objects", () => {
    const o = [
      {
        title: "Learn TypeScript",
        done: true,
      },
      {
        title: "Try Immer",
        done: false,
      },
    ];
    const out = immutate(o, (draft) => {
      draft[1].done = true;
      draft.push({ title: "Tweet about it" });
    });
    expect(out).not.toBe(o);
    expect(out[0]).toBe(o[0]);
    expect(out[1]).not.toBe(o[1]);
    expect(out[1].done).toBe(true);
    expect(out[2]).toEqual({ title: "Tweet about it" });
  });

  test("splice on array", () => {
    const o = ["parrot", "anemone", "blue", "trumpet", "sturgeon"];
    let out = immutate(o, (draft) => {
      draft.splice(0, 0);
    });
    expect(out).toBe(o);

    out = immutate(o, (draft) => {
      draft.splice(0, 1);
    });
    expect(out).not.toBe(o);
    expect(out).toStrictEqual(["anemone", "blue", "trumpet", "sturgeon"]);

    out = immutate(o, (draft) => {
      draft.splice(2, 2, "queen");
    });
    expect(out).not.toBe(o);
    expect(out).toStrictEqual(["parrot", "anemone", "queen", "sturgeon"]);

    out = immutate(o, (draft) => {
      draft.splice(draft.length, 0, "queen");
    });
    expect(out).not.toBe(o);
    expect(out).toStrictEqual([
      "parrot",
      "anemone",
      "blue",
      "trumpet",
      "sturgeon",
      "queen",
    ]);
  });

  test("array concat", () => {
    const o = { a: ["a", "b", "c"] };
    const array2 = ["d", "e", "f"];

    const out = immutate(o, (draft) => {
      draft.a = draft.a.concat(array2);
    });
    expect(out).not.toBe(o);
    expect(out.a).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  test("array filter", () => {
    const o = ["spray", "elite", "exuberant", "destruction", "present"];

    const out = immutate(o, (draft, replace) => {
      replace(draft.filter((word) => word.length > 6));
    });
    expect(out).not.toBe(o);
    expect(out).toEqual(["exuberant", "destruction", "present"]);
  });
});
