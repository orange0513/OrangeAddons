/// <reference types="../../CTAutocomplete" />

import WebSocket from 'WebSocket';

// FOR REVIEWER: Old version of this file is located at /src/comms/socketHandler.js
let debugging = true;
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class socket {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        this.main = main;
        this.socketObj = null;
        this.promises = new Map();
        this.registeredCommands = [];
        this.currentChatPrompt = null;
        this.infoMsg = [];

        this.start();
        
    }


    /**
     * @param {string | Object} data
     * @returns {Object: {then: Function, catch: Function}}
     * @description Sends data to the backend and returns a promise.
     */
    send(data) {
        const _this = this;
        try {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }

            if (!this.socketObj || !this.socketObj.isOpen) return;

            const messageId = this.main.helpers.generateUUID();

            if (debugging) 
                console.log("OA Socket sending:", JSON.stringify({
                    ...data,
                    responseId: messageId
                }, null, 2));
            this.socketObj.send(JSON.stringify({
                ...data,
                responseId: messageId
            }))
            return {
                then: (resolve) => {
                    this.promises.set(messageId, resolve);
                },
                catch: (reject) => {
                    this.promises.set(messageId, reject);
                }
            }
        } catch (error) {
            console.log(error)
            console.error("OA Socket error while sending data Restarting:", error);
            console.log('Send reboot')
            if (this.socketObj?.dontReconnect) return console.log("OA Socket not reconnecting due to dontReconnect flag.");
            setTimeout(() => {
                _this.start();
            }, 1000);
        }
    }

    /**
     * @param {string} data
     * @description Handles incoming data from the backend.
     */
    handleIncomingData(data) {
        try {
            if (typeof data === "string")
                data = JSON.parse(data);

            if (debugging)
                console.log("OA Socket received:", JSON.stringify(data, null, 2));


            if (data.messageId && this.promises.has(data.messageId)) {
                this.promises.get(data.messageId)(data);
                if (data.delete)
                    this.promises.delete(data.messageId);
                return;
            }

            switch (data.type) {
                case 'message':
                    this.main.MessageUtils.sendMessage(data.payload.msg.response);
                    break;
                case 'registerCommands':
                    data.payload.forEach(cmd => {
                        if (!this.registeredCommands.includes(cmd.name) && ['staffCommand','command-v2'].includes(cmd.type)) {
                        this.registeredCommands.push(cmd.name);
                        this.main[cmd.type === 'staffCommand' ? 'staffCommands' : 'v2Commands']?.aliases?.push(cmd.name);
                    }
                    });
                    break;
                case 'newHelpMessage': 
                    this.main.FileUtils.write('./data/help.json', JSON.stringify(data.payload));
                    break;
                case 'chatPrompt': 
                    let chatPrompt = data.payload;
                    this.createChatPrompt(chatPrompt.id);
                    setTimeout(() => {
                        this.removeChatPrompt(chatPrompt.id);
                    }, chatPrompt.timeout || 60000);
                    break;
                case 'updatePf':
                    this.main.FileUtils.write("data/partyFinder.json", JSON.stringify(data.payload));
                    break;
                case 'bulkDelete':
                    this.main.MessageUtils.clearMessages(data.payload);
                    break;
                case 'updateRooms':
                    this.main.FileUtils.write("/data/dungeonRoutes.json", JSON.stringify(data.payload, null, 2));
                    this.main.features.dungeons.dungeonRoutes.reloadRoutes();
                    break;
                case 'updateCurrentRun':
                    const skippingTo = data.payload.skipTo;
                    this.main.features.dungeons.dungeonRoutes.syncRoom(data.payload.route, skippingTo);
                    break;
                case 'setRouteDevMode':
                    if (data.payload !== false && data.payload !== true) return;
                    this.main.settings.setValue("route_developer_mode",data.payload)
                    break; 
                case 'setEditingRoute':
                    if (typeof data.payload !== 'string') return;
                    this.main.settings.setValue("editing_route",data.payload);
                    break;
                case 'setUseRoute':
                    if (typeof data.payload !== 'string') return;
                    this.main.settings.setValue("use_route",data.payload);
                    break;
                case 'addRouteOverwrite':
                    if (
                        typeof data.payload !== 'object' ||
                        typeof data.payload.room !== 'string' ||
                        typeof data.payload.route !== 'string'
                    ) return;
                    let routeOverwrites = this.main.FileUtils.readJSON('/data/routeOverwrites.json');
                    routeOverwrites = routeOverwrites.filter(ow => ow.room !== data.payload.room);
                    routeOverwrites.push(data.payload);
                    this.main.FileUtils.write('/data/routeOverwrites.json', JSON.stringify(routeOverwrites, null, 2));
                    break;
                case 'removeRouteOverwrite':
                    if (typeof data.payload !== 'string') return;
                    let routeOverwrites2 = this.main.FileUtils.readJSON('/data/routeOverwrites.json');
                    routeOverwrites2 = routeOverwrites2.filter(ow => ow.room !== data.payload);
                    this.main.FileUtils.write('/data/routeOverwrites.json', JSON.stringify(routeOverwrites2, null, 2));
                    break;
                case 'changeInfo':
                    Object.values(data.payload).forEach(obj => {
                        if (typeof obj !== 'string')
                            return
                    });
                    this.infoMsg = data.payload;
                break;     
            }
        } catch (error) {
            console.error("OA Socket error while handling incoming data:", error);
        }
    }

    /**
     * @param {string} promptId
     */
    createChatPrompt(promptId) {
        if (this.currentChatPrompt) {
            this.currentChatPrompt.register.unregister();
        }
        const _this = this;
        this.currentChatPrompt = {
            promptId,
            register: register("messageSent", (m, e) => {
                if (m.startsWith('/')) return;
                if (_this.currentChatPrompt.promptId !== promptId) return;

                cancel(e);
                _this.send({
                    type: 'command-v2',
                    payload: {
                        command: 'oares',
                        payload: promptId + ' ==>' + m + '<=='
                    }
                })
                _this.removeChatPrompt(promptId);
            })

        }
    }

    /**
     * @param {string} promptId
     * @description Removes the chat prompt.
     * @returns {void}
     */
    removeChatPrompt(promptId) {
        if (this.currentChatPrompt && this.currentChatPrompt.promptId === promptId) {
            this.currentChatPrompt.register.unregister();
            this.currentChatPrompt = null;
        }
    }

    /** 
     * @description Starts the socket connection.
     * @returns {void}
     */
    start() {
        if (this.socketObj) {
            this.socketObj?.dontReconnect = true;
            this.socketObj.onClose = () => {};
            this.socketObj.onError = () => {};
            this.socketObj.onOpen = () => {};
            this.socketObj.onMessage = () => {};
            this.socketObj?.close();
        }
        if (this.main.unloaded) return;
        this.socketObj = new WebSocket('wss://orangeaddons.dev:30022');
        this.socketObj.isOpen = false;
        this.registerSocket();
    }

    /** 
     * @description Registers the listeners for the socket connection.
     * @returns {void}
     */
    registerSocket() {
        if (this.main.unloaded) return;
        this.socketObj.onOpen = () => {
            try {
                this.socketObj.isOpen = true;
                let response = {
                    type: 'auth',
                    payload: {name: Player.getName(), version: this.main.version, session: this.main.SessionUtils.getServerId()}
                }
                this.send(response);
                
                setTimeout(() => {
                    this.send({type: 'command-v2', payload: {command: 'downloadrooms', payload: { 
                        route: this.main.settings.values.route_developer_mode ? this.main.settings.values.editing_route : this.main.settings.values.use_route,
                        overwrites: this.main.settings.values.route_developer_mode ? [] : JSON.parse(this.main.FileUtils.read('/data/routeOverwrites.json'))
                    }}});
                }, 2500);
                
            } catch (error) {
                console.error("OA Socket error while opening connection:", error);
                console.log('open reboot')
                if (this.socketObj?.dontReconnect) return console.log("OA Socket not reconnecting due to dontReconnect flag.");
                            setTimeout(() => {
                this.start();
            }, 1000);
                return;
            }
        }

        this.socketObj.onMessage = (data) => {
            this.handleIncomingData(data);
        }

        this.socketObj.onError = (error) => {
            console.error(error);
            if (this.socketObj?.dontReconnect) return console.log("OA Socket not reconnecting due to dontReconnect flag.");

            setTimeout(() => {
                if (this.socketObj?.dontReconnect) return console.log("OA Socket not reconnecting due to dontReconnect flag.");
                console.log('error reboot')
                            setTimeout(() => {
                this.start();
            }, 1000);
            }, 500)
        }

        this.socketObj.onClose = (code) => {

            if (this.socketObj?.dontReconnect) return console.log("OA Socket not reconnecting due to dontReconnect flag.");
            console.error("OA Socket closed with code:", code);
            setTimeout(() => {
                if (this.socketObj?.dontReconnect) return console.log("OA Socket not reconnecting due to dontReconnect flag.");
                console.log('close reboot')
                setTimeout(() => {
                    this.start();
                }, 1000);
            }, 500);
        }

        this.socketObj.connect();

    }
}