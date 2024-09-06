import loadPfAlerts from "./modules/pfAlerts.js";
import loadpfGuiReader from "./modules/pfGuiReader.js";
import loadSecretsPerRun from "./modules/secretsPerRun.js";
function loadDungeonsModule() {
    console.log('OrangeAddons - Loading Party Finder Alerts...')
    loadPfAlerts();
    console.log('OrangeAddons - Loading Party Finder Gui Reader...')
    loadpfGuiReader();
    console.log('OrangeAddons - Loading Secrets Per Run...')
    loadSecretsPerRun();
    console.log('OrangeAddons - Loaded Dungeon Module!')

}
export default loadDungeonsModule;
