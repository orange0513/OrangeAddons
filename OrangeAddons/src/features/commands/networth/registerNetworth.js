import global from '../../../comms/internal';
function registerNetworth() {
    function networth(name) {
        let response = {
            type: 'command',
            payload: {command: 'networth', name: name}
        }
        global.sendData.send(JSON.stringify(response));
    }
    setTimeout(() => {
        register('command', (...args) => {
            let name = args[0];
            if (name == undefined) name = Player.getName();
            networth(name);
        }).setName('networth',true)
        register('command', (...args) => {
            let name = args[0];
            if (name == undefined) name = Player.getName();
            networth(name);
        }).setName('nw',true)
    }, 1000); // sbe stinks and overwrites this if i dont timeout
}


export default registerNetworth;