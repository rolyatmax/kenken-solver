import React from 'react'
import newArray from 'new-array'
import styled from 'styled-components'
import ClickOutsideNotifier from './click-outside-notifier'
// import clues from '../games'
import solve from '../solve'
import { createEmptyBoard, createClues, createClueForCell, getNeighborCoords, addCellToClue } from '../helpers'

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
  font-size: 68px;
  line-height: 0.9em;
  letter-spacing: -5px;
  margin-bottom: 40px;
`

const GridSizeButtons = styled.div`
  display: inline-block;
  margin-bottom: 20px;
  border: 1px solid #999;
  border-radius: 5px;
  overflow: hidden;
`

const GridSizeButton = styled.button`
  outline: none;
  padding: 10px 15px;
  border: 0;
  border-right: 1px solid #999;
  color: #666;
  background-color: white;
  cursor: pointer;
  transition: all 150ms linear;
  &:hover {
    background-color: #f5f5f5;
  }
  &:last-child {
    border-right: 0;
  }
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
  ${''/* cursor: pointer; */}
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
  user-select: none;
  cursor: pointer;
  transition: color 200ms linear;
  &:hover {
    color: lightblue;
  }
`

const modalWidth = 400
const Modal = styled.div`
  position: absolute;
  width: ${modalWidth}px;
  background-color: white;
  box-shadow: 0 0 5px rgba(30, 30, 30, 0.3);
  top: 20vh;
  left: 50%;
  margin-left: -${modalWidth / 2}px;
  border-radius: 5px;
  color: #555;
  padding: 20px;
  box-sizing: border-box;
`

const Button = styled.button`
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  background-color: lightblue;
  border: 1px solid #eee;
  color: white;
  border-radius: 5px;
`

const Input = styled.input`
  padding: 10px 20px;
  font-size: 18px;
  border: 1px solid #eee;
  border-radius: 5px;
`

const SymbolSelect = styled.span`
  display: inline-block;
  font-size: 22px;
  color: #bbb;
  margin: 0 10px;
  cursor: pointer;
  transition: color 200ms linear;
  &:hover {
    color: #777;
  }
`

const SolveButton = styled.button`
  font-size: 38px;
  margin-top: 25px;
  padding: 12px 30px;
  border: 1px solid #bbb;
  border-radius: 7px;
  background: #fefefe;
  cursor: pointer;
  transition: background 200ms linear, color 200ms linear;
  color: #555;
  &:hover {
    background: lightblue;
    color: white;
  }
