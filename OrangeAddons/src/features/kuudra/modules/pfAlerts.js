import api from '../../../comms/legacy_backend.js';
import messageHandler from '../../../handlers/message.js';
import axios from 'axios';
import settings from '../../../../settings';
import global from '../../../comms/internal';
function loadPfAlerts() {
    register('chat', (...args) => {
        function displaystats() {
            if (settings.party_finder == true) {
                ChatLib.chat('&6&lOA - &r&aFetching stats for ' + args[0])
                try {
                    JSON.parse(settings.kuudra_party_finder_items)
                } catch (e) {
                    ChatLib.chat('&6&lOA - &r&cInvalid KuudraParty Finder Items. resetting them to default')
                    settings.kuudra_party_finder_items = '["HYPERION"]'
                }
                let allitems = JSON.parse(settings.kuudra_party_finder_items)
                let embededsettings = {
                    "items": allitems,
                }
                let forward = JSON.stringify(embededsettings);
                
                const packet = {
                    type: "kuudraPartyFinder",
                    payload: {
                        name: args[0],
                        settings: forward
                    }
                }
                global.socket.send(packet);
            }
        }
        if (args[0] != Player.getName()) {
            displaystats()
        } else if (settings.show_own_stats_in_kuudra_party_finder == true) {
            displaystats()
        }
    }).setCriteria(/Party Finder > ([A-Za-z0-9_]{2,16}) joined the group! \(Combat Level \d+\)/)
    
}
export default loadPfAlerts;