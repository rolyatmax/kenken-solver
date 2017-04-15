import React from 'react'
import newArray from 'new-array'
import styled from 'styled-components'
// import clues from '../games'
// import solve from '../solve'
import { createEmptyBoard, createClues, cellKey, getNeighborCoords, addCellToClue } from '../helpers'

const cellSize = 80
const borderSize = 2
const borderColor = '#bbb'
const neighborBorderColor = '#efefef'
const neighborBorderStyle = 'dashed'

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
    // const thisClues = clues[0]
    const gridSize = 7
    const clues = createClues(gridSize)
    this.state = {
      gridSize: gridSize,
      clues: clues,
      board: createEmptyBoard(clues) // solve(thisClues)
    }
  }

  updateClues (clues) {
    this.setState({ clues })
  }

  render () {
    return (
      <Container>
        <Title><FixKern>K</FixKern>en<FixKern>K</FixKern>en:<br />The Solver!</Title>
        <Grid
          updateClues={this.updateClues.bind(this)}
          size={this.state.gridSize}
          clues={this.state.clues}
          board={this.state.board} />
      </Container>
    )
  }
}

class Grid extends React.Component {
  constructor () {
    super()
    this.state = {
      editingClue: null
    }
  }

  onMouseDown (cell) {
    const clue = this.props.clues.find(c => c.cells.map(cellKey).includes(cellKey(cell)))
    this.setState({ editingClue: clue })
  }

  onMouseUp (cell) {
    this.setState({ editingClue: null })
  }

  onMouseEnter (cell) {
    if (this.state.editingClue) {
      this.props.updateClues(addCellToClue(cell, this.state.editingClue, this.props.clues))
    }
  }

  render () {
    const { size, clues, board } = this.props
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
            <Cell
              key={i}
              style={style}
              onMouseDown={() => this.onMouseDown(cell)}
              onMouseUp={() => this.onMouseUp(cell)}
              onMouseEnter={() => this.onMouseEnter(cell)}>
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
      style[`border${capitalize(direction)}`] = `${borderSize}px ${neighborBorderStyle} ${neighborBorderColor}`
    }
  }
  return style
}

function capitalize (str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}
