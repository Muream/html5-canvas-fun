var canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var ctx = canvas.getContext('2d')

window.addEventListener('resize', () => {
    initialize()
})

var circleCount = 1000
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
function initialize(){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    var rect = new Rectangle(0, 0, canvas.width, canvas.height)
    var quadTree = new QuadTree(rect, 5)

    ctx.clearRect(0, 0, innerWidth, innerHeight)

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
    console.log(quadTree)
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
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.x += 1 * this.dx * this.velocity
        this.y += 1 * this.dy * this.velocity
        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.dx *= -1
        } else if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.dy *= -1
        }
        this.draw()
    }
}

class Line {
    constructor(startX, startY, endX, endY, startCol, endCol){
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
        this.startCol = startCol
        this.endCol = endCol
    }
    draw(){
        ctx.beginPath()
        ctx.moveTo(this.startX, this.startY)
        ctx.lineTo(this.endX, this.endY)
        let gradient = ctx.createLinearGradient(this.startX, this.startY, this.endX, this.endY)
        gradient.addColorStop(0, this.startCol)
        gradient.addColorStop(1, this.endCol)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()
    }
}



var maxConnectionDist = 75
function animate(){
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    for (let i = 0; i < circles.length; i++) {
        let currentCircle = circles[i]
        // for (let otherI = 0; otherI < circles.length; otherI++) {
        //     let otherCircle = circles[otherI]
        //     if (Math.abs(currentCircle.x - otherCircle.x) > -maxConnectionDist && Math.abs(currentCircle.x - otherCircle.x) < maxConnectionDist
        //         && Math.abs(currentCircle.y - otherCircle.y) > -maxConnectionDist && Math.abs(currentCircle.y - otherCircle.y) < maxConnectionDist
        //     ){
        //         let line = new Line(currentCircle.x, currentCircle.y, otherCircle.x, otherCircle.y, currentCircle.color, otherCircle.color)
        //         line.draw()
        //     }
        // }
        currentCircle.update()
    }
}
initialize()
// animate()
