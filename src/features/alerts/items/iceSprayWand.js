import settings from "../../../../index";
import sleep from 'sleep';
function loadIceSprayAlerts() {
    let icecount = 0;
    register('ActionBar', () => {
        if (icespraycd == false) {
            if (settings.ice_spray_alerts == true) {
                icecount = icecount+1;
                let localicecount = icecount;
                let allow = false
                function icespray(num) {
                    if (icecount == localicecount) {
                        if (num >= 4) {
                            Client.showTitle("&aIce Spray expiring in "+ num +" Seconds!", "", 0, 22, 0)
                            allow = true
                        } else if (num >= 2) {
                            Client.showTitle("&eIce Spray expiring in "+ num +" Seconds!", "", 0, 22, 0)
                            allow = true
                        } else if (num == 1) {
                            Client.showTitle("&cIce Spray expiring in "+ num +" Second!", "", 0, 22, 0)
                            allow = true
                        } else if (num == 0) {
                            Client.showTitle("&cIce Spray expired!", "", 0, 22, 0)
                            allow = false
                        }
                    }
                    let newnum = num-1;
                    sleep(1000, () => {
                        if (allow) icespray(newnum)
                    });
    
                }
                icespray(5);
                icespraycd = true;
                sleep(3000, () => {
                    icespraycd = false
                });
            }
        }
    }).setCriteria(/.+\(Ice Spray\).+/);
    
}
export default loadIceSprayAlerts;