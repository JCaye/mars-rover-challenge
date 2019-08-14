class Terrain {
    constructor(xSize, ySize) {
        this.maxX = xSize;
        this.maxY = ySize;
    }

    toJSON() {
        return `The terrain is ${this.maxX} by ${this.maxY}`;    
    }
}

module.exports = Terrain;