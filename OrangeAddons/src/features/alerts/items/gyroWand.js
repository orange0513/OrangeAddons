import sleep from 'sleep';
import settings from '../../../../settings';
function loadGyroWandAlerts() {
    let cellcount = 0;
    function cellalert() {
		if (settings.cells_alignment_alerts == true) {
			cellcount = cellcount+1;
			let localcellcount = cellcount;
			sleep(3000, () => {
				if (cellcount == localcellcount) {
					Client.showTitle("&eCells Alignment Expires Soon!", "", 0, 40, 0)
				}
				sleep (2400, () => {
					if (cellcount == localcellcount) {
						Client.showTitle("&cCells Alignment Has Expired!", "", 0, 40, 10)
					}
				});
			});
		}
	}
    register('ActionBar', () => {
		cellalert();
	}).setCriteria(/.+\(Cells Alignment\).+/);
	register('Chat', () => {
		cellalert();
	}).setCriteria(/([A-Za-z0-9_]+) casted Cells Alignment on you!/);
	
}
export default loadGyroWandAlerts;