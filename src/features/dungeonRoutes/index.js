/// <reference types="../../../../CTAutocomplete" />
import { settingsObj, settings } from "../../../index";
import RenderLibV2 from "RenderLibV2";
import global from "../../comms/internal";
import DungeonScanner from "../../../../tska/skyblock/dungeon/DungeonScanner";
export default loadRoutes;
const Color = Java.type("java.awt.Color");

// {name: string, room: roomFromDungeonScanner}
let knownRooms = [];
let doRoomWhenOpening = [];
let cRoom = null;
let runOpen = false;
let trackId = null;
export function syncRoom(roomName, skipTo) {
    const room = knownRooms.find(r => r.name === roomName);
    if (!room) {
        console.log(`Room ${roomName} not found`);
        if (!doRoomWhenOpening.find(r => r.roomName === roomName)) {
            console.log(`Adding ${roomName} to doRoomWhenOpening`);
            doRoomWhenOpening.push({
                roomName: roomName,
                skipTo: skipTo
            })
        } else {
            console.log(`Room ${roomName} already in doRoomWhenOpening`);
            doRoomWhenOpening.find(r => r.roomName === roomName).skipTo = skipTo;
        }
        return;
    };
    console.log(`Syncing room ${roomName} to ${skipTo}`);
    room.room.routes.forEach(r => {
        const i = room.room.routes.indexOf(r);
        if (i < skipTo
    ) {
            r.completed = true;
        }
    });

}
function getRoomCoord(coords) {
    const roomResponse = cRoom.getRoomCoord(coords);
    if (roomResponse)
        roomResponse[1] = coords[1];
    return roomResponse;
}
function getRealCoord(coords) {
    const roomResponse = cRoom.getRealCoord(coords);
    if (roomResponse)
        roomResponse[1] = coords[1];
    return roomResponse;
}
function registerRoom(room) {
    if (!room || !room?.name) { // hopefully this also detects when you enter boss??????
        cRoom = null;
        runOpen = false;
        knownRooms = [];
        doRoomWhenOpening = [];
        return;
    }
    const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
    cRoom = room;
    runOpen = true;
    if (!knownRooms.find(r => r.name === room.name)) {
        
        knownRooms.push({name: room.name, room: room});
        knownRooms.find(r => r.name === room.name).room.routes = 
            routes.find(r => r.name === room.name)?.tracks
         || [];
        cRoom = knownRooms.find(r => r.name === room.name).room;

        if (doRoomWhenOpening.length > 0 && doRoomWhenOpening.find(r => r.roomName === room.name)) {
            syncRoom(doRoomWhenOpening.find(r => r.roomName === room.name).roomName, doRoomWhenOpening.find(r => r.roomName === room.name).skipTo);
            doRoomWhenOpening = doRoomWhenOpening.filter(r => r.roomName !== room.name);
        }
    }
}
DungeonScanner.onRoomEnter((r) => registerRoom(r));
DungeonScanner.onRoomLeave((r) => registerRoom(r));

register('worldLoad', () => {   
    cRoom = null;
    knownRooms = [];
    runOpen = false;
    doRoomWhenOpening = [];
});

let getNeededHighlightData = {
    last: 0,
    data: {
        note: null,
        room: null,
        realNote: null,
        trackId: null,
        trigger: 'near', // near or click
        near: 0,
        x: 0,
        y: 0,
        z: 0,
        color: "Yellow"
    },
    next2: [

    ]
}


