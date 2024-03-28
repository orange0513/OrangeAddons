import WebSocket from "WebSocket";
import messageHandler from '../handlers/message';
import global from './internal'
import axios from 'axios'
const backend = JSON.parse(FileLib.read("OrangeAddons", "/src/comms/connection.json")).backend
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
function socketHandler() {
    console.log('OrangeAddons - Attempting to connect to the backend...')
    const socket = new WebSocket("ws://"+ backend);
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
                    console.log('OrangeAddons - Sending Packet to Server:: ', JSON.stringify(data))
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
        let response = {
            type: 'auth',
            payload: {name: getIGNPreLoad()}
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
        let data = JSON.parse(message)
        console.log('OrangeAddons - Received Packet from Server: ', JSON.stringify(data))
        if (data.type == 'console') {
            console.log(data.payload.msg)
        } else if (data.type == 'message') {
            messageHandler(data.payload.msg.response)
        } else if (data.type == 'reconnect') {
            endFunction = true;
        } else if (data.type == 'returnFetch') {
            const returnPacket = data.payload
            const returnType = data.payload.returnType;
            console.log('OrangeAddons - Recieved return packet: '+ returnType)
            if (returnType == 'staffCommands') {
                global.returnPacket.staffCommands(returnPacket.payload)
            }
            if (returnType == 'secretCount') {
                console.log('OrangeAddons - Secret Count: '+ returnPacket.amt)
                if (!global.returnPacket.secretCount[returnPacket.name]) return console.log('OrangeAddons - Invalid secret count return packet');

                global.returnPacket.secretCount[returnPacket.name].send(returnPacket.amt)
                console.log('OrangeAddons - Sent secret count to: '+ returnPacket.name)
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
export default socketHandler
