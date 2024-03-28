import global from '../../../comms/internal';
function registerCXPNeeded() {
    register('command', (...args) => {
        let lowLevel = args[0];
        let highLevel = args[1];
		if (args[1] == undefined) {
			highLevel = lowLevel;
            lowLevel = "name="+ Player.getName() +"";
		}
        const packet = {
            "type": "command",
            "payload": {
                "command": "cxpneeded",
                "lowLevel": lowLevel,
                "highLevel": highLevel
            }
        }
        global.sendData.send(JSON.stringify(packet));
	}).setName('cxpneeded')
    console.log('OrangeAddons - Loaded /cxpneeded Command!')
}
export default registerCXPNeeded;
