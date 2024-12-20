import loadPfAlerts from "./modules/pfAlerts.js";
import loadpfGuiReader from "./modules/pfGuiReader.js";
import loadSecretsPerRun from "./modules/secretsPerRun.js";
import bm from '../bettermap/bm.js';
function loadDungeonsModule() {
    bm;
    
    loadPfAlerts();
    
    loadpfGuiReader();
    
    loadSecretsPerRun();
    

}
export default loadDungeonsModule;
