import axios from "axios";
import messageHandler from "../../../handlers/message";
import global from "../../../comms/internal";
function registerStaffCommands(settings) {
    console.log('OrangeAddons - Loading Staff Commands...')
    let URL = "https://api.orange0513.com/hypixel/staff_commands"
    axios.get(URL, {
        headers: {
            "User-Agent": "Mozilla/5.0 (CT - OrangeAddons)",
            "OA": true,
            "OA-V": 2,
            "user": Player.getName(),
            "auth": ""+ Player.getName() +"-"+ Date.now()
        }
    }).then((res) => {
        let commands = res.data
        Object.keys(commands).forEach((i) => {
            const name = commands[i]
            console.log('OrangeAddons - Loading Staff Command: '+ name)
            register('command', (...args) => {
                let head = '/'+ name + " "+ args.join(" ")
                console.log('Sending command to server: ' + head)
                axios.get(`https://api.orange0513.com/hypixel/staff/`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (CT - OrangeAddons)",
                        "OA": true,
                        "OA-V": 2,
                        "command": head,
                        "user": Player.getName(),
                        "auth": ""+ Player.getName() +"-"+ Date.now()
                    }
                }).then(response => {
                    let finaldata = response.data;
                    messageHandler(finaldata)
                }).catch(error => {
                    print("error: "+ error.toString());
                })
            }).setName(name)
            console.log('OrangeAddons - Loaded Staff Command: '+ name)

        })
        console.log('OrangeAddons - Loaded Staff Commands!')
    })
    function backendCheck() {
        setTimeout(() => {
            if (global.sendData.check() == true) {
                const packet = {
                    type: 'fetch',
                    payload: 'staffCommands'
                }
                global.sendData.send(JSON.stringify(packet));
                function returnData(data) {
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
            } else {
                setTimeout(() => {
                    backendCheck()
                }, 1000);
            }
        }, 5000);
    }
    backendCheck()
}
export default registerStaffCommands;