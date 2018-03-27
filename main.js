var circlesLayer = document.getElementById('layer1')
circlesLayer.width = window.innerWidth
circlesLayer.height = window.innerHeight
var circlesCtx = circlesLayer.getContext('2d')

var quadTreeLayer = document.getElementById('layer2')
quadTreeLayer.width = window.innerWidth
quadTreeLayer.height = window.innerHeight
var quadTreeCtx = quadTreeLayer.getContext('2d')

var mouseDown = false

window.addEventListener('resize', () => {
    initialize()
})

window.addEventListener('mousedown', () => {
    mouseDown = true
})
window.addEventListener('mouseup', () => {
    mouseDown = false
})

var rect
var quadTree
var circleCount = 500
var circles = []
var maxRadius = 50
var mouseDistance = 100
var colorArray = [
    '#2E0927',
    '#D90000',
    '#FF2D00',
    '#FF8C00',
    '#04756F',
]

function initialize() {
    circlesLayer.width = window.innerWidth
    circlesLayer.height = window.innerHeight
    quadTreeLayer.width = window.innerWidth
    quadTreeLayer.height = window.innerHeight

    circlesCtx.clearRect(0, 0, innerWidth, innerHeight)
    quadTreeCtx.clearRect(0, 0, innerWidth, innerHeight)

    rect = new Rectangle(0, 0, circlesLayer.width, circlesLayer.height)
    quadTree = new QuadTree(rect, 5, 2)

    circles = []
    for (let i = 0; i < circleCount; i++) {
        let dx = (Math.random() -0.5) * 2
        let dy = (Math.random() - 0.5) * 2
        let radius = Math.random() * 3 + 1
        let x = Math.random() * (innerWidth - radius * 2) + radius
        let y = Math.random() * (window.innerHeight - radius * 2) + radius
        let circle = new Circle(x, y, radius, dx, dy, 2.5)
        circle.draw()
        circles.push(circle)
        quadTree.insert(circle)
    }
    quadTree.draw()
}


class Circle {
    constructor(x, y, radius, dx, dy, velocity) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.radius = radius
        this.origRadius = radius
        this.velocity = velocity
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)]
        this.connections = []
    }
    draw(overrideColor) {
        circlesCtx.beginPath()
        circlesCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        if (overrideColor){
            circlesCtx.fillStyle = overrideColor
        } else {
            circlesCtx.fillStyle = this.color
        }
        circlesCtx.fill()
    }
    update(overrideColor) {
        this.x += 1 * this.dx * this.velocity
        this.y += 1 * this.dy * this.velocity
        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.dx *= -1
        } else if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.dy *= -1
        }
        this.draw(overrideColor)
    }
}

class Line {
    constructor(startX, startY, endX, endY, startCol, endCol) {
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
        this.startCol = startCol
        this.endCol = endCol
    }
    draw() {
        circlesCtx.beginPath()
        circlesCtx.moveTo(this.startX, this.startY)
        circlesCtx.lineTo(this.endX, this.endY)
        let gradient = circlesCtx.createLinearGradient(this.startX, this.startY, this.endX, this.endY)
        gradient.addColorStop(0, this.startCol)
        gradient.addColorStop(1, this.endCol)
        circlesCtx.strokeStyle = gradient
        circlesCtx.lineWidth = 2
        circlesCtx.stroke()
    }
}


var maxConnectionDist = 75
function animate() {
    requestAnimationFrame(animate)
    circlesCtx.clearRect(0, 0, innerWidth, innerHeight)
    quadTreeCtx.clearRect(0, 0, innerWidth, innerHeight)
    quadTree = new QuadTree(rect, 5, 2)
    let w = maxConnectionDist * 2
    for (let currentCircle of circles) {
        currentCircle.connections = []
        quadTree.insert(currentCircle)
        let area = new Rectangle(currentCircle.x - w/2, currentCircle.y - w/2, w, w)
        let foundCircles = quadTree.query(area)
        for (let otherCircle of foundCircles){
            if (otherCircle.connections.includes(currentCircle)){
                continue
            }
            if (Math.abs(currentCircle.x - otherCircle.x) > -maxConnectionDist && Math.abs(currentCircle.x - otherCircle.x) < maxConnectionDist
                && Math.abs(currentCircle.y - otherCircle.y) > -maxConnectionDist && Math.abs(currentCircle.y - otherCircle.y) < maxConnectionDist
            ){
                currentCircle.connections.push(otherCircle)
                otherCircle.connections.push(currentCircle)
                let line = new Line(currentCircle.x, currentCircle.y, otherCircle.x, otherCircle.y, currentCircle.color, otherCircle.color)
                line.draw()
            }
        }
        currentCircle.update()
    }
    // quadTree.draw()
}
initialize()
animate()
