class Rectangle {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    contains(point){
        return(point.x > this.x
            && point.x < this.x + this.w
            && point.y > this.y
            && point.y < this.y + this.h
        )
    }
    intersects(other){
        return !(this.x > other.x + other.w
            || this.x + this.w < other.x
            || this.y > other.y + other.h
            || this.y + this.h < other.y)
    }
}

class QuadTree { 
    constructor(boundary, capacity, lineThickness){
        this.boundary = boundary
        this.capacity = capacity
        this.points = []
        this.divided = false
        this.lineThickness = lineThickness
    }

    draw() {
        let x = this.boundary.x
        let y = this.boundary.y
        let w = this.boundary.w
        let h = this.boundary.h
        quadTreeCtx.lineWidth = this.lineThickness
        quadTreeCtx.strokeStyle = "green"
        quadTreeCtx.strokeRect(x, y, w, h)
        if (this.divided){
            this.northEast.draw()
            this.northWest.draw()
            this.southEast.draw()
            this.southWest.draw()
        }
    }

    insert(point){
        if (!this.boundary.contains(point)){
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

    query(area, foundPoints){
        if (!foundPoints){
            foundPoints = []
        }
        if (!this.boundary.intersects(area)){
            return
        } else {
            for (let point of this.points) {
                if (area.contains(point)) {
                    foundPoints.push(point)
                } else {
                }
            }
        }
        if (this.divided) {
            this.northWest.query(area, foundPoints)
            this.northEast.query(area, foundPoints)
            this.southWest.query(area, foundPoints)
            this.southEast.query(area, foundPoints)
        }
        return foundPoints
    }

    subdivide() {
        let x = this.boundary.x
        let y = this.boundary.y
        let w = this.boundary.w
        let h = this.boundary.h

        let northWestRect = new Rectangle(x, y, w/2, h/2)
        this.northWest = new QuadTree(northWestRect, this.capacity, this.lineThickness/1.5)

        let northEastRect = new Rectangle(x + w/2, y, w/2, h/2)
        this.northEast = new QuadTree(northEastRect, this.capacity, this.lineThickness/1.5)

        let southWestRect = new Rectangle(x, y + h/2, w/2, h/2)
        this.southWest = new QuadTree(southWestRect, this.capacity, this.lineThickness/1.5)

        let southEastRect = new Rectangle(x + w/2, y + h/2, w/2, h/2)
        this.southEast = new QuadTree(southEastRect, this.capacity, this.lineThickness/1.5)
        this.divided = true
    }
}
