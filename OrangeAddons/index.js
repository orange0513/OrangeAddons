import settings from './settings.js';
import boot from './src/comms/socketHandler.js';
import global from './src/comms/internal.js';
// setTimeout(() => {
//     function heartBeat() {
//         const packet = {
//             type: 'heartbeat',
//             payload: {}
//         }
//         try {
//             global.sendData.send(JSON.stringify(packet));
//         } catch (e) {
//         }
//         timeout = setTimeout(() => {
//             heartBeat();
//         }, 5000);
//     }
//     let timeout = setTimeout(() => {
//         heartBeat();
//     }, 5000);
//     register('gameUnload', () => {
//         clearTimeout(timeout);
//     });
// }, 10000);
let settingsOpen = false;
function maincmd(args) {
    if (args[0] == "settings") {
        setTimeout(() => {
            settingsOpen = true;
        }, 75);
        settings.openGUI();
    } else if (args[0] == "help" || args[0] == undefined) {
        ChatLib.chat('&6Welcome to the OrangeAddons, the available commands are listed below (more coming soon):::::');
        ChatLib.chat('&6Orange Addons Discord: https://discord.gg/cdXGmFKbTS');
        ChatLib.chat(' &a/oa settings');
                ChatLib.chat('    &eOpens the settings menu');
        ChatLib.chat(' &a/mpr (name) (floor)');
        ChatLib.chat('    &eExample: /mpr orange0513 f1');
        ChatLib.chat('    &eChecks a persons Mobs/Run for a floor');
        ChatLib.chat(' &a/cheapest (item) (attribute) (lowest you wanna buy) (level you have) (level you want)');
        ChatLib.chat('    &eExample: /cheapest boots mp 4 8 10');
        ChatLib.chat('    &eExample 2: /cheapest molten_bracelet vit 5 5 7');
        ChatLib.chat('    &eFinds the cheapest attributes needed to upgrade an item');
        ChatLib.chat(' &a/xpneeded # #');
        ChatLib.chat('    &eExample: /xpneeded 50.10 60');
        ChatLib.chat('    &eShows how much skill xp you need to get from level 50.10 to 60. ');
        ChatLib.chat(' &a/cxpneeded # #');
        ChatLib.chat('    &eExample: /cxpneeded 40.10 50');
        ChatLib.chat('    &eShows how much catacombs xp you need to get from level 40.10 to 50. ');
        ChatLib.chat(' &a/networth (name)');
        ChatLib.chat('    &eExample: /networth orange0513');
        ChatLib.chat('    &eShows a players networth');
        ChatLib.chat('    &e&lNetworth calculations are provided by SkyHelper')
        ChatLib.chat(' &a/oa items dungeons (class or all) [action] [item]');
        ChatLib.chat('    &eExample: /oa items dungeons healer add HYPERION // adds to healer list');
        ChatLib.chat('    &eExample 2: /oa items dungeons all remove HYPERION // removes from global list');
        ChatLib.chat('    &eExample 3: /oa items dungeons mage // shows all mage items');
        ChatLib.chat('    &eManages the items you want to see in the dungeons party finder module');
        ChatLib.chat(' &a/scan');
        ChatLib.chat('    &eScans the lobby for exotics in the OA Item DB');
        ChatLib.chat(' &a/cookie')
        ChatLib.chat('    &eCookie Clicker for all OA Users!')
        ChatLib.chat(' &a/badge')
        ChatLib.chat('    &eChange ur badge')

    } else if (args[0].toLowerCase() == "setbackend") {
        if (args[1] == undefined) {
            FileLib.write("OrangeAddons", "/src/comms/connection.json", JSON.stringify({backend: "dev.api.orange0513.com"}));
            ChatLib.chat('&6&lOA - &6Changed Backend Address to: dev.api.orange0513.com')
            ChatLib.chat('&6&lOA - &cYou must /ct load to apply changes.')
            return;
        }
        FileLib.write("OrangeAddons", "/src/comms/connection.json", JSON.stringify({backend: args[1]}));
        ChatLib.chat('&6&lOA - &6Changed Backend Address to: '+ args[1])
        ChatLib.chat('&6&lOA - &cYou must /ct load to apply changes.')
    } else if (args[0].toLowerCase() === "items") {
        if (args[1].toLowerCase() === "dungeons") {
            if (args[2] == undefined) {
                ChatLib.chat('&6&lOA - &6Usage: /oa items dungeons (class or all) [action] [item]')
            } else {
                if (/healer|mage|berserk|archer|tank|all/.test(args[2].toLowerCase())) {
                    let name = "party_finder_items";
                    if (args[2].toLowerCase() !== "all") {
                        name = args[2].toLowerCase() + "_party_finder_items";
                    }
                    if (args[3] == undefined) {
                        ChatLib.chat('&6&lOA - &a' + args[2].toLowerCase() + ' Items:');
                        const items = JSON.parse(settings[name]);
                        Object.keys(items).forEach((name, i) => {
                            ChatLib.chat('&6&lOA - &a' + items[i]);
                            ChatLib.chat('     &eRemove with: &7/oa items dungeons ' + args[2].toLowerCase() + ' remove ' + items[i]);
                        });
                    } else if (args[3].toLowerCase() === "add") {
                        if (args[4] == undefined) {
                            ChatLib.chat('&6&lOA - &6Usage: /oa items dungeons '+ args[2].toLowerCase() +' add [item]')
                        } else {
                            let items = JSON.parse(settings[name]);
                            if (items.includes(args[4].toUpperCase())) {
                                ChatLib.chat('&6&lOA - &6Item already in ' + args[2].toLowerCase() + ' items.')
                            } else {
                                items.push(args[4].toUpperCase());
                                settings[name] = JSON.stringify(items);
                                ChatLib.chat('&6&lOA - &aAdded ' + args[4].toUpperCase() + ' to ' + args[2].toLowerCase() + ' items.')
                            }
                        }
                    } else if(args[3].toLowerCase() === "remove") {
                        if (args[4] == undefined) {
                            ChatLib.chat('&6&lOA - &6Usage: /oa items dungeons '+ args[2].toLowerCase() +' remove [item]')
                        } else {
                            let items = JSON.parse(settings[name]);
                            if (items.includes(args[4].toUpperCase())) {
                                items = items.filter(item => item !== args[4].toUpperCase());
                                settings[name] = JSON.stringify(items);
                                ChatLib.chat('&6&lOA - &aRemoved ' + args[4].toUpperCase() + ' from ' + args[2].toLowerCase() + ' items.')
                            } else {
                                ChatLib.chat('&6&lOA - &6' + args[4].toUpperCase() + ' is not in ' + args[2].toLowerCase() + ' items');
                            }
                        }
                    
                    } else {
                        ChatLib.chat('&6&lOA - &6Unknown Action, /oa items dungeons (class or all) [action] [item]')
                        ChatLib.chat('&6&lOA - &6Actions: add, remove')
                    }
                } else {
                    ChatLib.chat('&6&lOA - &6Unknown Class, /oa items dungeons (class or all) [action] [item]')
                    ChatLib.chat('&6&lOA - &6Classes: healer, mage, berserk, archer, tank, all')
                }
            }
        } else if (args[1].toLowerCase === "") {

        } else {
            ChatLib.chat('&6&lOA - &6Unknown Item List, /oa items dungeons or /oa items kuudra')
        }

    }else { 
        ChatLib.chat('&6&lOA - &6Unknown Command. type /oa help or /orangeaddons help')
    }
}
register('command', (...args) => { maincmd(args) }).setName('oa');
register('command', (...args) => { maincmd(args) }).setName('orangeaddons');
import loadDungeonsModule from './src/features/dungeons/loadDungeons.js';
if (settings.load_dungeons_module == true) {
    console.log('OrangeAddons - Loading Dungeons Module...')
    loadDungeonsModule();
}
import loadAlertModule from './src/features/alerts/loadAlerts.js';
if (settings.load_alerts_module == true) {
    console.log('OrangeAddons - Loading Alerts Module...')
    loadAlertModule();
}
import loadKuudraModule from './src/features/kuudra/loadKuudra.js';
if (settings.load_kuudra_module == true) {
    //console.log('OrangeAddons - Loading Kuudra Module...')
    //loadKuudraModule();
}
import loadBetterMapModule from './src/features/hooks/betterMap.js';
function betterMapCheck() {
    const File = java.io.File;

    const exists = new File(Config.modulesFolder).listFiles().find(module => {
    return module.getName() === "BetterMap";
    });
    if (exists) {
        console.log('OrangeAddons - Loading BetterMap Hook...')
        loadBetterMapModule();
    }
}
betterMapCheck();
import loadSoulflowModule from './src/features/alerts/stats/soulflow.js';
console.log('OrangeAddons - Loading Soulflow Module...')
loadSoulflowModule();
import loadCommands from './src/features/commands/loadCommands.js';
console.log('OrangeAddons - Loading Commands...')
loadCommands();
import loadSelfieRemoval from './src/features/misc/removeSelfie.js';
loadSelfieRemoval();
console.log('OrangeAddons - Loading Socket...')
boot();
export default '';

//register('GuiClosed', () => {
   // if (settingsOpen == true) {
    //    settingsOpen = false;
    //    settings.save();
   // }
//})
//function saveConfig() {
   // settings.save();
   // setTimeout(() => {
   //     saveConfig();
   // }, 10000);
//}
//saveConfig();