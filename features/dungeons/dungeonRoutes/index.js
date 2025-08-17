import DungeonScanner from '../../../../tska/skyblock/dungeon/DungeonScanner.js';
import RenderLibV2 from "RenderLibV2";
const Color = Java.type("java.awt.Color");

export default class dungeonRoutes {
    /**
     * @param {import('../../../index.js').default} main
     */
    constructor(main) {
        this.main = main;
        this.showed = false;
        this.main.dungeonRoutes = this;
        this.currentRoom = null;
        this.currentlyInRun = false;
        this.trackId = null;
        this.knownRooms = [];
        this.doRoomUpdateWhenOpening = [];
        this.DungeonScanner = DungeonScanner;
        this.DungeonScanner.onRoomEnter((r) => this.registerRoom(r));
        this.DungeonScanner.onRoomLeave((r) => this.registerRoom(r));

        this.highlightData = {
            last: 0,
            data: {
                note: null,
                room: null,
                realNote: null,
                trackId: null,
                trigger: 'near',
                near: 0,
                x: 0,
                y: 0,
                z: 0,
                color: "Yellow"
            },
            next2: [

            ]
        }

        register('worldLoad', () => {  
            this.reset();
        });

        this.editing = {
            isEditing: false,
            block: null,
            room: null,
            insertingAt: null,
            editingId: null,
        }

        this.loadRoutes();
    }

