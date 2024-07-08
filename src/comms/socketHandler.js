
import WebSocket from "WebSocket";
import messageHandler from '../handlers/message';
import global from './internal'
import axios from 'axios'
import settings from '../../settings'
const backend = JSON.parse(FileLib.read("OrangeAddons", "/src/comms/connection.json")).backend 
let backendAddress = "unknown";
let commandsLoaded = false;
let token = null;
let chatPrompt = null;
let channelsRegistered = false;
let currentChatChannel = null;
let chatChannels = []; // Format: [{name: 'name', command: 'command}]
let chatPromptid = 0;
register("messageSent", (m, e) => {
    if (m.startsWith('/')) return;
    if (chatPrompt) {
        cancel(e);
        const packetCommand = {
            type: 'command-v2',
            payload: {
                command: 'oares',
                payload: chatPrompt + ' ==>' + m + '<=='
            }
        }
        global.sendData.send(JSON.stringify(packetCommand))
        chatPrompt = null;
    }
});
try {
    token = JSON.parse(FileLib.read("./config/orangeaddons_token.json"))
}  catch (e) {
}
function boot() {
    console.log('Fetching backend...')
    axios.get('https://'+ backend +'/address', { timeout: 10000 })
    .then(response => { 
        backendAddress = response.data; 
        socketHandler(); 
        console.log('Starting Socket...') 
    })
    .catch(error => {
        console.log('Error fetching backend: '+ error.toString())
        boot()
    });
}
function makeSureAddressIsKnown() {
    if (backendAddress == "unknown") {
        boot();
        console.log('OrangeAddons - Backend Address is unknown, attempting to get address...')
        setTimeout(() => {
            makeSureAddressIsKnown()
        }, 5000);
    }

}
setTimeout(() => {
    makeSureAddressIsKnown()
}, 5000);
const password = JSON.parse(FileLib.read("OrangeAddons", "/src/comms/connection.json")).password // for the reviewer this is for staff module as a 2nd method to access it just incase the first one dosent work for people
console.log('OrangeAddons - Backend Address: '+ backend)
function fakeClassBuilder() {
    class sendData {
        constructor() {
            this.socket = null
        }
        send(data) {
            console.log("Socket is currently disconnected, cannot send data")
        axios.get('https://'+ backend +'/ping', {
            headers: {
                "User-Agent": "Mozilla/5.0 (CT - OrangeAddons)",
                "OA": true,
                "OA-V": 2,
                "auth": ""+ Player.getName() +"-"+ Date.now()
        }
        }).then(response => {
            if (response.data == "pong") {
                console.log('OrangeAddons - Backend is online, reconnecting by force in 10 seconds...')
                setTimeout(() => {
                    if (global.sendData.check() == false) socketHandler(); 
                }, 10000);
            } else {
                console.log('OrangeAddons - Invalid response from backend')
            }
        })
        }
        check() {
            return false;
        }
    }
    return sendData
}
function getIGNPreLoad() {
    let clientClass = Client.getMinecraft().func_110432_I().func_148256_e().toString()
    let regex = /name=([A-Za-z_0-9]+)/
    let result = regex.exec(clientClass)
    return result[1]
}
const debugging = getIGNPreLoad() === 'orange0513' ? true : false;
global.debugging = debugging;
function socketHandler() {
    console.log('OrangeAddons - Attempting to connect to the backend...')
    if (backendAddress == "unknown") return;
    const socket = new WebSocket("ws://"+ backendAddress +"/?password="+ password);
    let connected = false;
    let endFunction = false;
    let unloaded = false;
    let listeners = {}
    let fakeData = fakeClassBuilder()
    global.sendData = new fakeData()
    register('GameUnload', () => {
        if (unloaded) return;
        unloaded = true;
        endFunction = true;
        console.log('OrangeAddons - Unloading...')
        socket.close()
    })
    socket.onError = (error) => {
        console.log('OrangeAddons - Error: ' + JSON.stringify(error))
        if (endFunction) return;
        restart()
    }
    socket.onOpen = () => {
        class sendData {
            constructor() {
                this.socket = socket
            }
            send(data) {
                try {
                    if (debugging) console.log('OrangeAddons - Sending Data: '+ data)
                    this.socket.send(data);
                } catch (error) {
                    console.log('Error sending data: ', JSON.stringify(error));
                    if (JSON.stringify(error).includes('WebsocketNotConnected')) {
                        console.log('OrangeAddons - Attempting to reconnect to the backend...')
                        socketHandler();
                        endFunction = true;
                    }   
                }
            }
            check() {
                return true;
            }
        }
        global.sendData = new sendData()
        connected = true;
        console.log('OrangeAddons - Connected to the backend!')
        const v = JSON.parse(FileLib.read("OrangeAddons", "./metadata.json"));
        console.log(JSON.stringify(Object.keys(v)));
        let response = {
            type: 'auth',
            payload: {name: getIGNPreLoad(), password: password, version: v.version, token: token}
        }
        socket.send(JSON.stringify(response));
    }
    socket.onClose = () => {
        console.log('OrangeAddons - Disconnected from the backend!')
        if (endFunction) return console.log('OrangeAddons - Socket function was ended, not attempting to reconnect');
        connected = false;
        let boop2 = fakeClassBuilder()
        global.sendData = new boop2()
        restart()
    }
    socket.onMessage = (message) => {
        let data = JSON.parse(message);
        if (debugging) console.log('OrangeAddons - Received Data: '+ JSON.stringify(data))
        if (data.type == 'console') {
            console.log(data.payload.msg)
            if (commandsLoaded == false) {
                const packet = {
                    type: 'fetch',
                    payload: 'staffCommands'
                }
                global.sendData.send(JSON.stringify(packet));
                function returnData(data) {
                    commandsLoaded = true;
                    console.log('OrangeAddons - Received Staff Commands! ('+ JSON.stringify(data) +')')
                    Object.keys(data).forEach((i) => {
                        const name = data[i]
                        console.log('OrangeAddons - Loading Staff Command: '+ name)
                        register('command', (...args) => {
                            let head = args.join(" ")
                            console.log('Sending command to server: ' + head)
                            const packetCommand = {
                                type: 'staffCommand',
                                payload: {
                                    command: name,
                                    payload: head
                                }
                            }
                            global.sendData.send(JSON.stringify(packetCommand))
                        }).setName(name)
                        console.log('OrangeAddons - Loaded Staff Command: '+ name)
                    })
                }
                global.returnPacket.staffCommands = returnData;
            }
        } else if (data.type == 'message') {
            messageHandler(data.payload.msg.response)
        } else if (data.type == 'reconnect') {
            endFunction = true;
        } else if (data.type == 'returnFetch') {
            const returnPacket = data.payload
            const returnType = data.payload.returnType;
            if (returnType == 'staffCommands') {
                global.returnPacket.staffCommands(returnPacket.payload)
            }
            if (returnType == 'secretCount') {
                if (!global.returnPacket.secretCount[returnPacket.name]) return console.log('OrangeAddons - Invalid secret count return packet');

                global.returnPacket.secretCount[returnPacket.name].send(returnPacket.amt)
            }
        } else if (data.type == 'newToken') {
            token = data.payload;
            FileLib.write("./config/orangeaddons_token.json", JSON.stringify(token))
        
        } else if (data.type == 'chatPrompt') {
            chatPrompt = data.payload;
            let cPrompt = chatPromptid + 1;
            chatPromptid++;
            setTimeout(() => {
                if (chatPromptid == cPrompt) {
                    chatPrompt = null;
                }
            }, 60000);
        } else if (data.type == 'registerChannel') {
            console.log('1')
            console.log(data.payload)
            let channel = data.payload;
            console.log('OrangeAddons - Started Registering Chat Channel: '+ channel)
            if (!channelsRegistered) {
                console.log('OrangeAddons - Registering Chat Channel Manager...')
                register("messageSent", (m, e) => {
                    const msg = m.toLocaleLowerCase()
                    Object.keys(chatChannels).forEach((i) => {
                        const channel = chatChannels[i];
                        if (msg.startsWith((`/chat ${channel.name}`.toLowerCase()))) {
                            currentChatChannel = channel;
                            cancel(e);
                            ChatLib.chat("&aYou are now in the &r&6"+ currentChatChannel.name.toUpperCase() +"&r&a channel&r")
                        }
                    });
                    // for (const channel of chatChannels) {
                    //     console.log(channel);
                    //     if (msg.startsWith((`/chat ${channel.name}`.toLowerCase()))) {
                    //         currentChatChannel = channel;
                    //         cancel(e);
                    //         ChatLib.chat("&aYou are now in the &r&6"+ currentChatChannel.name.toUpperCase() +"&r&a channel&r")
                    //     }
                    // } 
                    // i tried this but channel is undefined????
                    if (!msg.startsWith('/') && currentChatChannel !== null) {
                        cancel(e);
                        const packetCommand = {
                            type: 'staffCommand',
                            payload: {
                                command: currentChatChannel.command,
                                payload: m
                            }
                        }
                        global.sendData.send(JSON.stringify(packetCommand))
                    }
                });
                register("chat", () => {
                    currentChatChannel = null;
                }).setCriteria(/Opened a chat conversation with .* for the next 5 minutes. Use \/chat a to leave/);
                register("chat", () => {
                    currentChatChannel = null;
                }).setCriteria('&aYou are now in the &r&6${c}&r&a channel&r')
                register("chat", () => {
                    currentChatChannel = null;
                }).setCriteria("&cYou're already in this channel!&r")
                channelsRegistered = true;
                console.log('OrangeAddons - Registered Chat Channel Manager!')
            }
            const channe = JSON.parse(channel)
            if (!chatChannels.find(c => c.name === channe.name)) {
                console.log('OrangeAddons - Registered Chat Channel: '+ channe.name)
                chatChannels.push(channe);
            }
        }
    }
    function restart() {
        if (connected) return;
        if (endFunction) return;
        console.log('OrangeAddons - Attempting to reconnect to the backend...')
        let abc = false;
        setTimeout(() => {
            abc = true;
            if (endFunction) return;
            if (connected) return;
            console.log('OrangeAddons - Attempting to connect again...')
            restart()
        }, 5000);
        axios.get('https://'+ backend +'/ping', {
            headers: {
                "User-Agent": "Mozilla/5.0 (CT - OrangeAddons)",
                "OA": true,
                "OA-V": 2,
                "auth": ""+ Player.getName() +"-"+ Date.now()
            }
        }).then(response => {
            if (response.data == "pong") {
                if (abc) return;
                if (connected) return;
                console.log('OrangeAddons - Backend is online, connecting...')
                endFunction = true;
                try {
                    socket.close()
                } catch (error) {
                }
                socketHandler()
            } else {
                console.log('OrangeAddons - Invalid response from backend')
            }
        })
    }
    socket.connect();
    setTimeout(() => {
        if (connected) return;
        if (endFunction) return;
        console.log('OrangeAddons - Unable to connect to the backend, attempting to reconnect...')
        restart()
    }, 10000);
    while (endFunction) {
        console.log('OrangeAddons - Ending Socket Function...')
        return;
    }
}
export default boot
