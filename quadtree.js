class Rectangle {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    contains(point){
        console.log(this.x, point.x, this.x + this.w)
        console.log(this.y, point.y, this.y + this.h)
        return(point.x > this.x
            && point.x < this.x + this.w
            && point.y > this.y
            && point.y < this.y + this.h
        )
    }
}

class QuadTree { 
    constructor(boundary, capacity){
        this.boundary = boundary
        this.capacity = capacity
        this.points = []
        this.divided = false
    }

    draw() {
        console.log("drawing")
        let x = this.boundary.x
        let y = this.boundary.y
        let w = this.boundary.w
        let h = this.boundary.h
        console.log(x, y, w, h)
        ctx.strokeStyle = "white"
        ctx.strokeRect(x, y, w, h)
        if (this.divided){
            this.northEast.draw()
            this.northWest.draw()
            this.southEast.draw()
            this.southWest.draw()
        }
    }

    insert(point){
        console.log(point.x, point.y)
        if (!this.boundary.contains(point)){
            console.log("Point not contained")
            return
        }
        if (this.points.length < this.capacity) {
            this.points.push(point)
        } else {
            if (!this.divided){
                this.subdivide()
            }
            this.northEast.insert(point)
            this.northWest.insert(point)
            this.southEast.insert(point)
            this.southWest.insert(point)
        }
    }

    subdivide() {
        console.log('subdividing')
        let x = this.boundary.x
        let y = this.boundary.y
        let w = this.boundary.w
        let h = this.boundary.h

        let northWestRect = new Rectangle(x, y, w/2, h/2)
        this.northWest = new QuadTree(northWestRect, this.capacity)

        let northEastRect = new Rectangle(x + w/2, y, w/2, h/2)
        this.northEast = new QuadTree(northEastRect, this.capacity)

        let southWestRect = new Rectangle(x, y + h/2, w/2, h/2)
        this.southWest = new QuadTree(southWestRect, this.capacity)

        let southEastRect = new Rectangle(x + w/2, y + h/2, w/2, h/2)
        this.southEast = new QuadTree(southEastRect, this.capacity)
        this.divided = true
    }
}
