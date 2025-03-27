import settings from "../../../../index";
import sleep from 'sleep';
function loadKatanaAlerts() {
	let soulcryactive = false;
    register('ActionBar', () => {
		if (settings.katana_alerts == true) {
			if (soulcryactive == false) {
				soulcryactive = true;
				sleep(4100, () => {
					soulcryactive = false;
					Client.showTitle("&cYour Katana has expired!", "", 0, 40, 10)
				});
			}
		}
	}).setCriteria(/.+\(Soulcry\).+/);
    
}
export default loadKatanaAlerts;