    /**
     * @param {void}
     * @returns {void}
     * @description Initializes the dungeon routes feature.
     */
    loadRoutes() {
        register("command", () => {
            ChatLib.chat('&2&lCurrent Known Rooms:');
            this.knownRooms.forEach(room => {
                ChatLib.chat(`&2&l${room.name} (${room.room.routes.filter(r => r.completed).length}/${room.room.routes.length} Tracks Completed)`);
            });
            this.doRoomUpdateWhenOpening.forEach(room => {
                ChatLib.chat(`&2&l${room.roomName} (SYNC) (${room.skipTo})`);
            });
        }).setName('getrooms');

        register("command", () => {
            this.knownRooms = [];
            this.doRoomUpdateWhenOpening = [];
            this.currentRoom = null;
            ChatLib.chat('&2&lCleared known rooms');
        }).setName("clearrooms");

        register("command", (...args) => {

            if (!this.main.settings.values.route_developer_mode)
                return ChatLib.chat('&6&lOA - You must enable Route Developer Mode in settings to use this command');

            this.editing.isEditing = !this.editing.isEditing;
            if (args?.[0]?.toLowerCase() === 'edit' && this.editing.isEditing) {
                const num = parseInt(args[1]);
                if (isNaN(num)) return ChatLib.chat('&c&lInvalid number');
                const room = this.main.FileUtils.readJSON("/data/dungeonRoutes.json").find(r => r.name === this.currentRoom.name);
                if (!room) return ChatLib.chat('&c&lNo room selected');

                if (!room.tracks?.[num-1]) return ChatLib.chat('&c&lInvalid number: '+ num);
                this.editing.editingId = num - 1;
                const realCoords = this.getRealCoord([room.tracks[num-1].x, room.tracks[num-1].y, room.tracks[num-1].z]);
                const block = this.getBlockAtCoords(
                    realCoords[0],
                    realCoords[1],
                    realCoords[2]
                );
                this.editBlock(block);
                return;
            }
            if (args?.[0]?.toLowerCase() === 'insert' && this.editing.isEditing) {
                let num = parseInt(args[1]);

                if (args[1].toLowerCase() === 'here') {
                    num = this.trackId + 1;
                }

                if (isNaN(num)) return ChatLib.chat('&c&lInvalid number');
                this.editing.insertingAt = num;
                ChatLib.chat(`&2&lInserting at position ${num}`);
            }
            if (!this.editing.isEditing) {
                this.resetEditing();    
            } 
            if (this.editing.isEditing) {
                ChatLib.chat(`&2&lYou\'re now editing routes, punch a block to add a route.`);
            } else
                ChatLib.chat(`&2&lYou\'re no longer editing routes`);
        }).setName("editroute");

        register("command", () => {
            const routes = this.main.FileUtils.readJSON("/data/dungeonRoutes.json");
            const room = routes.find(r => r.name === this.currentRoom.name);
            if (!room) return ChatLib.chat(`&c&lNo room selected`);
            ChatLib.chat(`&2&lRoutes for ${this.currentRoom.name}:`);
            for (let i = 0; i < room.tracks.length; i++) {
                let track = room.tracks[i];
                ChatLib.chat(`&2&l${i + 1}: ${track.note}`);
            }
        }).setName("showroute");

        register("command", () => {
            this.uploadRoutes();
        }).setName("uploadrooms")

        register("command", () => {
            if (this.trackId || this.trackId === 0)
                this.completeTrack(this.highlightData.data.room, this.trackId);
            else ChatLib.chat(`&c&lError: no trackId`);
            ChatLib.chat(`&2&lCompleted track`);
        }).setName("skip");

        register("command", () => {
            const routes = this.main.FileUtils.readJSON("/data/dungeonRoutes.json");
            const roomsWithoutRoutes = routes.filter(r => r.tracks.length === 0);


            const finishedCount = Object.keys(routes).length - Object.keys(roomsWithoutRoutes).length;
            ChatLib.chat(`&2&lRooms without routes (${finishedCount}/${Object.keys(routes).length} Finished) (${Math.round(finishedCount/Object.keys(routes).length * 100)}%):`);
            roomsWithoutRoutes.forEach(r => {
                ChatLib.chat(`&2&l${r.name}`);
            });
        }).setName("rooms");

        register("command", () => {
            this.reloadRoom();
        }).setName("reloadroom");

        register("renderWorld", (partialTicks) => {
            if (this.editing.block) {
                this.highlightBlock(this.editing.block?.x, this.editing.block?.y, this.editing.block?.z, true, Color.magenta);
            }
            try {
                if (this.editing.isEditing) {
                    const routes = this.main.FileUtils.readJSON("data/dungeonRoutes.json");
                    const tracks = routes.find(r => r.name === this.currentRoom?.name)?.tracks;
                    if (tracks)
                    tracks.forEach(t => {
                        
                        const coords = this.getRealCoord([t.x, t.y, t.z]);
                        if (this.editing.editingId !== tracks.indexOf(t) && coords) 
                        this.highlightBlock(coords[0], coords[1], coords[2], false, Color.cyan, `Note: ${t.note}\nTrigger: ${t.trigger}` + (t.trigger === 'near' ? `\nNear: ${t.near}` : '') + `\nNumber: ${tracks.indexOf(t) + 1}`);
                    });
                }
            } catch (e) {
                console.error(e);
            }

            if (this.highlightData.data.room &&
                this.highlightData.data.room.maxSecrets <=
                this.highlightData.data.room.currentSecrets) {
                    return;
            }

            if (this.main.settings.values.dungeon_routes && this.currentlyInRun && this.highlightData.data.room && !this.editing.isEditing) {
                this.highlightBlock(this.highlightData.data.x, this.highlightData.data.y, this.highlightData.data.z, true, this.main.settings.values.change_current_route_color, this.highlightData.data.realNote);
                if (this.highlightData.next2[0]) {
                    this.highlightBlock(this.highlightData.next2[0].x, this.highlightData.next2[0].y, this.highlightData.next2[0].z, this.main.settings.values.line_to_yellow ?
                        [this.highlightData.data.x, this.highlightData.data.y, this.highlightData.data.z] : false, this.main.settings.values.change_next_route_color, this.highlightData.next2[0].note);
                }
                if (this.highlightData.next2[1]) {
                    this.highlightBlock(this.highlightData.next2[1].x, this.highlightData.next2[1].y, this.highlightData.next2[1].z, this.main.settings.values.line_to_red ?
                        [this.highlightData.next2[0].x, this.highlightData.next2[0].y, this.highlightData.next2[0].z]: false, this.main.settings.values.change_3rd_route_color,
                        this.highlightData.next2[1].note
                    );
                }
            };

            if (this.main.settings.values.dungeon_routes && this.currentlyInRun && this.highlightData.data.room && this.highlightData.data.trigger === 'air') {
                try {
                    if (World && World?.getBlockAt(
                        this.highlightData.data.x,
                        this.highlightData.data.y,
                        this.highlightData.data.z
                    ).type.getID() === 0) {
                        this.completeTrack(this.highlightData.data.room, this.trackId);
                    }
                } catch (e) {
                }
            }
        });

        register("step", () => {
            this.updateHighlightData();
            if (this.main.settings.values.dungeon_routes && this.currentlyInRun && this.highlightData.data.room && this.highlightData.data.trigger === 'near') {

                if (this.isNear(this.highlightData.data.x, this.highlightData.data.y, this.highlightData.data.z, this.highlightData.data.near, true)) {
                    this.completeTrack(this.highlightData.data.room, this.trackId);
                }

            }
        }).setFps(10);

        register("HitBlock", (block) => {

            try {

                if (this.editing.isEditing && this.currentlyInRun && this.currentRoom && !this.editing.room) {
                    this.editBlock(block);
                }

                if (!this.currentlyInRun) return;
                
                if (this.main.settings.values.dungeon_routes && this.highlightData.data.room) {
                    if (
                        (
                            this.highlightData.data.trigger === 'click' ||
                            this.highlightData.data.trigger === 'air'

                        ) &&
                        block.x === this.highlightData.data.x &&
                        block.y === this.highlightData.data.y &&
                        block.z === this.highlightData.data.z
                    )
                        this.completeTrack(this.highlightData.data.room, this.trackId);
                }
            } catch (e) {
                console.error(e);
            }
        });

        register("playerInteract", (action, {x, y, z}) => {
            const actionString = action.toString();
            if (actionString === 'RIGHT_CLICK_BLOCK' || actionString === 'LEFT_CLICK_BLOCK') {
                if (this.editing.isEditing && this.currentlyInRun && this.currentRoom) {
                    const relitiveCoords = this.getRoomCoord([x, y, z]);
                    const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));
                    const tracks = routes.find(r => r.name === this.currentRoom.name).tracks;
                    const track = tracks.find(t => t.x === relitiveCoords[0] && t.y === relitiveCoords[1] && t.z === relitiveCoords[2]);
                    if (track) {
                        if (actionString === 'RIGHT_CLICK_BLOCK') {
                            const block = this.getBlockAtCoords(x, y, z);
                            this.editBlock(block);
                        }
                    }
                }
                if (this.main.settings.values.dungeon_routes && this.currentlyInRun && this.highlightData.data.room) {
                    if (
                        (
                            this.highlightData.data.trigger === 'click' ||
                            this.highlightData.data.trigger === 'air'
        
                        ) &&
                        x === this.highlightData.data.x &&
                        y === this.highlightData.data.y &&
                        z === this.highlightData.data.z
                    )
                        this.completeTrack(this.highlightData.data.room, this.trackId);
                }
            }
        });

    }

    /**
     * @returns {void}
     * @description Resets the current room and run state.
     */
    reset() {
        this.currentRoom = null;
        this.currentlyInRun = false;
        this.trackId = null;
        this.knownRooms = [];
        this.doRoomUpdateWhenOpening = [];
    }

    /**
     * @returns {void}
     * @description Resets the editing state.
     */
    resetEditing() {
        this.editing = {
            isEditing: false,
            block: null,
            room: null,
            insertingAt: null,
            editingId: null,
        }
    }

    /**
     * @returns {void}
     * @description Reloading the current room.
     */
    reloadRoom() {
        const routes = this.main.FileUtils.readJSON("data/dungeonRoutes.json");
        const room = routes.find(r => r?.name === this.currentRoom?.name);
        if (!room) return;
        this.currentRoom.routes = room.tracks;
    }

    /**
     * @returns {void}
     * @description Reloads all routes in the current run.
     */
    reloadRoutes() {
        if (!this.currentlyInRun)
            return;

        const routes = this.main.FileUtils.readJSON("data/dungeonRoutes.json");

        this.knownRooms.forEach(room => {
                const roomData = routes.find(r => r.name === room.name);
                if (roomData)
                    room.routes = roomData.tracks;
            }
        );
    }

    /**
     * @returns {void}
     * @description Resets the current room and run state.
     */
    uploadRoutes() {
        const routes = this.main.FileUtils.readJSON("data/dungeonRoutes.json");
        this.main.socket.send({type: 'command-v2', payload: {command: 'uploadrooms', payload: {
            routes: routes,
            editing: this.main.settings.values.editing_route,
        }}});
    }

    syncRoom(roomName, skipTo) {
        const room = this.knownRooms.find(r => r.name === roomName);
        if (!room) {
            if (!this.doRoomUpdateWhenOpening.find(r => r.roomName === roomName)) {
                this.doRoomUpdateWhenOpening.push({
                    roomName: roomName,
                    skipTo: skipTo
                })
            } else {
                this.doRoomUpdateWhenOpening.find(r => r.roomName === roomName).skipTo = skipTo;
            }
            return;
        };
        room.room.routes.forEach(r => {
            const i = room.room.routes.indexOf(r);
            if (i < skipTo
        ) {
                r.completed = true;
            }
        });
    }

    /**
     * @param {[number, number, number]} coords 
     * @returns {[number, number, number]}
     * @description Converts real coords to room coords.
     */
    getRoomCoord(coords) {
        if (!this.currentRoom) return [0,0,0];
        const roomResponse = this.currentRoom.getRoomCoord(coords);
        if (roomResponse)
            roomResponse[1] = coords[1];
        return roomResponse;
    }

    /**
     * @param {[number, number, number]} coords
     * @returns {[number, number, number]}
     * @description Converts room coords to real coords.
     */
    getRealCoord(coords) {
        if (!this.currentRoom) return [0,0,0];
        const realResponse = this.currentRoom.getRealCoord(coords);
        if (realResponse)
            realResponse[1] = coords[1];
        return realResponse;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Block}
     * @description Gets the block at the given coordinates.
     */
    getBlockAtCoords(x, y, z) {
        return World.getBlockAt(x, y, z);
    }

    /**
     * @param {Block} block
     * @description Edits the block at the given coordinates.
     */
    editBlock(block) {
        const ogRelitiveCoords = this.getRoomCoord([block.x, block.y, block.z]);
        let relitiveCoords = this.getRoomCoord([block.x, block.y, block.z]);
        const existingTrack = this.currentRoom.routes.find(t => t.x === relitiveCoords[0] && t.y === relitiveCoords[1] && t.z === relitiveCoords[2]);
        const _this = this;

        const routes = this.main.FileUtils.readJSON("/data/dungeonRoutes.json");
        const c = routes.find(r => r.name === this.currentRoom.name);
        if (!c) {
            ChatLib.chat(`&c&l${this.currentRoom.name} cannot have routes assigned to it, if you believe this is an error please DM orange0513`);
            return this.resetEditing();
        }
        this.main.socket.send({
            type: 'command-v2',
            payload: {command: 'editroute', payload: {
                coords: relitiveCoords,
                room: this.currentRoom.name,
                currentBlock: existingTrack || null,
            }}
        }).then((data) => {
            try {
                if (data.ping) {
                    _this.editing.block = block;
                    _this.editing.room = this.currentRoom;
                    _this.editing.editingId = existingTrack ? this.currentRoom.routes.indexOf(existingTrack) : null;
                } else if (data.editCoords) {
                    relitiveCoords = data.coords;
                    const coords = _this.getRealCoord([relitiveCoords[0], relitiveCoords[1], relitiveCoords[2]]);
                    const block = _this.getBlockAtCoords(coords[0], coords[1], coords[2]);
                    _this.editing.block = block;
                }
                else if (data.finalize) {
                    if (data.cancel) {
                        _this.resetEditing();
                        _this.reloadroom();
                        return;
                    };

                    const routes = this.main.FileUtils.readJSON("/data/dungeonRoutes.json");
                    if (!existingTrack) {

                        if (data.deleteRoute) {
                            _this.resetEditing();
                            _this.reloadRoom();
                            _this.uploadRoutes();
                            return;
                        }

                        const tracks = routes.find(r => r?.name === _this.editing.room?.name)?.tracks;
                        if (_this.editing.insertingAt) {
                            tracks.splice(_this.editing.insertingAt - 1, 0, {
                                x: relitiveCoords[0],
                                y: relitiveCoords[1],
                                z: relitiveCoords[2],
                                note: data.note,
                                trigger: data.trigger,
                                near: data.near,
                            });
                            _this.editing.insertingAt = null;
                        } else
                        tracks.push({
                            x: relitiveCoords[0],
                            y: relitiveCoords[1],
                            z: relitiveCoords[2],
                            note: data.note,
                            trigger: data.trigger,
                            near: data.near,
                        });
                        routes.find(r => r.name === _this.editing.room.name).lastEdit = Date.now();
                        _this.main.FileUtils.write("/data/dungeonRoutes.json", JSON.stringify(routes, null, 2));
                        try {
                            _this.uploadRoutes();
                        } catch (e) {   
                        }
                        _this.currentRoom.routes = tracks;
                        _this.reloadRoom();
                        _this.resetEditing();
                    } else {
                        if (data.deleteRoute) {
                            try {
                                const tracks = routes.find(r => r.name === _this.editing.room.name).tracks;
                                const track = tracks.find(t => t.x === ogRelitiveCoords[0] && t.y === ogRelitiveCoords[1] && t.z === ogRelitiveCoords[2]);
                                tracks.splice(tracks.indexOf(track), 1);
                                routes.find(r => r.name === _this.editing.room.name).lastEdit = Date.now();
                                _this.main.FileUtils.write("/data/dungeonRoutes.json", JSON.stringify(routes, null, 2));
                                try {
                                    _this.uploadRoutes();
                                } catch (e) {   
                                }
                                _this.resetEditing();
                                _this.currentRoom.routes = tracks;
                                _this.reloadRoom();;
                                return;
                            } catch (e) {
                                console.error(e);
                                return;
                            }
                        }
                        const tracks = routes.find(r => r.name === _this.editing.room.name).tracks;
                        const track = tracks.find(t => t.x === ogRelitiveCoords[0] && t.y === ogRelitiveCoords[1] && t.z === ogRelitiveCoords[2]);
                        track.x = relitiveCoords[0];
                        track.y = relitiveCoords[1];
                        track.z = relitiveCoords[2];
                        track.note = data.note;
                        track.trigger = data.trigger;
                        track.near = data.near;
                        routes.find(r => r.name === _this.editing.room.name).lastEdit = Date.now();
                        _this.main.FileUtils.write("/data/dungeonRoutes.json", JSON.stringify(routes, null, 2));
                        try {
                            _this.uploadRoutes();
                        } catch (e) {   
                        }
                        _this.resetEditing();
                        _this.reloadRoom();
                    }

                }
            } catch (e) {
                ChatLib.chat(`&6&lOA - &6Leaving Route Editor due to fatal error: &c${e.message}`);
                _this.resetEditing();
            }
        });

        
    }

    /**
     * 
     */
    registerRoom(room) {
        if (!room || !room?.name) { // hopefully this also detects when you enter boss??????
            return this.reset();
        }
        const routes = this.main.FileUtils.readJSON("data/dungeonRoutes.json");
        this.currentRoom = room;
        this.currentlyInRun = true;
        if (!this.knownRooms.find(r => r.name === room.name)) {
            
            this.knownRooms.push({name: room.name, room: room});
            this.knownRooms.find(r => r.name === room.name).room.routes = 
                routes.find(r => r.name === room.name)?.tracks
            || [];
            this.currentRoom = this.knownRooms.find(r => r.name === room.name).room;

            if (this.doRoomUpdateWhenOpening.length > 0 && this.doRoomUpdateWhenOpening.find(r => r.roomName === room.name)) {
                this.syncRoom(this.doRoomUpdateWhenOpening.find(r => r.roomName === room.name).roomName, this.doRoomUpdateWhenOpening.find(r => r.roomName === room.name).skipTo);
                this.doRoomUpdateWhenOpening = this.doRoomUpdateWhenOpening.filter(r => r.roomName !== room.name);
            }
        }
    }

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @param {*} range 
     * @param {*} returnBool 
     * @returns 
     */
    isNear(x, y, z, range, returnBool = true) {
        const r = Math.sqrt(Math.pow(Player.getX() - x, 2) + Math.pow(Player.getY() - y, 2) + Math.pow(Player.getZ() - z, 2));

        if (returnBool)
            return r <= range;
        return r;
    }

    /**
     * @returns {void}
     * @description Updates highlight data for the current room.
     */
    updateHighlightData(bypass) {
        if (this.highlightData.last > Date.now() - 250 && !bypass) return;
        this.registerRoom(DungeonScanner.getCurrentRoom());
        this.highlightData.last = Date.now();

        if (!this.currentlyInRun || !this.currentRoom) return;
        if (!this.currentRoom || (this.currentRoom.checkmark === 2 && !this.main.settings.values.route_developer_mode)) {
            this.highlightData.data.room = null;
            return;
        }
        if (!this.currentRoom.routes) {
            this.highlightData.data.room = null;
            return;
        }
        if (this.currentRoom.routes.length === 0 ) {
            if (!this.showed) {
                this.showed = true;
                if (this.main.settings.values.route_developer_mode)
                    Client.showTitle("&cNo Routes in this room!", "", 0, 40, 10)
            }
        } else
            this.showed = false;
        const firstIncompleteTrack = this.currentRoom.routes.find(r => !r.completed);
        if (!firstIncompleteTrack) {
            this.highlightData.data.room = null;
            return;
        }

        const next3Tracks = this.currentRoom.routes.filter(r => !r.completed).slice(0, 4).filter(r => r !== firstIncompleteTrack);
        this.highlightData.data.note = [firstIncompleteTrack.note, ...next3Tracks.map(t => t.note)].join('\n');
        this.highlightData.data.room = this.currentRoom;
        this.highlightData.data.trigger = firstIncompleteTrack.trigger;
        this.highlightData.data.realNote = firstIncompleteTrack.note;
        if (firstIncompleteTrack.trigger === 'near')
            this.highlightData.data.near = firstIncompleteTrack.near;

        const coords = this.getRealCoord([firstIncompleteTrack.x, firstIncompleteTrack.y, firstIncompleteTrack.z]);
        this.highlightData.data.x = coords?.[0];
        this.highlightData.data.y = coords?.[1];
        this.highlightData.data.z = coords?.[2];
        this.highlightData.data.color = firstIncompleteTrack.color;
        this.trackId = this.currentRoom.routes.indexOf(firstIncompleteTrack);

        const next2 = next3Tracks.slice(0, 2);
        this.highlightData.next2 = next2.map(t => {
            const coords = this.getRealCoord([t.x, t.y, t.z]);
            return {
                x: coords?.[0],
                y: coords?.[1],
                z: coords?.[2],
                note: t.note,
            }
        });

    }

    completeTrack(room, trackId, bypass = false) {
        try {
            if (typeof room === 'string') {
                room = this.knownRooms.find(r => r.name === room);
            }
            room.routes[trackId].completed = true;
            if (!bypass) {
                this.main.socket.send({sync: true, type: 'broadcastRoute', payload: {id: this.main.serverId, route: this.currentRoom?.name, data: (this.trackId + 1)}});
            }
            this.updateHighlightData(true);
        } catch (e) {
            console.error(e);
        }
    }

    highlightBlock(x, y, z, line, color, text) {
        const center = RenderLibV2.calculateCenter(x, y+1, z, x+1, y, z+1);

        const renderColor = color.getRed ? color : new Color(color[0] / 255, color[1] / 255, color[2] / 255);
        const transparentLine = this.main.settings.values.transparency_on_line / 1000;
        const transparentBlock = this.main.settings.values.transparency_on_block / 1000;
        const transparentText = this.main.settings.values.transparency_on_text / 1000;
        if (typeof line === 'object') {
            RenderLibV2.drawLine((0.5 + line[0]), (0.5 + line[1]), (0.5 + line[2]), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue,  transparentLine, true, 3)

        }   else if (line)
                if (Player.isSneaking())
                    RenderLibV2.drawLine(Player.getRenderX(), Player.getRenderY() + 1.54, Player.getRenderZ(), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue, transparentLine, true, 3)
                else
                    RenderLibV2.drawLine(Player.getRenderX(), Player.getRenderY() + 1.62, Player.getRenderZ(), x+0.5, y+0.5, z+0.5, renderColor.red, renderColor.green, renderColor.blue, transparentLine, true, 3)

        if (text) {





            
            const r = this.isNear(x, y, z, 0, false);



            let size = r < 6 ? 0.0375 : 0.007 * r;

            let bypass = false;
            

            if (color === this.main.settings.values.change_current_route_color) {


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
}