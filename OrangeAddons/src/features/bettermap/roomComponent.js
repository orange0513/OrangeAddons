export class SoopyNumber {
    /**
     * Creates a {@link SoopyNumber}
     * @constructor
     * @arg {Number} number The number
     */
    constructor(number) {
        /**
         * The number
         * @type {Number}
         */
        this.number = number

        this.lastNumber = number
        this.lastNumberUpdate = Date.now()
        this.currAnimTime = 0

        this.animMode = "sin"
    }

    /**
     * Allows setting the animation easing mode
     * @param {"sin"|"sin_out"|"linea"} mode The animation mode
     */
    setAnimMode(mode) {
        this.animMode = mode
        return this
    }
    /**
     * Sets the Number
     * @arg {Number} number The new number
     * @returns {SoopyNumber} for method chaining
     */
    set(number, animationTime = 0) {
        if (this.number === number) return;

        this.lastNumber = this.get()
        this.lastNumberUpdate = Date.now()
        this.currAnimTime = animationTime

        this.number = number
        return this
    }

    /**
     * Returns the number
     * @returns {Number} The number
     */
    get() {
        if (this.currAnimTime === 0) return this.number
        if (this.lastNumberUpdate + this.currAnimTime < Date.now()) {
            this.currAnimTime = 0
            return this.number
        }

        switch (this.animMode) {
            case "sin": return this.lastNumber + ((1 - ((Math.cos(Math.PI * (Date.now() - this.lastNumberUpdate) / this.currAnimTime) + 1) / 2)) * (this.number - this.lastNumber))
            case "sin_out": return this.lastNumber + ((((Math.sin(0.5 * Math.PI * (Date.now() - this.lastNumberUpdate) / this.currAnimTime)))) * (this.number - this.lastNumber))
            case "linea": return this.lastNumber + ((Date.now() - this.lastNumberUpdate) / this.currAnimTime) * (this.number - this.lastNumber)
        }
    }

    isAnimating() {
        return !(this.currAnimTime === 0 || this.lastNumberUpdate + this.currAnimTime < Date.now())
    }
}

/**
 * Extension of Position which only allows arrayX and arrayY to be integer values
 */


class Position {
    constructor(worldX, worldY, dungeonMap) {
        this.worldXRaw = new SoopyNumber(worldX) // Using the number wrapper so theres easy support for animations
        this.worldYRaw = new SoopyNumber(worldY) // See usage in MapPlayer.js

        this.dungeonMap = dungeonMap
    }

    equals(otherPosition) {
        return this.worldX === otherPosition.worldX && this.worldY === otherPosition.worldY
    }

    get worldX() {
        return this.worldXRaw.get()
    }
    get worldY() {
        return this.worldYRaw.get()
    }

    set worldX(val) {
        this.worldXRaw.set(val, 0)
    }
    set worldY(val) {
        this.worldYRaw.set(val, 0)
    }

    get mapX() {
        if (!this.dungeonMap.dungeonTopLeft) return 0
        return MathLib.map(this.worldX, -200, -8, this.dungeonMap.dungeonTopLeft[0], this.dungeonMap.dungeonTopLeft[0] + this.dungeonMap.fullRoomScaleMap * 6)
    }
    get mapY() {
        if (!this.dungeonMap.dungeonTopLeft) return 0
        return MathLib.map(this.worldY, -200, -8, this.dungeonMap.dungeonTopLeft[1], this.dungeonMap.dungeonTopLeft[1] + this.dungeonMap.fullRoomScaleMap * 6)
    }
    get arrayX() {
        return Math.round((this.worldX + 200) / 32 * 2) / 2
    }
    get arrayY() {
        return Math.round((this.worldY + 200) / 32 * 2) / 2
    }

    get arrayStr() {
        return `${this.arrayX},${this.arrayY}`
    }

    set mapX(val) {
        if (!this.dungeonMap.dungeonTopLeft) return 0
        this.worldX = MathLib.map(val, this.dungeonMap.dungeonTopLeft[0], this.dungeonMap.dungeonTopLeft[0] + this.dungeonMap.fullRoomScaleMap * 6, -200, -8)
    }
    set mapY(val) {
        if (!this.dungeonMap.dungeonTopLeft) return 0
        this.worldY = MathLib.map(val, this.dungeonMap.dungeonTopLeft[1], this.dungeonMap.dungeonTopLeft[1] + this.dungeonMap.fullRoomScaleMap * 6, -200, -8)
    }

    get renderX() {
        if (!this.dungeonMap.dungeonTopLeft) return 0
        return MathLib.map(this.worldX, -200, -8, 0, 1)
    }
    get renderY() {
        if (!this.dungeonMap.dungeonTopLeft) return 0
        return MathLib.map(this.worldY, -200, -8, 0, 1)
    }
    
    get posIndex() {
        // 200 + 0.5 to make transition between rooms smoother
        // 32 is the size of each room including the door
        const arrX = Math.floor((this.worldX + 200.5) / 32)
        const arrY = Math.floor((this.worldY + 200.5) / 32)
        
        return arrX + arrY * 6
    }

    toString() {
        return `Position[${this.arrayX}, ${this.arrayY}]`
    }
}

export { Position }



export default class RoomComponent extends Position {
    constructor(worldX, worldY, dungeonMap) {
        this.worldXRaw = new SoopyNumber(worldX) // Using the number wrapper so theres easy support for animations
        this.worldYRaw = new SoopyNumber(worldY) // See usage in MapPlayer.js

        this.dungeonMap = dungeonMap
    }

    static fromArrayPos(x, y) {
        return new RoomComponent(-185 + x * 32, -185 + y * 32)
    }

    get arrayX() {
        return Math.floor((this.worldX + 185) / 32)
    }
    get arrayY() {
        return Math.floor((this.worldY + 185) / 32)
    }

    toString() {
        return `(${this.arrayX},${this.arrayY})`
    }
}