let display = global.config.display.dungeonRoutes;
let editingRoute = false;
let editingBlock = null;
let editingRoom = null;
let inSertingAt = null;
let editingId = null;
function uploadRooms() {
    const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
    global.socket.send({type: 'command-v2', payload: {command: 'uploadrooms', payload: {
        name: cRoom.name,
        routes: routes,
        editing: settings.editing_route,
    }}});
}
function editBlock(block) {
    const ogRelitiveCoords = getRoomCoord([block.x, block.y, block.z]);
    let relitiveCoords = getRoomCoord([block.x, block.y, block.z]);
    const existingTrack = cRoom.routes.find(t => t.x === relitiveCoords[0] && t.y === relitiveCoords[1] && t.z === relitiveCoords[2]);

    function callBack(data) {
        if (data.ping) {
            editingBlock = block;
            editingRoom = cRoom;
            editingId = existingTrack ? cRoom.routes.indexOf(existingTrack) : null;
        } else if (data.editCoords) {
            relitiveCoords = data.coords;
            const coords = getRealCoord([relitiveCoords[0], relitiveCoords[1], relitiveCoords[2]]);
            const block = getBlockAtCoords(coords[0], coords[1], coords[2]);
            editingBlock = block;
        }
        else if (data.finalize) {
            if (data.cancel) {
                editingBlock = null;
                editingRoom = null;
                editingRoute = false;
                editingId = null;
                reloadroom();
                return;
            };

            const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
            if (!existingTrack) {

                if (data.deleteRoute) {
                    editingBlock = null;
                    editingRoute = false;
                    reloadroom();
                    return;
                }

                const tracks = routes.find(r => r?.name === editingRoom?.name)?.tracks;
                if (inSertingAt) {
                    tracks.splice(inSertingAt - 1, 0, {
                        x: relitiveCoords[0],
                        y: relitiveCoords[1],
                        z: relitiveCoords[2],
                        note: data.note,
                        trigger: data.trigger,
                        near: data.near,
                    });
                    inSertingAt = null;
                } else
                tracks.push({
                    x: relitiveCoords[0],
                    y: relitiveCoords[1],
                    z: relitiveCoords[2],
                    note: data.note,
                    trigger: data.trigger,
                    near: data.near,
                });
                routes.find(r => r.name === editingRoom.name).lastEdit = Date.now();
                FileLib.write("OrangeAddons", "/src/features/dungeonRoutes/rooms.json", JSON.stringify(routes, null, 4));
                try {
                    uploadRooms();
                } catch (e) {   
                }
                editingBlock = null;
                editingRoute = false;
                cRoom.routes = tracks;
                reloadroom();
                editingId = null;
            } else {
                if (data.deleteRoute) {
                    try {
                        const tracks = routes.find(r => r.name === editingRoom.name).tracks;
                        const track = tracks.find(t => t.x === ogRelitiveCoords[0] && t.y === ogRelitiveCoords[1] && t.z === ogRelitiveCoords[2]);
                        tracks.splice(tracks.indexOf(track), 1);
                        routes.find(r => r.name === editingRoom.name).lastEdit = Date.now();
                        FileLib.write("OrangeAddons", "/src/features/dungeonRoutes/rooms.json", JSON.stringify(routes, null, 4));
                        try {
                            uploadRooms();
                        } catch (e) {   
                        }
                        editingBlock = null;
                        editingRoute = false;
                        editingId = null;
                        cRoom.routes = tracks;
                        reloadroom();
                        return;
                    } catch (e) {
                        console.error(e);
                        return;
                    }
                }
                const tracks = routes.find(r => r.name === editingRoom.name).tracks;
                const track = tracks.find(t => t.x === ogRelitiveCoords[0] && t.y === ogRelitiveCoords[1] && t.z === ogRelitiveCoords[2]);
                track.x = relitiveCoords[0];
                track.y = relitiveCoords[1];
                track.z = relitiveCoords[2];
                track.note = data.note;
                track.trigger = data.trigger;
                track.near = data.near;
                routes.find(r => r.name === editingRoom.name).lastEdit = Date.now();
                FileLib.write("OrangeAddons", "/src/features/dungeonRoutes/rooms.json", JSON.stringify(routes, null, 4));
                try {
                    uploadRooms();
                } catch (e) {   
                }
                editingBlock = null;
                editingRoute = false;
                editingId = null;
                reloadroom();
            }

        }
    }

    let response = {
        type: 'command-v2',
        payload: {command: 'editroute', payload: {
            coords: relitiveCoords,
            room: cRoom.name,
            currentBlock: existingTrack || null,
        }}
    }

    global.socket.send(response, callBack);
    
}

function reloadroom() {
    const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
    const room = routes.find(r => r?.name === cRoom?.name);
    if (!room) return;
    cRoom.routes = room.tracks;
    //ChatLib.chat(`&2&lReloaded room ${cRoom.name}`);
}
function reloadRoutes() {
    if (!runOpen)
        return;

    const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));

    knownRooms.forEach(room => {
        const roomData = routes.find(r => r.name === room.name);
        if (roomData)
            room.routes = roomData.tracks;
    }
    );
}

