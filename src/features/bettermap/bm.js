// cherry picked together from bm index file

import DungeonMap from "./DungeonMap"
import DataLoader from "./DataLoader"
import global from '../../comms/internal'
import settings from '../../../index'

let currentDungeonMap = undefined
let deadPlayers = new Set()

export default currentDungeonMap

register("step", () => {
    if (!settings.secrets_per_run && !settings.dungeon_routes) return;
    global.currentDungeonMap = currentDungeonMap;
    if (DataLoader.isInDungeon && DataLoader.dungeonFloor || currentDungeonMap?.getCurrentRoomId() === "30,225") {
        if (!currentDungeonMap) { // Entered dungeon, create map data
            currentDungeonMap = new DungeonMap(DataLoader.dungeonFloor, deadPlayers)

        }
    } else {
        if (currentDungeonMap) { // Left dungeon, clear map data
            currentDungeonMap.destroy();
            currentDungeonMap = undefined
        }
    }

    if (!currentDungeonMap) return;

    if (Player.getX() < 0 && Player.getZ() < 0) { // Ensuring they are not in boss room
        
        let mapData = null

        try {
            let item = Player.getInventory().getStackInSlot(8)
            // getMapData
            mapData = item.getItem().func_77873_a(item.getItemStack(), World.getWorld())
            if (mapData && !currentDungeonMap.mapId) {
                currentDungeonMap.mapId = item.getMetadata()
            }
        } catch (error) {
            try {
                if (currentDungeonMap.mapId) {
                    // loadItemData
                    mapData = World.getWorld().func_72943_a(MapData.class, "map_" + currentDungeonMap.mapId)
                }
            } catch (error) {
            }
        }

        if (mapData) {
            currentDungeonMap.updateFromMap(mapData)
        } else {
            
        }
    }

    //currentDungeonMap.updatePuzzles();
}).setFps(5);
register("step", () => {
    if (!settings.secrets_per_run) return;

    if (!currentDungeonMap)
        return;
    currentDungeonMap.updatePlayers()
}).setFps(1)
register("worldLoad", () => {
    if (!settings.secrets_per_run) return;
    if (currentDungeonMap) {
        currentDungeonMap.destroy()
        currentDungeonMap = null
    }
    deadPlayers.clear()
})
register("packetReceived", (packet) => {
    if (!settings.secrets_per_run) return;
    if (currentDungeonMap && !currentDungeonMap.mapId) {
        // getMapId
        currentDungeonMap.mapId = packet.func_149188_c()
    }
}).setFilteredClass(net.minecraft.network.play.server.S34PacketMaps)

register("chat", (info) => {
    if (!settings.secrets_per_run) return;
    let player = ChatLib.removeFormatting(info.split(" ")[0])

    if (player === "you") {
        player = Player.getName().toLowerCase()
    }

    deadPlayers.add(player.toLowerCase())
}).setChatCriteria("&r&c ☠ ${info} and became a ghost&r&7.&r")

register("chat", (info) => {
    if (!settings.secrets_per_run) return;
    let player = ChatLib.removeFormatting(info.split(" ")[0])

    if (player === "you") {
        player = Player.getName().toLowerCase()
    }

    deadPlayers.delete(player.toLowerCase())
}).setChatCriteria("&r&a ❣ &r${info} was revived${*}!&r")