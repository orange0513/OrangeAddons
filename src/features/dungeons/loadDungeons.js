import loadPfAlerts from "./modules/pfAlerts.js";
import loadpfGuiReader from "./modules/pfGuiReader.js";
import loadSecretsPerRun from "./modules/secretsPerRun.js";
import autoKick from "./autoKick.js";
import bm from '../bettermap/bm.js';
function loadDungeonsModule() {    
    loadPfAlerts();
    
    loadpfGuiReader();
    
    loadSecretsPerRun();

    autoKick();

    

}
export default loadDungeonsModule;
