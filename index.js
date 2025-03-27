import { setConfigValue, settings, settingsObj, refreshSettings } from './config.js';
export default settings;
export { settings, settingsObj, refreshSettings, setConfigValue };
import l from './load.js'
if (!FileLib.read("OrangeAddons","persists/partyFinder.json")) {
    FileLib.write("OrangeAddons","persists/partyFinder.json", JSON.stringify(
        ["cataLevel","secretsPerRun","roomsCleared","deaths","magicalPower","bloodMobKills","personalBests","shitterList","actionButtons","blank","armorEquip","goodItems"]
    ));
}