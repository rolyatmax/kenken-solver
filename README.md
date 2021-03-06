# kenken solver

Solving kenken puzzles.

Use in browser or with Node. (Note: it still needs some performance improvements. Can take way too long for large puzzles.)

Here's [an example](https://rolyatmax.github.io/kenken-solver/).

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
 - [ ] clues validation error feedback in the UI
 - [ ] animate the solving
 - [x] check for multiple solutions
 - [ ] algorithm performance improvements
 - [ ] computer-generated kenken puzzles?
 - [ ] add some instructions to the UI
 - [x] deploy on github pages
