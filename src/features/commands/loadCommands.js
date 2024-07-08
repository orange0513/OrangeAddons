import registerNetworth from './networth/registerNetworth.js';
import registerMPR from './mpr/registerMPR.js';
import registerCXPNeeded from './cxpneeded/registerCXPNeeded.js';
import registerXPNeeded from './xpneeded/registerXPNeeded.js';
import registerScan from './scan/registerScan.js';
import global from '../../comms/internal';
function loadCommands() {
    console.log('OrangeAddons - Loading Command: /networth && /nw')
    registerNetworth();
    console.log('OrangeAddons - Loading Command: /mpr')
    registerMPR();
    console.log('OrangeAddons - Loading Command: /cxpneeded')
    registerCXPNeeded();
    console.log('OrangeAddons - Loading Command: /xpneeded')
    registerXPNeeded();
    console.log('OrangeAddons - Loading Command: /scan')
    registerScan();
    console.log('OrangeAddons - Loaded Commands!')
    register('command', (...args) => {
        let response = {
            type: 'command-v2',
            payload: {command: 'cookie', payload: args.join(' ')}
        }
        global.sendData.send(JSON.stringify(response));
    }).setName('cookie',true);
    register('command', (...args) => {
        let response = {
            type: 'command-v2',
            payload: {command: 'badge', payload: args.join(' ')}
        }
        global.sendData.send(JSON.stringify(response));
    }).setName('badge',true);
    register('command', (...args) => {
        let response = {
            type: 'command-v2',
            payload: {command: 'oares', payload: args.join(' ')}
        }
        global.sendData.send(JSON.stringify(response));
    }).setName('oares',true);


}
export default loadCommands;