var canvas = document.getElementById("conways_game_of_life")
var ctx = canvas.getContext("2d")
var width = canvas.width
var height = canvas.height
var rows = 25
var unit = width / rows

var cells = array2d(rows, rows, false)
drawCells()

var gameIntervalID = -1
function start() {
  if (gameIntervalID == -1) {
  gameIntervalID = setInterval(game, 200)
  }
}

function stop() {
  clearInterval(gameIntervalID)
  gameIntervalID = -1
}

function clearCells() {
  cells = array2d(rows, rows, false)
  drawCells()
  stop()
}

function toggleCell(event) {
  let rect = canvas.getBoundingClientRect()
  let x = event.clientX - rect.left
  let y = event.clientY - rect.top
  cells[Math.floor(x / unit)][Math.floor(y / unit)] = !cells[Math.floor(x / unit)][Math.floor(y / unit)]
  drawCells()
}

function game() {
  let cells2 = array2d(rows, rows, false)
  for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
  let neighbors = countNeighbors(i, j)
  if (!cells[i][j] && neighbors == 3) {
  cells2[i][j] = true
  } else if (cells[i][j]) {
  cells2[i][j] = neighbors == 2 || neighbors == 3
  }
  }
  }
  cells = cells2
  drawCells()
}

function drawCells() {
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = "white"
  ctx.fillStyle = "yellow"
  for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
  ctx.beginPath()
  ctx.rect(i * unit, j * unit, unit, unit)
  if (cells[i][j]) {
  ctx.fill()
  } else {
  ctx.stroke()
  }
  }
  }
}

function countNeighbors(x, y) {
  let count = 0
  for (let i = -1; i <= 1; i++) {
  for (let j = -1; j <= 1; j++) {
  if (!(i == 0 && j == 0)) {
  let neighborX = (x + i) % 25
  neighborX = neighborX == -1 ? (rows - 1) : neighborX
  let neighborY = (y + j) % 25
  neighborY = neighborY == -1 ? (rows - 1) : neighborY
  if (cells[neighborX] && cells[neighborX][neighborY]) {
  count++
  }
  }
  }
  }
  return count
}

function array2d(a, b, fill) {
  let array = new Array(a)
  for (let i = 0; i < a; i++) {
  array[i] = new Array(b)
  for (let j = 0; j < b; j++) {
  array[i][j] = fill
  }
  }
  return array
}
