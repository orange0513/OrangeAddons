// note to reviewer, this is a rewrite of the old version of this just with the addition of callbacks on the send method & being able to register command-v2 aswell and not just staffCommand
// just wanted to go back and remake this since ive really improved my coding since when i first made it, and it was an atrocity to look at


import messageHandler from "../handlers/message";
import { bulkDelete } from "../handlers/message";
import global from "./internal";
import WebSocket from "WebSocket";
import sleep from "sleep";
let unloaded = false;
let socket;

function getIGNPreLoad() {
    let clientClass = Client.getMinecraft().func_110432_I().func_148256_e().toString()
    let regex = /name=([A-Za-z_0-9]+)/
    let result = regex.exec(clientClass)
    return result[1]
}

function getUUIDPreLoad() {
    let clientClass = Client.getMinecraft().func_110432_I().func_148256_e().toString()
    let regex = /id=([A-Za-z_0-9-]+)/
    let result = regex.exec(clientClass)
    return result[1]
}


register('GameUnload', () => {  
    if (unloaded) return;
    unloaded = true;
    socket.close();
});
const debugging = getIGNPreLoad() === "orange0513";

// // const serverId = OASession;

// import axios from 'axios';
// try {
//     const joinServerUrl = "https://sessionserver.mojang.com/session/minecraft/join";
//     const accessToken = Client.getMinecraft().func_110432_I().func_148254_d();
//     const selectedProfile = "playerUuid";
  
//     axios.post(
//       joinServerUrl,
//       {
//         accessToken,
//         selectedProfile,
//         serverId,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json", // Explicitly set the content type
//         },
//       }
//     ).then((response) => {
//       console.log("Joined server successfully!");
//       console.log(response.data);
//       console.log(response.status);
//     }).catch((error) => {
//       console.error("Failed to join server:", JSON.stringify(error));
//     });
// } catch (error) {
//     console.error("Error occurred while joining server:", error.message);
// }
let prevId = null;
function getServerId() {
    if (prevId && prevId.generatedTime + 1000 * 60 * 1 > Date.now() && prevId.name === getIGNPreLoad()) {
        return prevId.serverId;
    }
    // from https://www.chattriggers.com/modules/v/IRC (thank you fork)
    const serverId = java.util.UUID.randomUUID().toString().replace(/-/g, "")
    Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId);
    console.log("Validated ID: " + serverId);
    prevId = {
        serverId,
        name: getIGNPreLoad(),
        generatedTime: Date.now()
    };
    return serverId;
}
  
        
class socketHandler {
    constructor() {
        setTimeout(() => {
            const thisthis = this;
            this.token = FileLib.read("./config/orangeaddons_token.json") ? JSON.parse(FileLib.read("./config/orangeaddons_token.json")) : null;
            this.pendingRequests = [];
            this.alreadyRegistered = [];
            this.chatPromptId = 0;
            this.currentChatPrompt = null;
            this.chatChannels = [];
            this.currentChatChannel = null;
            this.chatChannelsRegistered = false;
            this.restarting = false;
            this.socket = new WebSocket('wss://orangeaddons.dev:30022');
            this.socket.onMessage = (msg) => {
                thisthis.onMessage(JSON.parse(msg));
            };
            this.socket.onError = (error) => {
                console.error(error);
                if (!unloaded)
                    thisthis.restartSocket();
            };
            this.socket.onOpen = () => {
                const v = JSON.parse(FileLib.read("OrangeAddons", "./metadata.json"));
                    let response = {
                        type: 'auth',
                        payload: {name: getIGNPreLoad(), version: v, token: thisthis.token, session: getServerId()}
                    }
                    thisthis.send(response);
            };

            this.socket.onClose = (code, reason, remote) => {
                if (!unloaded)
                    thisthis.restartSocket();
            };
                    
            this.socket.connect();

            register("messageSent", (m, e) => {
                if (m.startsWith('/')) return;
                if (this.currentChatPrompt) {
                    cancel(e);
                    const packetCommand = {
                        type: 'command-v2',
                        payload: {
                            command: 'oares',
                            payload: this.currentChatPrompt + ' ==>' + m + '<=='
                        }
                    }
                    this.send(packetCommand)
                    this.currentChatPrompt = null;
                }
            });
            sleep(3000, () => {
                this.keepAlive();
            });
        }, 2500);
    }

