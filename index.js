let canvas, ctx

const tileW = 20
const tileH = 20
const tileRowCount = 25
const tileColumnCount = 40
const tiles = []

for (let c = 0; c < tileColumnCount; c++) {
	tiles[c] = []
	for (let j = 0; j < tileRowCount; j++) {
		tiles[c][j] = {
			x: c * (tileW + 3),
			y: j * (tileH + 3),
			state: 'e' // state is e for empty
		}
	}
}
tiles[0][0].state = 's'
tiles[tileColumnCount - 1][tileRowCount - 1].state = 'f'

function rect(x, y, width, height, state) {
	
	if (state === 's') ctx.fillStyle = 'green'    
	else if (state === 'f') ctx.fillStyle = '#FF0000'
	else if (state === 'w') ctx.fillStyle = 'blue'
	else if (state === 'x') ctx.fillStyle = 'pink'
	else if (state === 'e') ctx.fillStyle = '#ccc'
	else ctx.fillStyle = 'yellow'
	ctx.beginPath()
	ctx.rect(x, y, width, height)
	ctx.closePath()
	ctx.fill()
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for (let i = 0; i < tiles.length; i++) {
		for (let j = 0; j < tiles[i].length; j++) {
			rect(tiles[i][j].x, tiles[i][j].y, tileW, tileH, tiles[i][j].state)
		}
	}
}

function init() {
	canvas = document.querySelector('canvas')
	ctx = canvas.getContext("2d")
	return setInterval(() => draw(), 10)
}

function myDown(e) {
	canvas.onmousemove = myMove
	canvas.onmouseup = function () { canvas.onmousemove = null }
	let x = Math.floor(e.offsetX / (tileW + 3))
	let y = Math.floor(e.offsetY / (tileH + 3))
	if (tiles[x][y].state === 'e') tiles[x][y].state = 'w'
	else if (tiles[x][y].state === 'w') tiles[x][y].state = 'e'

}

function myMove(e) {
	let x = Math.floor(e.offsetX / (tileW + 3))
	let y = Math.floor(e.offsetY / (tileH + 3))
	if (tiles[x][y].state === 'e') tiles[x][y].state = 'w'
}


function solveMaze() {
	const Xqueue = [0]
	const Yqueue = [0]
	let pathFound = false
	let xLoc, yLoc
	while (Xqueue.length > 0 && !pathFound) {
		// 获取第一个值
		xLoc = Xqueue.shift()
		yLoc = Yqueue.shift()
		// 判断到终点
		if (xLoc > 0) {
			if (tiles[xLoc - 1][yLoc].state === 'f') {
				pathFound = true
			}
		}
		if (xLoc < tileColumnCount - 1) {
			if (tiles[xLoc + 1][yLoc].state === 'f') {
				pathFound = true
			}
		}
		if (yLoc > 0) {
			if (tiles[xLoc][yLoc - 1].state === 'f') {
				pathFound = true
			}
		}
		if (yLoc < tileRowCount - 1) {
			if (tiles[xLoc][yLoc + 1].state === 'f') {
				pathFound = true
			}
		}
		// 判断周围是不是e
		if (xLoc > 0) {
			if (tiles[xLoc - 1][yLoc].state === 'e') {
				Xqueue.push(xLoc - 1)
				Yqueue.push(yLoc)
				tiles[xLoc - 1][yLoc].state = tiles[xLoc][yLoc].state + 'l'
			}
		}
		if (xLoc < tileColumnCount - 1) {
			if (tiles[xLoc + 1][yLoc].state === 'e') {
				Xqueue.push(xLoc + 1)
				Yqueue.push(yLoc)
				tiles[xLoc + 1][yLoc].state = tiles[xLoc][yLoc].state + 'r'
			}
		}
		if (yLoc > 0) {
			if (tiles[xLoc][yLoc - 1].state === 'e') {
				Xqueue.push(xLoc)
				Yqueue.push(yLoc - 1)
				tiles[xLoc][yLoc - 1].state = tiles[xLoc][yLoc].state + 'u'
			}
		}
		if (yLoc < tileRowCount - 1) {
			if (tiles[xLoc][yLoc + 1].state === 'e') {
				Xqueue.push(xLoc)
				Yqueue.push(yLoc + 1)
				tiles[xLoc][yLoc + 1].state = tiles[xLoc][yLoc].state + 'd'
			}
		}
	}
	if(!pathFound) {
		alert('No Solution!')
	}
	else
	{
		console.log(tiles[xLoc][yLoc].state);
		let path = tiles[xLoc][yLoc].state
		let pathLength = path.length
		let currX = 0
		let currY = 0
		for (let i = 0; i < pathLength-1; i++) {
			if(path.charAt(i+1) === 'u'){
				currY-=1
			}		
			if(path.charAt(i+1) === 'd'){
				currY+=1
			}
			if(path.charAt(i+1) === 'r'){
				currX+=1
			}
			if(path.charAt(i+1) === 'l'){
				currX-=1
			}
			tiles[currX][currY].state = 'x'
		}
	}
}

init()

canvas.onmousedown = myDown

