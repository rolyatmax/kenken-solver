import React from 'react'
import newArray from 'new-array'
import styled from 'styled-components'
import clues from '../games'
import solve from '../solve'

const cellSize = 80
const borderSize = 2
const borderColor = '#bbb'
const neighborBorderColor = '#efefef'

const Container = styled.div`
  width: 960px;
  margin: auto;
  color: #444;
  font-family: 'Poppins', serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
`

const FixKern = styled.span`
  margin-right: -5px;
`

const Title = styled.h1`
  font-size: 88px;
  line-height: 0.9em;
  letter-spacing: -5px;
  margin-bottom: 60px;
`

const Cell = styled.div`
  position: relative;
  font-size: 26px;
  color: #666;
  line-height: ${cellSize - borderSize * 2}px;
  width: ${cellSize - borderSize * 2}px;
  height: ${cellSize - borderSize * 2}px;
  background-color: #fff;
  border: ${borderSize}px solid ${borderColor};
  float: left;
  cursor: pointer;
  transition: background-color linear 200ms;
  ${''/* &:hover {
    background-color: #fafafa;
  } */}
`

const Clue = styled.span`
  position: absolute;
  font-size: 14px;
  top: 3px;
  left: 3px;
  line-height: 1.2em;
  color: #aaa;
`

export default class App extends React.Component {
  constructor () {
    super()
    const thisClues = clues[0]
    this.state = {
      gridSize: 7,
      clues: thisClues,
      board: solve(thisClues)
    }
  }

  render () {
    return (
      <Container>
        <Title><FixKern>K</FixKern>en<FixKern>K</FixKern>en:<br />The Solver!</Title>
        <Grid size={this.state.gridSize} clues={this.state.clues} board={this.state.board} />
      </Container>
    )
  }
}

function Grid ({ size, clues, board }) {
  const Board = styled.div`
    width: ${cellSize * size}px;
    height: ${cellSize * size}px;
    border: ${borderSize}px solid ${borderColor};
    margin: auto;
  `

  const cluesByCell = keyByCells(clues)

  return (
    <Board>
      {newArray(size * size).map((_, i) => {
        const col = i % size
        const row = i / size | 0
        const cell = [col, row]
        const clue = cluesByCell[cellKey(cell)]
        const style = getBorderStyle(cell, clue.cells, size)
        const value = board[col][row]
        return (
          <Cell key={i} style={style}>
            <span>
              {value}
              {isTopRight(cell, clue.cells) ? <Clue>{clue.result}{clue.symbol}</Clue> : null}
            </span>
          </Cell>
        )
      })}
    </Board>
  )
}

function keyByCells (clues) {
  const key = {}
  for (let clue of clues) {
    for (let cell of clue.cells) {
      key[cellKey(cell)] = clue
    }
  }
  return key
}

function isTopRight (cell, cells) {
  let topRight = cells[0]
  for (let c of cells) {
    if (
      (c[1] < topRight[1]) ||
      (c[1] === topRight[1] && c[0] < topRight[0])
    ) {
      topRight = c
      continue
    }
  }
  return cellKey(topRight) === cellKey(cell)
}

// we change the border color for cells in the same clue so that
// they appear to be grouped together
function getBorderStyle (cell, neighbors, gridSize) {
  const style = {}
  neighbors = neighbors.map(cellKey)
  const neighborCoords = getNeighborCoords(cell, gridSize)
  for (let direction in neighborCoords) {
    if (neighbors.includes(cellKey(neighborCoords[direction]))) {
      style[`border${capitalize(direction)}`] = `${borderSize}px solid ${neighborBorderColor}`
    }
  }
  return style
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

function capitalize (str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}