export { reloadRoutes };
function loadRoutes() {
    register("command", () => {
        ChatLib.chat('&2&lCurrent Known Rooms:');
        knownRooms.forEach(room => {
            ChatLib.chat(`&2&l${room.name} (${room.room.routes.filter(r => r.completed).length}/${room.room.routes.length} Tracks Completed)`);
        });
        doRoomWhenOpening.forEach(room => {
            ChatLib.chat(`&2&l${room.roomName} (SYNC) (${room.skipTo})`);
        });
    }).setName('getrooms');
    register("command", () => {
        knownRooms = [];
        doRoomWhenOpening = [];
        cRoom = null;
        ChatLib.chat('&2&lCleared known rooms');
    }).setName("clearrooms");
    register("command", (...args) => {

        if (!settings.route_developer_mode)
            return ChatLib.chat('&6&lOA - You must enable Route Developer Mode in settings to use this command');

        editingRoute = !editingRoute;
        if (args?.[0]?.toLowerCase() === 'edit' && editingRoute) {
            const num = parseInt(args[1]);
            if (isNaN(num)) return ChatLib.chat('&c&lInvalid number');
            const room = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json")).find(r => r.name === cRoom.name);
            if (!room) return ChatLib.chat('&c&lNo room selected');

            if (!room.tracks?.[num-1]) return ChatLib.chat('&c&lInvalid number: '+ num);
            editingId = num - 1;
            const realCoords = getRealCoord([room.tracks[num-1].x, room.tracks[num-1].y, room.tracks[num-1].z]);
            const block = getBlockAtCoords(
                realCoords[0],
                realCoords[1],
                realCoords[2]
            );
            editBlock(block);

            
            return;

        }
        if (args?.[0]?.toLowerCase() === 'insert' && editingRoute) {
            let num =parseInt(args[1]);

            if (args[1].toLowerCase() === 'here') {
                num = trackId + 1;
            }

            if (isNaN(num)) return ChatLib.chat('&c&lInvalid number');
            inSertingAt = num;
            ChatLib.chat(`&2&lInserting at position ${num}`);
        }
        if (!editingRoute) {
            editingBlock = null;
            editingRoom = null;
        } 
        if (editingRoute) {
            ChatLib.chat(`&2&lYou\'re now editing routes, punch a block to add a route.`);
        } else
            ChatLib.chat(`&2&lYou\'re no longer editing routes`);
    }).setName("editroute");

    register("command", () => {
        const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
        const room = routes.find(r => r.name === cRoom.name);
        if (!room) return ChatLib.chat(`&c&lNo room selected`);
        ChatLib.chat(`&2&lRoutes for ${cRoom.name}:`);
        for (let i = 0; i < room.tracks.length; i++) {
            let track = room.tracks[i];
            ChatLib.chat(`&2&l${i + 1}: ${track.note}`);
        }
    }).setName("showroute");

    register("command", () => {
        uploadRooms();
    }).setName("uploadrooms")

    register("command", () => {
        if (trackId || trackId === 0)
        completeTrack(getNeededHighlightData.data.room, trackId);
        else ChatLib.chat(`&c&lError: no trackId`);
        ChatLib.chat(`&2&lCompleted track`);
    }).setName("skip");

    register("command", () => {
        const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
        const roomsWithoutRoutes = routes.filter(r => r.tracks.length === 0);


        const finishedCount = Object.keys(routes).length - Object.keys(roomsWithoutRoutes).length;
        ChatLib.chat(`&2&lRooms without routes (${finishedCount}/${Object.keys(routes).length} Finished) (${Math.round(finishedCount/Object.keys(routes).length * 100)}%):`);
        roomsWithoutRoutes.forEach(r => {
            ChatLib.chat(`&2&l${r.name}`);
        });
    }).setName("rooms");

    register("command", () => {
        reloadroom();

    }).setName("reloadroom");


    register("renderWorld", (partialTicks) => {
        if (editingBlock) {
            highlightBlock(editingBlock?.x, editingBlock?.y, editingBlock?.z, true, Color.magenta);
        }
        try {
            if (editingRoute) {
                const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
                const tracks = routes.find(r => r.name === cRoom?.name)?.tracks;
                if (tracks)
                tracks.forEach(t => {
                    
                    const coords = getRealCoord([t.x, t.y, t.z]);
                    if (editingId !== tracks.indexOf(t) && coords) 
                    highlightBlock(coords[0], coords[1], coords[2], false, Color.cyan, `Note: ${t.note}\nTrigger: ${t.trigger}` + (t.trigger === 'near' ? `\nNear: ${t.near}` : '') + `\nNumber: ${tracks.indexOf(t) + 1}`);
                });
            }
        } catch (e) {
            console.error(e);
        }

        if (getNeededHighlightData.data.room &&
            getNeededHighlightData.data.room.maxSecrets <=
            getNeededHighlightData.data.room.currentSecrets) {
                return;
        }

        if (settings.dungeon_routes && runOpen && getNeededHighlightData.data.room && !editingRoute) {
            highlightBlock(getNeededHighlightData.data.x, getNeededHighlightData.data.y, getNeededHighlightData.data.z, true, settings.change_current_route_color, getNeededHighlightData.data.realNote);
            if (getNeededHighlightData.next2[0]) {
                highlightBlock(getNeededHighlightData.next2[0].x, getNeededHighlightData.next2[0].y, getNeededHighlightData.next2[0].z, settings.line_to_yellow ?
                     [getNeededHighlightData.data.x, getNeededHighlightData.data.y, getNeededHighlightData.data.z] : false, settings.change_next_route_color, getNeededHighlightData.next2[0].note);
            }
            if (getNeededHighlightData.next2[1]) {
                highlightBlock(getNeededHighlightData.next2[1].x, getNeededHighlightData.next2[1].y, getNeededHighlightData.next2[1].z, settings.line_to_red ?
                    [getNeededHighlightData.next2[0].x, getNeededHighlightData.next2[0].y, getNeededHighlightData.next2[0].z]: false, settings.change_3rd_route_color,
                    getNeededHighlightData.next2[1].note
                );
            }
        };

        if (settings.dungeon_routes && runOpen && getNeededHighlightData.data.room && getNeededHighlightData.data.trigger === 'air') {
            try {
                if (World && World?.getBlockAt(
                    getNeededHighlightData.data.x,
                    getNeededHighlightData.data.y,
                    getNeededHighlightData.data.z
                ).type.getID() === 0) {
                    completeTrack(getNeededHighlightData.data.room, trackId);
                }
            } catch (e) {
            }
        }
    });
    register("step", () => {
        getNeededHighlight();
        if (settings.dungeon_routes && runOpen && getNeededHighlightData.data.room && getNeededHighlightData.data.trigger === 'near') {

            if (isNear(getNeededHighlightData.data.x, getNeededHighlightData.data.y, getNeededHighlightData.data.z, getNeededHighlightData.data.near, true)) {
                completeTrack(getNeededHighlightData.data.room, trackId);
            }

        }
    }).setFps(10);

    register("HitBlock", (block) => {

        try {

            if (editingRoute && runOpen && cRoom && !editingBlock) {
                editBlock(block);
            }
            // if (editingRoute && global.currentDungeonMap && cRoom && !editingBlock) {
            //     const relitiveCoords = cRoom.getRoomCoord([block.x, block.y, block.z]);
            //     ChatLib.chat(`&2&lEditing block at ${relitiveCoords.join(', ')}`);
            //     function callBack(data) {
            //         if (data.ping) {
            //             console.log('pinged');
            //             editingBlock = block;
            //             editingRoom = cRoom;
            //         } else if (data.finalize) {
            //             const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
            //             const tracks = routes.find(r => r.name === editingRoom.name).tracks;
            //             if (inSertingAt) {
            //                 tracks.splice(inSertingAt - 1, 0, {
            //                     x: relitiveCoords[0],
            //                     y: relitiveCoords[1],
            //                     z: relitiveCoords[2],
            //                     note: data.note,
            //                     trigger: data.trigger,
            //                     near: data.near,
            //                 });
            //                 inSertingAt = null;
            //             } else
            //             tracks.push({
            //                 x: relitiveCoords[0],
            //                 y: relitiveCoords[1],
            //                 z: relitiveCoords[2],
            //                 note: data.note,
            //                 trigger: data.trigger,
            //                 near: data.near,
            //             });
            //             routes.find(r => r.name === editingRoom.name).lastEdit = Date.now();
            //             FileLib.write("OrangeAddons", "/src/features/dungeonRoutes/rooms.json", JSON.stringify(routes, null, 4));
            //             try {
            //                 uploadRooms();
            //             } catch (e) {   
            //             }
            //             editingBlock = null;
            //             editingRoute = false;
            //             ChatLib.chat(`&2&lRoute added to ${editingRoom.name}`);
            //             cRoom.routes = tracks;
            //         }
            //     }

            //     let response = {
            //         type: 'command-v2',
            //         payload: {command: 'editroute', payload: relitiveCoords.join('')}
            //     }
            //     global.socket.send(response, callBack);
            // }


            if (!runOpen) return;
            
            if (settings.dungeon_routes && getNeededHighlightData.data.room) {
                if (
                    (
                        getNeededHighlightData.data.trigger === 'click' ||
                        getNeededHighlightData.data.trigger === 'air'

                    ) &&
                    block.x === getNeededHighlightData.data.x &&
                    block.y === getNeededHighlightData.data.y &&
                    block.z === getNeededHighlightData.data.z
                )
                    completeTrack(getNeededHighlightData.data.room, trackId);
            }
        } catch (e) {
            console.error(e);
        }
    });

    register("playerInteract", (action, {x, y, z}) => {
        const actionString = action.toString();
        if (actionString === 'RIGHT_CLICK_BLOCK' || actionString === 'LEFT_CLICK_BLOCK') {
            if (editingRoute && runOpen && cRoom) {
                const relitiveCoords = getRoomCoord([x, y, z]);
                const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
                const tracks = routes.find(r => r.name === cRoom.name).tracks;
                const track = tracks.find(t => t.x === relitiveCoords[0] && t.y === relitiveCoords[1] && t.z === relitiveCoords[2]);
                if (track) {
                    if (actionString === 'RIGHT_CLICK_BLOCK') {
                        const block = getBlockAtCoords(x, y, z);
                        editBlock(block);
                    }
                }
            }
            if (settings.dungeon_routes && runOpen && getNeededHighlightData.data.room) {
                if (
                    (
                        getNeededHighlightData.data.trigger === 'click' ||
                        getNeededHighlightData.data.trigger === 'air'
    
                    ) &&
                    x === getNeededHighlightData.data.x &&
                    y === getNeededHighlightData.data.y &&
                    z === getNeededHighlightData.data.z
                )
                    completeTrack(getNeededHighlightData.data.room, trackId);
            }
        }
    });

    register("renderOverlay", () => {
        if (!settings.note_gui) return;
        if (global.editingUI && Client.isInChat()) {
            Renderer.drawString(`&2&lEditing route notes GUI`, display.x, display.y);
        }
        if (settings.dungeon_routes && runOpen && getNeededHighlightData.data.room) {
            Renderer.drawString(getNeededHighlightData.data.note, display.x, display.y);
        }
    });

    register("dragged", (dx, dy, x, y) => {
        if (global.editingUI && Client.isInChat()) {
            display.x = x;
            display.y = y;
        }
    });
}


