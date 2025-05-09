import global from '../../../comms/internal';
function registerCXPNeeded() {
    register('command', (...args) => {
        let lowLevel = args[0];
        let highLevel = args[1];
        const packet = {
            "type": "command",
            "payload": {
                "command": "xpneeded",
                "lowLevel": lowLevel,
                "highLevel": highLevel
            }
        }
        global.socket.send(packet);
	}).setName('xpneeded')
    
}
export default registerCXPNeeded;
