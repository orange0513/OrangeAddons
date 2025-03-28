import RoomComponent from "./RoomComponent.js"
import { SoopyNumber } from "./RoomComponent.js"

class MapPlayer {
    /**
     * @param {NetworkPlayerInfo} networkPlayerInfo
     * @param {DungeonMap} dunegonMap
     */
    constructor(networkPlayerInfo, dungeonMap, username) {
        this.networkPlayerInfo = networkPlayerInfo
        this.dungeonMap = dungeonMap

        this.location = new RoomComponent(0, 0, dungeonMap)
        this.location.worldXRaw.setAnimMode("linea")
        this.location.worldYRaw.setAnimMode("linea")

        /**@type {import("./Room").default} */
        this.currentRoomCache = undefined // To track player enter/exit events

        this.yaw = new SoopyNumber(0)
        this.yaw.setAnimMode("sin_out")
        this._username = username
        this.uuid = undefined

        this.locallyUpdated = 0

        this.deaths = 0

        this.startedRunSecrets = 0
        this.currentSecrets = 0

        this.minRooms = 0
        this.maxRooms = 0
        /**@type {[MapPlayer[], import("./Room").default][]} */
        this.roomsData = []

        this.skyblockLevel = null
        this.dungeonClass = null
        this.classLevel = null

        this.playerColor = [0, 0, 0, 255]
    }

    setX(x) {
        this.location.worldX = x
    }
    setY(y) {
        this.location.worldY = y
    }
    setRotate(yaw) {
        this.yaw.set(yaw, 0)
    }
    setXAnimate(x, time = 1000) {
        this.location.worldXRaw.set(x, time)
    }
    setYAnimate(y, time = 1000) {
        this.location.worldYRaw.set(y, time)
    }
    setRotateAnimate(yaw, time = 1000) {
        let dist = yaw - this.yaw.get()
        if (dist > 180) this.yaw.set(this.yaw.get() + 360, 0)
        if (dist < -180) this.yaw.set(this.yaw.get() - 360, 0)

        this.yaw.set(yaw, time)
    }
    updateTablistInfo(matchObject) {
        let [_, sbLevel, name, clazz, level] = matchObject
        this.skyblockLevel = parseInt(sbLevel)
        this.username = name
        if (["EMPTY", "DEAD"].includes(clazz)) return
        this.dungeonClass = clazz
        this.classLevel = parseInt(level)
    }

    getRoom() {
        return this.dungeonMap.getRoomAt(this.location.worldX, this.location.worldY)
    }

}

export default MapPlayer
