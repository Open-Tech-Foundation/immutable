# immutable

> The Unrestrictive Immutability Library for JavaScript Objects.

## Installation

WIP

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
