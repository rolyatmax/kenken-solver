# kenken solver

Solving kenken puzzles.

Use in browser or with Node.

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
 - [x] add reset button
 - [x] add "random puzzle" button
 - [ ] encode puzzles in URL for easy sharing?
 - [x] clues validation error feedback
 - [ ] animate the solving
 - [x] check for multiple solutions
 - [ ] algorithm performance improvements
 - [ ] computer-generated kenken puzzles?
 - [ ] deploy on github pages
