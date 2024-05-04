# immutable

> The Unrestrictive Immutability Library for JavaScript Objects.

## Installation

WIP

## Usage

```js
import { immutate } from "@opentf/immutable";

const obj = {
  todos: [
    {
      title: "Todo 1",
      done: true,
    },
    {
      title: "Todo 2",
      done: false,
    },
  ],
};

const next = immutate(obj, (draft) => {
  draft.todos[1].done = true;
  draft.todos.push({ title: "Todo 3", done: false });
});

console.log(next);
/*
{
  todos: [
    { title: 'Todo 1', done: true },
    { title: 'Todo 2', done: true },
    { title: 'Todo 3', done: false }
  ]
}
*/

console.log(next === obj); //=> false
console.log(next.todos[0] === obj.todos[0]); //=> true
console.log(next.todos[1] === obj.todos[1]); //=> false
```

## Benchmark

```diff
┌───┬─────────────┬─────────┬────────────────────┬────────┬─────────┐
│   │ Task Name   │ ops/sec │ Average Time (ns)  │ Margin │ Samples │
├───┼─────────────┼─────────┼────────────────────┼────────┼─────────┤
+ 0 │ immutate    │ 266,706 │ 3749.440065989461  │ ±2.89% │ 26671   │
│ 1 │ structurajs │ 251,527 │ 3975.7023814251156 │ ±2.35% │ 25153   │
│ 2 │ immer       │ 128,349 │ 7791.2378652125135 │ ±1.68% │ 12835   │
│ 3 │ mutative    │ 199,303 │ 5017.4691686321075 │ ±1.52% │ 19931   │
└───┴─────────────┴─────────┴────────────────────┴────────┴─────────┘
```

### Running benchmarks:

```shell
bun run build
bun benchmark.js
```
