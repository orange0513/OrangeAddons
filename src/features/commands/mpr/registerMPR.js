import global from '../../../comms/internal';
function loadMPRCommand() {
    register('command', (...args) => {
        const packet = {
            "type": "command",
            "payload": {
                "command": "mpr",
                "name": args[0],
                "floor": args[1]
            }
        }
        global.sendData.send(JSON.stringify(packet));
    }).setName('mpr')
    console.log('OrangeAddons - Loaded MPR Command!')
}
export default loadMPRCommand;