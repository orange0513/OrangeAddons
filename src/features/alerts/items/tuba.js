import settings from "../../../../index";
import sleep from 'sleep';
function loadTubaAlerts() {
	let howlactive = false;
    register('ActionBar', () => {
		if (settings.weird_tuba_alerts == true) {
			if (howlactive == false) {
				howlactive = true;
				let item = Player.getHeldItem().getName();
				if (/.+Weirder.+Tuba/.test(item) == true) {
					sleep(30000, () => {
						howlactive = false;
						Client.showTitle("&cYour Weirder Tuba has expired!", "", 0, 40, 10)
					});
				} else {
					sleep(20000, () => {
						howlactive = false;
						Client.showTitle("&cYour Weird Tuba has expired!", "", 0, 40, 10)
					});
				}
			}
		}
	}).setCriteria(/.+\(Howl\).+/);
	
}
export default loadTubaAlerts;