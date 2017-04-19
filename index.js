import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)

// --------- testing ------------

// const solve = require('./solve')
// const games = require('./games')
//
// const start = Date.now()
// // for (let clues of games) {
// //   console.log(solve(clues))
// // }
// console.log(solve(games[games.length - 1]))
// console.log('completed in (ms)', Date.now() - start)