    restartSocket() {
        let thisthis = this;
        if (this.restarting) return;
        this.restarting = true;
        sleep(1000, () => {
            this.restarting = false;
            try { thisthis.socket.close(); } catch (error) {}
            let socket = new WebSocket('wss://orangeaddons.dev:30022');
            thisthis.socket = socket;
            thisthis.socket.onMessage = (msg) => {
                thisthis.onMessage(JSON.parse(msg));
            };
            thisthis.socket.onError = (error) => {
                console.error(error);
                if (!unloaded && thisthis.socket === socket)
                    thisthis.restartSocket();
            };
            thisthis.socket.onOpen = () => {
                const v = JSON.parse(FileLib.read("OrangeAddons", "./metadata.json"));
                    let response = {
                        type: 'auth',
                        payload: {name: getIGNPreLoad(), version: v, token: thisthis.token, session: getServerId()}
                    }
                    thisthis.send(response);
            };

            thisthis.socket.onClose = (code, reason, remote) => {
                if (!unloaded && thisthis.socket === socket) 
                    thisthis.restartSocket();
            };
            thisthis.socket.connect();
        });
    }

    keepAlive() {
        this.send({ type: 'keepAlive' });
        setTimeout(() => {
            if (!unloaded)
                this.keepAlive();
        }, 2000);
    }

    onMessage(message) {
        const messageType = message.type;
        switch (messageType) {
            case 'response':
                const data = message;
                const callback = this.pendingRequests.find(request => request.id === message.messageId)?.callback;
                if (data.delete) {
                    this.pendingRequests = this.pendingRequests.filter(request => request.id !== message.messageId);
                }
                if (callback) callback(data);
                break;
            case 'message':
                messageHandler(message.payload.msg.response);
                break;
            case 'registerCommands': 
                let command = message.payload;
                command.forEach(cmd => {
                    if (!this.alreadyRegistered.includes(cmd.name) && ['staffCommand','command-v2'].includes(cmd.type)) {
                    this.alreadyRegistered.push(cmd.name);
                    register('command', (...args) => {
                        let head = args.join(" ")
                        let packetCommand = {
                            type: cmd.type,
                            payload: {
                                command: cmd.name,
                                payload: head
                            }
                        }
                        this.send(packetCommand);
                    }).setName(cmd.name);
                }
                });
                break;
            case 'keepAlive':
                this.send({ type: 'keepAlive' });
                break;
            // case 'newToken':
            //     this.token = message.payload;
            //     FileLib.write("./config/orangeaddons_token.json", JSON.stringify(this.token));
            //     break;
            case 'newHelpMessage':
                FileLib.write("OrangeAddons", "help.json", JSON.stringify(message.payload));
                break;
            case 'chatPrompt':
                let chatPrompt = message.payload;
                let chatPromptidLocal = this.chatPromptId + 1;
                this.chatPromptid++;
                this.currentChatPrompt = chatPrompt.id;
                setTimeout(() => {
                    if (this.chatPromptid == chatPromptidLocal) {
                        this.currentChatPrompt = null;
                    }
                }, chatPrompt.timeout || 60000);
                break;
            case 'registerChannel': 

                let channel = message.payload;
                
                if (!this.chatChannelsRegistered) {
                    
                    register("messageSent", (m, e) => {
                        for (let channel of chatChannels) {
                            if (msg.startsWith((`/chat ${channel.name}`.toLowerCase()))) {
                                currentChatChannel = channel;
                                cancel(e);
                                ChatLib.chat("&aYou are now in the &r&6"+ currentChatChannel.name.toUpperCase() +"&r&a channel&r")
                            }
                        } 

                        if (!msg.startsWith('/') && currentChatChannel !== null) {
                            cancel(e);
                            const packetCommand = {
                                type: 'staffCommand',
                                payload: {
                                    command: currentChatChannel.command,
                                    payload: m
                                }
                            }
                            this.send(packetCommand)
                        }
                    });
                    register("chat", () => {
                        this.currentChatChannel = null;
                    }).setCriteria(/Opened a chat conversation with .* for the next 5 minutes. Use \/chat a to leave/);
                    register("chat", () => {
                        this.currentChatChannel = null;
                    }).setCriteria('&aYou are now in the &r&6${c}&r&a channel&r')
                    register("chat", () => {
                        this.currentChatChannel = null;
                    }).setCriteria("&cYou're already in this channel!&r")
                    this.chatChannelsRegistered = true;
                    
                }
                const channe = JSON.parse(channel)
                if (!chatChannels.find(c => c.name === channe.name)) {
                    chatChannels.push(channe);
                };
                break;
            case 'updatePf': 
                let newPf = message.payload;
                FileLib.write("OrangeAddons", "persists/partyFinder.json", JSON.stringify(newPf));
                break;
            case 'bulkDelete':
                bulkDelete(message.payload);
                break;
        }
    }

    send(data, callback) {
        try {
            if (callback) {
                let id = Math.floor(Math.random() * 2_000_000_000) + 1;
                this.socket.send(JSON.stringify({ responseId: id, ...data }));
                this.pendingRequests.push({ id, callback });

            } else 
                this.socket.send(JSON.stringify(data));
        } catch (error) {
            console.error(error);
            this.restartSocket();
        }
    }


}

global.socket = new socketHandler;
export default global.socket;

