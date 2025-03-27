import settings from "../../../../index";
import sleep from 'sleep';
function loadHealingWandAlerts() {
    let wandcount = 0
    register('ActionBar', () => {
		if (settings.healing_wand_alerts == true) {
			wandcount++;
			let localwandcount = wandcount;
				sleep(5800, () => {
					if (wandcount == localwandcount) {
						Client.showTitle("&cYour Healing Wand has expired!", "", 0, 40, 10)
					}
				});
		}

	}).setCriteria(/.+\((Small|Medium|Big|Huge) Heal\).+/);
	
}
export default loadHealingWandAlerts;