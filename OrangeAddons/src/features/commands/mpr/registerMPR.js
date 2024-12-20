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
        global.socket.send(packet);
    }).setName('mpr')
    
}
export default loadMPRCommand;