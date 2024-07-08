import global from '../../../comms/internal';
function registerScan() {
    register('command', () => {
        let names = []
       // Object.keys(World.getAllPlayers()[0])
        World.getAllPlayers().forEach(player => {
        let displayName = player.getDisplayName();
        if (displayName.text !== '')
            names.push(player.getName()) 
        })
        global.sendData.send(JSON.stringify({type: 'oascan', payload: JSON.stringify(names)}))
    }).setName('scan');
}
export default registerScan;