function isNear(x, y, z, range, returnBool = true) {
    const r = Math.sqrt(Math.pow(Player.getX() - x, 2) + Math.pow(Player.getY() - y, 2) + Math.pow(Player.getZ() - z, 2));


    if (returnBool)
        return r <= range;
    return r;
}


let showed = false;
function getNeededHighlight(bypass) {
    if (getNeededHighlightData.last > Date.now() - 250 && !bypass) return;
    registerRoom(DungeonScanner.getCurrentRoom());
    getNeededHighlightData.last = Date.now();

    if (!runOpen) return;
    if (!cRoom) return;
    const currentRoom = cRoom;
    if (!currentRoom || (currentRoom.checkmark === 2 && !settings.route_developer_mode)) {
        getNeededHighlightData.data.room = null;
        return;
    }
    if (!currentRoom.routes) {
        getNeededHighlightData.data.room = null;
        return;
    }
    if (currentRoom.routes.length === 0 ) {
        if (!showed) {
            showed = true;
            if (settings.route_developer_mode)
                Client.showTitle("&cNo Routes in this room!", "", 0, 40, 10)
        }
    } else
        showed = false;
    const firstIncompleteTrack = currentRoom.routes.find(r => !r.completed);
    if (!firstIncompleteTrack) {
        getNeededHighlightData.data.room = null;
        return //console.log('returned 3');
    }

    const next3Tracks = currentRoom.routes.filter(r => !r.completed).slice(0, 4).filter(r => r !== firstIncompleteTrack);
    getNeededHighlightData.data.note = [firstIncompleteTrack.note, ...next3Tracks.map(t => t.note)].join('\n');
    getNeededHighlightData.data.room = currentRoom;
    getNeededHighlightData.data.trigger = firstIncompleteTrack.trigger;
    getNeededHighlightData.data.realNote = firstIncompleteTrack.note;
    if (firstIncompleteTrack.trigger === 'near')
        getNeededHighlightData.data.near = firstIncompleteTrack.near;

    const coords = getRealCoord([firstIncompleteTrack.x, firstIncompleteTrack.y, firstIncompleteTrack.z]);
    getNeededHighlightData.data.x = coords?.[0];
    getNeededHighlightData.data.y = coords?.[1];
    getNeededHighlightData.data.z = coords?.[2];
    getNeededHighlightData.data.color = firstIncompleteTrack.color;
    trackId = currentRoom.routes.indexOf(firstIncompleteTrack);

    const next2 = next3Tracks.slice(0, 2);
    getNeededHighlightData.next2 = next2.map(t => {
        const coords = getRealCoord([t.x, t.y, t.z]);
        return {
            x: coords?.[0],
            y: coords?.[1],
            z: coords?.[2],
            note: t.note,
        }
    });

}

