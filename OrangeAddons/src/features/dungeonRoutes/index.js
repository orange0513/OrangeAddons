import settings from "../../../settings";
import RenderLibV2 from "RenderLibV2";
import global from "../../comms/internal";
export default loadRoutes;
const Color = Java.type("java.awt.Color");

let display = global.config.display.dungeonRoutes;
let editingRoute = false;
let editingBlock = null;
let editingRoom = null;
let inSertingAt = null;
let editingId = null;
function uploadRooms() {
    const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
    if (!cRoom) return ChatLib.chat(`&c&lNo room selected`);
    global.socket.send({type: 'command-v2', payload: {command: 'uploadrooms', payload: {
        name: cRoom.name,
        routes: routes
    }}});
}
function editBlock(block) {
    const ogRelitiveCoords = cRoom.getRoomCoord([block.x, block.y, block.z]);
    let relitiveCoords = cRoom.getRoomCoord([block.x, block.y, block.z]);
    const existingTrack = cRoom.routes.find(t => t.x === relitiveCoords[0] && t.y === relitiveCoords[1] && t.z === relitiveCoords[2]);

    function callBack(data) {
        if (data.ping) {
            console.log('pinged');
            editingBlock = block;
            editingRoom = cRoom;
            editingId = existingTrack ? cRoom.routes.indexOf(existingTrack) : null;
        } else if (data.editCoords) {
            relitiveCoords = data.coords;
            const coords = cRoom.getRealCoord([relitiveCoords[0], relitiveCoords[1], relitiveCoords[2]]);
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
                    console.log('deleting route');
                    const tracks = routes.find(r => r.name === editingRoom.name).tracks;
                    const track = tracks.find(t => t.x === ogRelitiveCoords[0] && t.y === ogRelitiveCoords[1] && t.z === ogRelitiveCoords[2]);
                    console.log(tracks.indexOf(track));
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
    const room = routes.find(r => r.name === cRoom.name);
    if (!room) return ChatLib.chat(`&c&lNo room selected`);
    cRoom.routes = room.tracks;
    ChatLib.chat(`&2&lReloaded room ${cRoom.name}`);
}
function loadRoutes() {
    register("command", (...args) => {
        editingRoute = !editingRoute;
        if (args?.[0]?.toLowerCase() === 'edit' && editingRoute) {
            const num = parseInt(args[1]);
            if (isNaN(num)) return ChatLib.chat('&c&lInvalid number');
            const room = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json")).find(r => r.name === cRoom.name);
            if (!room) return ChatLib.chat('&c&lNo room selected');

            if (!room.tracks?.[num-1]) return ChatLib.chat('&c&lInvalid number: '+ num);
            editingId = num - 1;
            const realCoords = cRoom.getRealCoord([room.tracks[num-1].x, room.tracks[num-1].y, room.tracks[num-1].z]);
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
        const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
        if (!cRoom) return ChatLib.chat(`&c&lNo room selected`);
        global.socket.send({type: 'command-v2', payload: {command: 'uploadroom', payload: {
            name: cRoom.name,
            routes: routes.find(r => r.name === cRoom.name)?.tracks
        }}});
    }).setName("uploadroom");

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
                    
                    const coords = cRoom.getRealCoord([t.x, t.y, t.z]);
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

        if (settings.dungeon_routes && global.currentDungeonMap && getNeededHighlightData.data.room && !editingRoute) {
            highlightBlock(getNeededHighlightData.data.x, getNeededHighlightData.data.y, getNeededHighlightData.data.z, true, Color.GREEN, getNeededHighlightData.data.realNote);
            if (getNeededHighlightData.next2[0]) {
                highlightBlock(getNeededHighlightData.next2[0].x, getNeededHighlightData.next2[0].y, getNeededHighlightData.next2[0].z, settings.line_to_yellow ?
                     [getNeededHighlightData.data.x, getNeededHighlightData.data.y, getNeededHighlightData.data.z] : false, Color.yellow, getNeededHighlightData.next2[0].note);
            }
            if (getNeededHighlightData.next2[1]) {
                highlightBlock(getNeededHighlightData.next2[1].x, getNeededHighlightData.next2[1].y, getNeededHighlightData.next2[1].z, settings.line_to_red ?
                    [getNeededHighlightData.next2[0].x, getNeededHighlightData.next2[0].y, getNeededHighlightData.next2[0].z]: false, Color.red,
                    getNeededHighlightData.next2[1].note
                );
            }
        };

        if (settings.dungeon_routes && global.currentDungeonMap && getNeededHighlightData.data.room && getNeededHighlightData.data.trigger === 'air') {
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
        if (settings.dungeon_routes && global.currentDungeonMap && getNeededHighlightData.data.room && getNeededHighlightData.data.trigger === 'near') {

            if (isNear(getNeededHighlightData.data.x, getNeededHighlightData.data.y, getNeededHighlightData.data.z, getNeededHighlightData.data.near, true)) {
                completeTrack(getNeededHighlightData.data.room, trackId);
            }

        }
    }).setFps(10);

    register("HitBlock", (block) => {

        try {

            if (editingRoute && global.currentDungeonMap && cRoom && !editingBlock) {
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


            if (global.currentDungeonMap)
                console.log(cRoom?.getRoomCoord([block.x, block.y, block.z]));
            
            if (settings.dungeon_routes && global.currentDungeonMap && getNeededHighlightData.data.room) {
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
            if (editingRoute && global.currentDungeonMap && cRoom) {
                const relitiveCoords = cRoom.getRoomCoord([x, y, z]);
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
            if (settings.dungeon_routes && global.currentDungeonMap && getNeededHighlightData.data.room) {
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
        if (settings.dungeon_routes && global.currentDungeonMap && getNeededHighlightData.data.room) {
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


let cRoom = null;
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
let showed = false;
function getNeededHighlight(bypass) {
    if (getNeededHighlightData.last > Date.now() - 250 && !bypass) return;
    getNeededHighlightData.last = Date.now();
    const cDungeonMap = global.currentDungeonMap;

    if (!cDungeonMap) return;


    const currentRoom = cDungeonMap.getCurrentRoom();
    cRoom = currentRoom;
    // || currentRoom._checkmarkState === 4 // add in release
    if (!currentRoom || currentRoom._checkmarkState === 4) {
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
            //Client.showTitle("&cNO FUCKING ROUTES", "", 0, 40, 10)
        }
    } else
        showed = false;
    const firstIncompleteTrack = currentRoom.routes.find(r => !r.completed);
    if (!firstIncompleteTrack) {
        getNeededHighlightData.data.room = null;
        return;
    }

    const next3Tracks = currentRoom.routes.filter(r => !r.completed).slice(0, 4).filter(r => r !== firstIncompleteTrack);
    getNeededHighlightData.data.note = [firstIncompleteTrack.note, ...next3Tracks.map(t => t.note)].join('\n');
    getNeededHighlightData.data.room = currentRoom;
    getNeededHighlightData.data.trigger = firstIncompleteTrack.trigger;
    getNeededHighlightData.data.realNote = firstIncompleteTrack.note;
    if (firstIncompleteTrack.trigger === 'near')
        getNeededHighlightData.data.near = firstIncompleteTrack.near;

    const coords = currentRoom.getRealCoord([firstIncompleteTrack.x, firstIncompleteTrack.y, firstIncompleteTrack.z]);
    getNeededHighlightData.data.x = coords?.[0];
    getNeededHighlightData.data.y = coords?.[1];
    getNeededHighlightData.data.z = coords?.[2];
    getNeededHighlightData.data.color = firstIncompleteTrack.color;
    trackId = currentRoom.routes.indexOf(firstIncompleteTrack);

    const next2 = next3Tracks.slice(0, 2);
    getNeededHighlightData.next2 = next2.map(t => {
        const coords = currentRoom.getRealCoord([t.x, t.y, t.z]);
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
            room = global.currentDungeonMap.roomsArr.find(r => r.name === room);
        }
        console.log('completed track: ' + trackId + ' in room: ' + room?.name);
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
    const renderColor = color;
    const transparentLine = settings.transparency_on_line / 1000;
    const transparentBlock = settings.transparency_on_block / 1000;
    const transparentText = settings.transparency_on_text / 1000;
    const alphaInt = Math.floor(transparentText * 255);
    if (typeof line === 'object') {
        RenderLibV2.drawLine((0.5 + line[0]), (0.5 + line[1]), (0.5 + line[2]), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue,  transparentLine, true, 3)

    }   else if (line)
            if (Player.isSneaking())
                RenderLibV2.drawLine(Player.getRenderX(), Player.getRenderY() + 1.54, Player.getRenderZ(), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue, transparentLine, true, 3)
            else
                RenderLibV2.drawLine(Player.getRenderX(), Player.getRenderY() + 1.62, Player.getRenderZ(), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue, transparentLine, true, 3)

    if (text && settings.route_text) {





        
        const r = isNear(x, y, z, 0, false);



        let size = r < 6 ? 0.0375 : 0.007 * r;

        let bypass = false;
        

        if (color === Color.GREEN) {


            size = r < 6 ? 0.0375 : 0.007 * r;

            if (size > 0.16888)
                size = 0.16888;

            //console.log(size);
            bypass = true;
        }
        const intColor = (alphaInt << 24) | (renderColor.red << 16) | (renderColor.green << 8) | renderColor.blue;

        // Use intColor in Tessellator.drawString
        if (r < 20 || bypass) {
            const lines = text.replace(/&./g, "").split('\n').reverse();
            lines.forEach((line, index) => {
                Tessellator.drawString(line, center.cx, center.cy + center.h + 0.5 + (index * size * 10), center.cz, intColor, true, size, false);
            });
        }
    }

    if (!settings.render_full_block) {


        RenderLibV2.drawEspBoxV2(
            center.cx, center.cy, center.cz,
            center.wx, center.h, center.wz,
            renderColor.red, renderColor.green, renderColor.blue, transparentBlock,
            true, 1
        );
    } else {

        RenderLibV2.drawInnerEspBoxV2(
            center.cx, center.cy, center.cz,
            center.wx, center.h, center.wz,
            renderColor.red, renderColor.green, renderColor.blue, transparentBlock,
            true, 1 
        );
    }
}

function getBlockAtCoords(x, y, z) {
    return World.getBlockAt(x, y, z);
}

export { completeTrack };