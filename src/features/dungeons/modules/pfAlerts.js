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
                    JSON.parse(settings.party_finder_items)
                } catch (e) {
                    ChatLib.chat('&6&lOA - &r&cInvalid Party Finder Items. resetting them to default')
                    settings.party_finder_items = '[     "HYPERION",     "SCYLLA",     "ASTRAEA",     "VALKYRIE",     "NECRON_BLADE",     "DARK_CLAYMORE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS",     "SPEED_WITHER_HELMET",     "SPEED_WITHER_CHESTPLATE",     "SPEED_WITHER_LEGGINGS",     "SPEED_WITHER_BOOTS",     "SPRING_BOOTS",     "JERRY_STAFF",     "DIAMOND_PICKAXE",     "ALPHA_PICK",     "STONK" ]'
                }
                try {
                    JSON.parse(settings.healer_party_finder_items)
                } catch (e) {
                    ChatLib.chat('&6&lOA - &r&cInvalid Healer Party Finder Items. resetting them to default')
                    settings.party_finder_items = '[     "TERMINATOR",     "SOUL_WHIP",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]'
                }
                try {
                    JSON.parse(settings.mage_party_finder_items)
                } catch (e) {
                    ChatLib.chat('&6&lOA - &r&cInvalid Mage Party Finder Items. resetting them to default')
                    settings.party_finder_items = '[     "DARK_CLAYMORE",     "WISE_WITHER_HELMET",     "WISE__WITHER_CHESTPLATE",     "WISE_WITHER_LEGGINGS",     "WISE_WITHER_BOOTS",     "LAST_BREATH",     "RAGNAROCK_AXE" ]'
                }
                try {
                    JSON.parse(settings.berserk_party_finder_items)
                } catch (e) {
                    ChatLib.chat('&6&lOA - &r&cInvalid Berserk Party Finder Items. resetting them to default')
                    settings.party_finder_items = '[     "TERMINATOR",     "DARK_CLAYMORE",     "RAGNAROCK_AXE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]'
                }
                try {
                    JSON.parse(settings.archer_party_finder_items)
                } catch (e) {
                    ChatLib.chat('&6&lOA - &r&cInvalid Archer Party Finder Items. resetting them to default')
                    settings.party_finder_items = '[     "TERMINATOR",     "RAGNAROCK_AXE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]'
                }
                try {
                    JSON.parse(settings.tank_party_finder_items)
                } catch (e) {
                    ChatLib.chat('&6&lOA - &r&cInvalid Tank Party Finder Items. resetting them to default')
                    settings.tank_party_finder_items = '[     "TERMINATOR",     "TANK_WITHER_HELMET",     "TANK_WITHER_CHESTPLATE",     "TANK_WITHER_LEGGINGS",     "TANK_WITHER_BOOTS",     "LAST_BREATH",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS",     "SOUL_WHIP",     "AXE_OF_THE_SHREDDED" ]'
                }
                let dclass = args[1].toLowerCase()
                let allitems = JSON.parse(settings.party_finder_items)
                if (dclass == "berserk") {
                    let berserkitems = JSON.parse(settings.berserk_party_finder_items)
                    allitems = allitems.concat(berserkitems)
                } else if (dclass == "mage") {
                    let mageitems = JSON.parse(settings.mage_party_finder_items)
                    allitems = allitems.concat(mageitems)
                } else if (dclass == "healer") {
                    let healeritems = JSON.parse(settings.healer_party_finder_items)
                    allitems = allitems.concat(healeritems)
                } else if (dclass == "archer") {
                    let archeritems = JSON.parse(settings.archer_party_finder_items)
                    allitems = allitems.concat(archeritems)
                } else if (dclass == "tank") {
                    let tankitems = JSON.parse(settings.tank_party_finder_items)
                    allitems = allitems.concat(tankitems)
                }
                let embededsettings = {
                    "shitter_list": settings.shitter_list,
                    "mobs_per_run": settings.mobs_per_run,
                    "catalevel": settings.cata_level,
                    "death_count": settings.death_count,
                    "secret_count": settings.secret_count,
                    "blood_mob_kills": settings.blood_mob_count,
                    "c50date": settings.cata_50_date,
                    "upets": settings.unique_pets,
                    "fmprfloor": settings.party_finder_floor,
                    "items": JSON.stringify(allitems),
                    "pbests": settings.personal_bests,
                    "ecbp": settings.ender_chest_and_backpack_shown,
                }
                let forward = JSON.stringify(embededsettings);
                console.log('Fetching stats for ' + args[0] + ' with settings: ' + forward)
                const packet = {
                    type: "partyFinder",
                    payload: {
                        name: args[0],
                        settings: forward
                    }
                }
                global.sendData.send(JSON.stringify(packet))
            }
        }
        if (args[0] != Player.getName()) {
            displaystats()
        } else if (settings.show_own_stats_in_party_finder == true) {
            displaystats()
        }
    }).setCriteria(/Party Finder > ([A-Za-z0-9_]{2,16}) joined the dungeon group! \((Mage|Tank|Berserk|Healer|Archer) Level \d+\)/)
    console.log('OrangeAddons - Loaded Party Finder Alerts!')
}
export default loadPfAlerts;