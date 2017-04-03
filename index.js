const solve = require('./solve')
const games = require('./games')

for (let clues of games) {
  console.log(solve(clues))
}
