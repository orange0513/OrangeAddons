import settings from './settings.js';
import boot from './src/comms/socketHandler.js';
import global from './src/comms/internal.js';
import messageHandler from './src/handlers/message.js';
import RenderLibV2 from 'RenderLibV2';
import loadDungeonsModule from './src/features/dungeons/loadDungeons.js';
if (settings.load_dungeons_module == true) {
    loadDungeonsModule();
}
import loadAlertModule from './src/features/alerts/loadAlerts.js';
if (settings.load_alerts_module == true) {
    loadAlertModule();
}
import loadKuudraModule from './src/features/kuudra/loadKuudra.js';
if (settings.load_kuudra_module == true) {
    //loadKuudraModule();
}
import loadSoulflowModule from './src/features/alerts/stats/soulflow.js';
loadSoulflowModule();
import loadCommands from './src/features/commands/loadCommands.js';
loadCommands();
import loadSelfieRemoval from './src/features/misc/removeSelfie.js';
loadSelfieRemoval();
export default '';

// import loadRoutes from './src/features/dungeonRoutes/index.js';

// loadRoutes();

if (!FileLib.read("OrangeAddons","persists/partyFinder.json")) {
    FileLib.write("OrangeAddons","persists/partyFinder.json", JSON.stringify(
        ["cataLevel","secretsPerRun","roomsCleared","deaths","magicalPower","bloodMobKills","personalBests","shitterList","actionButtons","blank","armorEquip","goodItems"]
    ));
}