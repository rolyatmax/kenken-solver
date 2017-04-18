# kenken solver

Solving kenkens. Should prob try this with breadth-first search instead of
depth-first search.

Use in browser or with Node. Hoping to create an interactive version for the
browser which lets users create their own boards and watch the algorithm solve
them.

```js
const solve = require('./solve')
const solution = solve(clues)
console.log(solution)
```

where `clues` looks like:

```js
const clues = [
  {
    symbol: '-',
    result: 2,
    cells: ['A1', 'B1']
  },
  {
    symbol: 'x',
    result: 40,
    cells: ['C1', 'D1', 'E1']
  },
  {
    symbol: '+',
    result: 3,
    cells: ['C2', 'D2']
  },
  {
    symbol: null,
    result: 4,
    cells: ['E2']
  },
  {
    symbol: '/',
    result: 2,
    cells: ['B3', 'B4']
  },
  ...
]
```

## To do:
 - [x] switch to `A1`, `B1`, etc cell names (instead of `[0,0]`, `[1,0]`, etc)
 - [ ] add reset button
 - [ ] add "random puzzle" button
 - [ ] encode puzzles in URL for easy sharing?
 - [ ] clues validation error feedback
 - [ ] animate the solving
 - [ ] check for multiple solutions
 - [ ] algorithm performance improvements
 - [ ] computer-generated kenken puzzles?
 - [ ] deploy on github pages
