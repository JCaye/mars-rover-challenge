class Terrain {
    constructor(xSize, ySize) {
        this.maxX = xSize;
        this.maxY = ySize;
    }

    containsCoordinates(xCoordinate, yCoordinate) {
        return xCoordinate <= this.maxX
            && yCoordinate <= this.maxY
            && xCoordinate >= 0
            && yCoordinate >= 0;
    }

    toJSON() {
        return `The terrain is ${this.maxX} by ${this.maxY}`;    
    }
}

module.exports = Terrain;