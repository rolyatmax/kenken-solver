const newArray = require('new-array')

module.exports = {
  createEmptyBoard,
  getMaxCellIndex,
  createClues,
  createClueForCell,
  addCellToClue,
  getNeighborCoords,
  cellKey
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

function createClues (size) {
  return newArray(size * size).map((_, i) => {
    const cell = [i % size, i / size | 0]
    return createClue(cell)
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
    const idx = c.cells.map(cellKey).indexOf(cellKey(cell))
    if (idx > -1) {
      c.cells.splice(idx, 1)
      break
    }
  }
  clues.push(createClue(cell))
  return clues.filter(clue => clue.cells.length)
}

function addCellToClue (cell, clue, clues) {
  if (clue.cells.map(cellKey).includes(cellKey(cell))) return clues
  for (let c of clues) {
    const idx = c.cells.map(cellKey).indexOf(cellKey(cell))
    if (idx > -1) {
      c.cells.splice(idx, 1)
      break
    }
  }
  clue.cells.push(cell)
  return clues.filter(clue => clue.cells.length)
}

function getNeighborCoords (cell, gridSize) {
  const [col, row] = cell
  const neighbors = {}
  if (col - 1 >= 0) {
    neighbors.left = [col - 1, row]
  }
  if (col + 1 < gridSize) {
    neighbors.right = [col + 1, row]
  }
  if (row - 1 >= 0) {
    neighbors.top = [col, row - 1]
  }
  if (row + 1 < gridSize) {
    neighbors.bottom = [col, row + 1]
  }
  return neighbors
}

function cellKey (cell) {
  return cell.join('|')
}
