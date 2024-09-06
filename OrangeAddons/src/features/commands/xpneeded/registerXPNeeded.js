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
        global.sendData.send(JSON.stringify(packet));
	}).setName('xpneeded')
    console.log('OrangeAddons - Loaded /xpneeded Command!')
}
export default registerCXPNeeded;
