import global from '../../../comms/internal';
function registerScan() {
    register('command', () => {
        let names = []
    
        World.getAllPlayers().forEach(player => {
        if (player.getDisplayName() == '') return;
        try {
            const uuid = player.getUUID().toString();
            if (typeof uuid !== 'string' || player.getName().match(/^[0-9a-z]{10}$/)) return;
            names.push(uuid) 
        } catch (e) {
        }
        })
        global.sendData.send(JSON.stringify({type: 'oascan', payload: JSON.stringify(names)}))
    }).setName('scan');
}
export default registerScan;