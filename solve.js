const assert = require('assert')
const newArray = require('new-array')

module.exports = function solve (clues) {
  validateClues(clues)
  const board = createEmptyBoard(clues)

  // find all possible set combinations first, then
  // sort clues by fewest to most answers as a way to prune the
  // tree early
  clues = clues.map(clue => Object.assign({}, clue, {
    possibleAnswers: getPossibleAnswers(board, clue)
  }))
  clues.sort((clue1, clue2) => clue1.possibleAnswers.length - clue2.possibleAnswers.length)

  const solution = getValidBoard(board, clues)
  return solution
}

function getValidBoard (board, clues) {
  if (isValid(board) && !clues.length) return board
  const nextBoards = getNextPossibleBoards(board, clues[0])
    .filter(isValid)
    .map(b => getValidBoard(b, clues.slice(1)))
    .filter(b => b)
  return nextBoards[0] || null
}

function getPossibleAnswers (board, clue) {
  if (!clue.symbol) {
    return [clue.result]
  }
  const permutationValues = newArray(board.length).map((d, i) => i + 1)
  const numberCombos = generatePermutations(clue.cells.length, permutationValues)
  return numberCombos.filter(combo => {
    switch (clue.symbol) {
      case '+': {
        return combo.reduce((total, val) => total + val, 0) === clue.result
      }
      case 'x': {
        return combo.reduce((total, val) => total * val, 1) === clue.result
      }
      case '-': {
        return combo[0] - combo[1] === clue.result || combo[1] - combo[0] === clue.result
      }
      case '/': {
        return combo[0] / combo[1] === clue.result || combo[1] / combo[0] === clue.result
      }
    }
  })
}

function getNextPossibleBoards (board, clue) {
  if (clue.possibleAnswers.length === 1) {
    board = copyBoard(board)
    board[clue.cells[0][0]][clue.cells[0][1]] = clue.possibleAnswers[0]
    return [board]
  }

  const nextBoards = clue.possibleAnswers.map((values) => {
      const b = copyBoard(board)
      values.forEach((val, i) => {
        const [x, y] = clue.cells[i]
        b[x][y] = val
      })
      return b
  })

  return nextBoards
}

function generatePermutations (digits, values, useOnce = false) {
  if (digits === 1) return values.map(v => [v])
  const permutations = []
  values.forEach(val => {
    const vals = values.slice()
    if (useOnce) {
      vals.splice(vals.findIndex(v => v === val), 1)
    }
    generatePermutations(digits - 1, vals, useOnce).forEach(perms => {
      const ps = perms.slice()
      ps.unshift(val)
      permutations.push(ps)
    })
  })

  // filter to uniques
  const seen = {}
  return permutations.filter(perm => {
    if (seen[perm.join(',')]) return false
    seen[perm.join(',')] = true
    return true
  })
}

function copyBoard (board) {
  return board.map(row => row.slice())
}

function isValid (board) {
  return checkRows(board) && checkRows(invertBoard(board))
}

function invertBoard (board) {
  const inverted = []
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      inverted[y] = inverted[y] || []
      inverted[y][x] = board[x][y]
    }
  }
  return inverted
}

function checkRows (board) {
  for (let row of board) {
    const seen = {}
    for (let cell of row) {
      if (cell && seen[cell]) return false
      seen[cell] = true
    }
  }
  return true
}

function createEmptyBoard (clues) {
  const max = getMaxCellIndex(clues)
  return newArray(max + 1).map(() => newArray(max + 1, null))
}

function getMaxCellIndex (clues) {
  return clues.reduce((max, clue) => {
    for (let cell of clue.cells) {
      const cellMax = Math.max(cell[0], cell[1])
      if (cellMax > max) return cellMax
    }
    return max
  }, 0)
}

function validateClues (clues) {
  const cells = {}
  let cellCount = 0

  clues.forEach(clue => {
    clue.cells.forEach(([x, y]) => {
      const key = [x, y].join(',')
      if (cells[key]) {
        throw new Error(`Cell ${key} seen more than once`)
      }
      cellCount += 1
      cells[key] = true
    })
    // make sure all null symbols have only one cell
    if (!clue.symbol && clue.cells.length !== 1) {
      throw new Error(`Given value has too many cells: ${JSON.stringify(clue)}`)
    }

    // make sure - and / only have two cells
    if (clue.symbol === '-' || clue.symbol === '/') {
      if (clue.cells.length !== 2) {
        throw new Error(`Clue with ${clue.symbol} symbol has ${clue.cells.length} cells`)
      }
    }

    // make sure no results are 0
    if (!clue.result) {
      throw new Error(`Invalid clue result: ${clue.result}`)
    }
  })

  // make sure all cells are covered - and covered only once
  if (cellCount !== Math.pow(getMaxCellIndex(clues) + 1, 2)) {
    throw new Error('Not all cells covered by clues')
  }
}

// ---------- TESTS ----------

const VALID_BOARD_1 = [
  [0, 1, 2, 3],
  [3, 2, 0, 1],
  [1, 0, 3, 2],
  [2, 3, 4, 0]
]

const VALID_BOARD_2 = [
  [0, 1, 2, 3],
  [3, null, 0, 1],
  [1, 0, null, null],
  [2, 3, null, 0]
]

const INVALID_BOARD_1 = [
  [0, 1, 2, 3],
  [3, null, 0, 1],
  [1, 3, null, null],
  [2, 3, null, 0]
]

const INVALID_BOARD_2 = [
  [0, 1, 2, 3],
  [3, null, 3, 1],
  [1, 0, null, null],
  [2, 3, null, 0]
]

assert(isValid(VALID_BOARD_1))
assert(isValid(VALID_BOARD_2))
assert(isValid(INVALID_BOARD_1) === false)
assert(isValid(INVALID_BOARD_2) === false)

const invertedBoard = invertBoard([[1, 2], [3, 4]])
assert(invertedBoard[0][0] === 1)
assert(invertedBoard[0][1] === 3)
assert(invertedBoard[1][0] === 2)
assert(invertedBoard[1][1] === 4)