`

export default class App extends React.Component {
  constructor () {
    super()
    const gridSize = 5
    this.state = this.getResetState(gridSize)
  }

  getResetState (gridSize) {
    const clues = createClues(gridSize)
    return {
      gridSize: gridSize,
      clues: clues,
      board: createEmptyBoard(clues)
    }
  }

  updateGridSize (gridSize) {
    this.setState(this.getResetState(gridSize))
  }

  updateClues (clues) {
    const board = createEmptyBoard(clues)
    this.setState({ clues, board })
  }

  solve () {
    // validate the clues
    // TODO: animate the solving (show all the board versions the algo is trying)
    // get the board solution and setState
    const board = solve(this.state.clues)
    this.setState({ board })
  }

  render () {
    const { gridSize, clues, board } = this.state
    return (
      <Container>
        <Title><FixKern>K</FixKern>en<FixKern>K</FixKern>en:<br />The Solver!</Title>
        <GridSizeSelector gridSize={gridSize} updateGridSize={this.updateGridSize.bind(this)} />
        <Grid
          updateClues={this.updateClues.bind(this)}
          size={gridSize}
          clues={clues}
          board={board} />
        <SolveButton onClick={this.solve.bind(this)}>Solve!</SolveButton>
      </Container>
    )
  }
}

function GridSizeSelector ({ updateGridSize, gridSize }) {
  const sizes = [3, 4, 5, 6, 7, 8, 9]
  const selectedStyle = { backgroundColor: 'lightblue', color: 'white' }
  return (
    <GridSizeButtons>
      {sizes.map(size => (
        <GridSizeButton
          key={size}
          style={gridSize === size ? selectedStyle : {}}
          onClick={() => updateGridSize(size)}>
          {size}
        </GridSizeButton>
      ))}
    </GridSizeButtons>
  )
}

class Grid extends React.Component {
  constructor () {
    super()
    this.hasMovedCellsSinceDrag = false
    this.state = {
      editingClueGroup: null,
      editingClueResult: null
    }
  }

  onMouseDown (cell) {
    const clue = this.props.clues.find(c => c.cells.includes(cell))
    this.hasMovedCellsSinceDrag = false
    this.setState({ editingClueGroup: clue })
  }

  onMouseUp (cell) {
    if (!this.hasMovedCellsSinceDrag) {
      this.props.updateClues(createClueForCell(cell, this.props.clues))
    }
    this.setState({ editingClueGroup: null })
    this.hasMovedCellsSinceDrag = false
  }

  onMouseEnter (cell) {
    if (this.state.editingClueGroup) {
      this.hasMovedCellsSinceDrag = true
      this.props.updateClues(addCellToClue(cell, this.state.editingClueGroup, this.props.clues))
    }
  }

  onClickClue (e, cell) {
    const clue = this.props.clues.find(c => c.cells.includes(cell))
    this.setState({ editingClueResult: clue, editingClueGroup: null })
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  updateClue (result, symbol) {
    const clue = this.props.clues.find(c => c === this.state.editingClueResult)
    clue.result = result
    clue.symbol = symbol
    this.props.updateClues([...this.props.clues])
    this.setState({ editingClueResult: null })
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
    const columnNames = 'ABCDEFGHI'
    return (
      <Board>
        {newArray(size * size).map((_, i) => {
          const col = i % size
          const row = i / size | 0
          const cell = `${columnNames[col]}${row + 1}`
          const clue = cluesByCell[cell]
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
                {isTopRight(cell, clue.cells) ? (
                  <Clue onMouseUp={(e) => this.onClickClue(e, cell)}>{clue.result ? `${clue.result}${clue.symbol || ''}` : 'Add clue'}</Clue>
                ) : null}
              </span>
            </Cell>
          )
        })}
        {this.state.editingClueResult ? (
          <EditClueModal clue={this.state.editingClueResult} updateClue={this.updateClue.bind(this)} />
        ) : null}
      </Board>
    )
  }
}

const symbols = ['+', '-', 'x', '/']
class EditClueModal extends React.Component {
  constructor (props) {
    super(props)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.state = {
      result: props.clue.result,
      symbol: props.clue.symbol
    }
  }

  componentDidMount () {
    this.input.focus()
    window.addEventListener('keyup', this.onKeyUp)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.onKeyUp)
  }

  onKeyUp (e) {
    switch (e.which) {
      case 27:
        this.cancel()
        return
      case 13:
        this.submit()
    }
  }

  cancel () {
    this.props.updateClue(this.props.clue.result, this.props.clue.symbol)
  }

  submit () {
    this.props.updateClue(this.state.result, this.state.symbol)
  }

  onChange (e) {
    const last = e.target.value[e.target.value.length - 1]
    const symbol = symbols.includes(last) ? last : this.state.symbol
    const result = parseInt(e.target.value, 10)
    this.setState({ result, symbol })
  }

  setSymbol (symbol) {
    this.setState({ symbol })
  }

  render () {
    const isSingleCell = this.props.clue.cells.length === 1
    return (
      <ClickOutsideNotifier onOutsideClick={this.cancel.bind(this)}>
        <Modal onClick={(e) => { e.stopPropagation(); e.preventDefault(); return false }}>
          <Input placeholder='Number' innerRef={(el) => { this.input = el }} value={this.state.result || ''} onChange={this.onChange.bind(this)} />
          {isSingleCell ? null : (
            symbols.map(s => (
              <SymbolSelect key={s} onClick={() => this.setSymbol(s)} style={this.state.symbol === s ? { color: '#555' } : {}}>
                {s}
              </SymbolSelect>
            ))
          )}
          <Button onClick={this.submit.bind(this)}>Update</Button>
        </Modal>
      </ClickOutsideNotifier>
    )
  }
}

function keyByCells (clues) {
  const key = {}
  for (let clue of clues) {
    for (let cell of clue.cells) {
      key[cell] = clue
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
  return topRight === cell
}

// we change the border color for cells in the same clue so that
// they appear to be grouped together
function getBorderStyle (cell, neighbors, gridSize) {
  const style = {}
  const neighborCoords = getNeighborCoords(cell, gridSize)
  for (let direction in neighborCoords) {
    if (neighbors.includes(neighborCoords[direction])) {
      style[`border${capitalize(direction)}`] = `${borderSize}px ${neighborBorderStyle} ${neighborBorderColor}`
    }
  }
  return style
}

function capitalize (str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}
