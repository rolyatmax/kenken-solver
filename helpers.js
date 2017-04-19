const newArray = require('new-array')

const columnNames = 'ABCDEFGHI'

module.exports = {
  createEmptyBoard,
  getMaxCellIndex,
  createClues,
  createClueForCell,
  addCellToClue,
  getNeighborCoords,
  validateClues
}

function createEmptyBoard (clues) {
  const max = getMaxCellIndex(clues)
  return newArray(max + 1).map(() => newArray(max + 1, null))
}

function getMaxCellIndex (clues) {
  return clues.reduce((max, clue) => {
    for (let cell of clue.cells) {
      const col = columnNames.indexOf(cell[0])
      const row = parseInt(cell[1]) - 1
      const cellMax = Math.max(col, row)
      if (cellMax > max) return cellMax
    }
    return max
  }, 0)
}

function createClues (size) {
  return newArray(size * size).map((_, i) => {
    const col = i % size
    const row = i / size | 0
    return createClue(`${columnNames[col]}${row + 1}`)
  })
}

function createClue (cell) {
  return {
    symbol: null,
    result: null,
    cells: [cell]
  }
}

function createClueForCell (cell, clues) {
  for (let c of clues) {
    const idx = c.cells.indexOf(cell)
    if (idx > -1) {
      c.cells.splice(idx, 1)
      break
    }
  }
  clues.push(createClue(cell))
  return clues.filter(clue => clue.cells.length)
}

function addCellToClue (cell, clue, clues) {
  if (clue.cells.includes(cell)) return clues
  for (let c of clues) {
    const idx = c.cells.indexOf(cell)
    if (idx > -1) {
      c.cells.splice(idx, 1)
      break
    }
  }
  clue.cells.push(cell)
  return clues.filter(clue => clue.cells.length)
}

function getNeighborCoords (cell, gridSize) {
  const col = columnNames.indexOf(cell[0])
  const row = parseInt(cell[1], 10) - 1
  const neighbors = {}
  if (col - 1 >= 0) {
    neighbors.left = `${columnNames[col - 1]}${row + 1}` // [col - 1, row]
  }
  if (col + 1 < gridSize) {
    neighbors.right = `${columnNames[col + 1]}${row + 1}` // [col + 1, row]
  }
  if (row - 1 >= 0) {
    neighbors.top = `${columnNames[col]}${row}` // [col, row - 1]
  }
  if (row + 1 < gridSize) {
    neighbors.bottom = `${columnNames[col]}${row + 2}` // [col, row + 1]
  }
  return neighbors
}

function validateClues (clues) {
  const cells = {}
  let cellCount = 0

  clues.forEach(clue => {
    clue.cells.forEach(cell => {
      if (cells[cell]) {
        throw new Error(`Cell ${cell} seen more than once`)
      }
      cellCount += 1
      cells[cell] = true
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