function completeTrack(room, trackId, bypass = false) {
    try {
        if (typeof room === 'string') {
            room = knownRooms.find(r => r.name === room);
        }
        room.routes[trackId].completed = true;
        if (settings.route_sharing && !bypass) {
            global.socket.send({sync: true, type: 'broadcastRoute', payload: {id: global.serverId, route: room?.name, data: (trackId + 1)}});
        }
        getNeededHighlight(true);
    } catch (e) {
        console.error(e);
    }
}

function highlightBlock(x, y, z, line, color, text) {
    const center = RenderLibV2.calculateCenter(x, y+1, z, x+1, y, z+1);

    const renderColor = color.getRed ? color : new Color(color[0] / 255, color[1] / 255, color[2] / 255);
    const transparentLine = settings.transparency_on_line / 1000;
    const transparentBlock = settings.transparency_on_block / 1000;
    const transparentText = settings.transparency_on_text / 1000;
    if (typeof line === 'object') {
        RenderLibV2.drawLine((0.5 + line[0]), (0.5 + line[1]), (0.5 + line[2]), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue,  transparentLine, true, 3)

    }   else if (line)
            if (Player.isSneaking())
                RenderLibV2.drawLine(Player.getRenderX(), Player.getRenderY() + 1.54, Player.getRenderZ(), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue, transparentLine, true, 3)
            else
                RenderLibV2.drawLine(Player.getRenderX(), Player.getRenderY() + 1.62, Player.getRenderZ(), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue, transparentLine, true, 3)

    if (text) {





        
        const r = isNear(x, y, z, 0, false);



        let size = r < 6 ? 0.0375 : 0.007 * r;

        let bypass = false;
        

        if (color === settings.change_current_route_color) {


            size = r < 6 ? 0.0375 : 0.007 * r;

            if (size > 0.16888)
                size = 0.16888;

            //console.log(size);
            bypass = true;
        }
        const intColor = (transparentText << 24) | (renderColor.red << 16) | (renderColor.green << 8) | renderColor.blue;
        if (r < 20 || bypass) {
            const lines = text.replace(/&./g, "").split('\n').reverse();
            lines.forEach((line, index) => {
                Tessellator.drawString(line, center.cx, center.cy + center.h + 0.5 + (index * size * 10), center.cz, intColor, true, size, false);
            });
        }
    }


        RenderLibV2.drawInnerEspBoxV2(
            center.cx, center.cy, center.cz,
            center.wx, center.h, center.wz,
            renderColor.red, renderColor.green, renderColor.blue, transparentBlock,
            true, 1 
        );
}

function getBlockAtCoords(x, y, z) {
    return World.getBlockAt(x, y, z);
}

export { completeTrack };