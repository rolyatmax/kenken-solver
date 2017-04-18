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
    cells: [[0, 0], [1, 0]]
  },
  {
    symbol: 'x',
    result: 40,
    cells: [[2, 0], [3, 0], [4, 0]]
  },
  {
    symbol: '+',
    result: 3,
    cells: [[2, 1], [3, 1]]
  },
  {
    symbol: null,
    result: 4,
    cells: [[4, 1]]
  },
  {
    symbol: '/',
    result: 2,
    cells: [[1, 2], [1, 3]]
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
