import registerNetworth from './networth/registerNetworth.js';
import registerMPR from './mpr/registerMPR.js';
import registerCXPNeeded from './cxpneeded/registerCXPNeeded.js';
import registerXPNeeded from './xpneeded/registerXPNeeded.js';
function loadCommands() {
    console.log('OrangeAddons - Loading Command: /networth && /nw')
    registerNetworth();
    console.log('OrangeAddons - Loading Command: /mpr')
    registerMPR();
    console.log('OrangeAddons - Loading Command: /cxpneeded')
    registerCXPNeeded();
    console.log('OrangeAddons - Loading Command: /xpneeded')
    registerXPNeeded();
    console.log('OrangeAddons - Loaded Commands!')

}
export default loadCommands;