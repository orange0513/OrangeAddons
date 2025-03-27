import settings from "../../../../index";
import sleep from 'sleep';
function loadWitherCloakAlerts() {
    register('chat', (...args) => {
		if (settings.wither_cloak_alerts == true) {
			Client.showTitle("&cYour Wither Cloak Disabled!", "", 0, 40, 10)
		}
	}).setCriteria(/(Creeper Veil De-activated! \(Expired\)|Not enough mana! Creeper Veil De-activated!)/)
    
}
export default loadWitherCloakAlerts;
