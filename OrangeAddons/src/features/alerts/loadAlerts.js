
import loadKatanaAlerts from "./items/katana";
import loadWitherCloakAlerts from "./items/witherCloak";
import loadIceSprayAlerts from "./items/witherCloak";
import loadGyroWandAlerts from "./items/gyroWand";
import loadHealingWandAlerts from "./items/healingWand";
import loadTubaAlerts from "./items/tuba";
function loadAlerts() {
    console.log('OrangeAddons - Loading Katana Alerts...')
    loadKatanaAlerts();
    console.log('OrangeAddons - Loading Wither Cloak Alerts...')
    loadWitherCloakAlerts();
    console.log('OrangeAddons - Loading Ice Spray Alerts...')
    loadIceSprayAlerts();
    console.log('OrangeAddons - Loading Gyro Wand Alerts...')
    loadGyroWandAlerts();
    console.log('OrangeAddons - Loading Healing Wand Alerts...')
    loadHealingWandAlerts();
    console.log('OrangeAddons - Loading Tuba Alerts...')
    loadTubaAlerts();
    console.log('OrangeAddons - Alerts Loaded!')
} 
export default loadAlerts;