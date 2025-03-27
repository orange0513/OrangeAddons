import registerNetworth from './networth/registerNetworth.js';
import registerMPR from './mpr/registerMPR.js';
import registerCXPNeeded from './cxpneeded/registerCXPNeeded.js';
import registerXPNeeded from './xpneeded/registerXPNeeded.js';
import registerScan from './scan/registerScan.js';
import global from '../../comms/internal';
import messageHandler from '../../handlers/message.js';
import { getInfoMsg } from '../../comms/socketHandler.js';
import { refreshSettings, settings } from '../../../index.js';
function loadCommands() {
    
    registerNetworth();
    
    registerMPR();
    
    registerCXPNeeded();
    
    registerXPNeeded();
    
    registerScan();
    let v2Commands = [
        'badge',
        'cheapest',
        'oares',
        'oa_bug_report',
        'oa_shitter_report',
        'oa_suggest_feature',
        'oa_shitter_appeal',
        'oa_view_mail',
        'gems'
    ]

    v2Commands.forEach((command) => {
        register('command', (...args) => {
            let response = {
                type: 'command-v2',
                payload: {command: command, payload: args.join(' ')}
            }
            global.socket.send(response);
        }).setName(command,true);
    });

    register('command', () => {
        let names = []
    
        Player.getPlayer().field_71174_a.func_175106_d().forEach(player => { // get players from tab
        let profile = player.func_178845_a(); // getGameProfile

        if (player.func_178854_k() == ''); // get display name
        try {
            const uuid = profile.getId().toString(); // get uuid
            if (typeof uuid !== 'string' || profile.getName().match(/^[0-9a-z]{10}$/) || profile.getName().match(/^\![A-Za-z]\-[A-Za-z]$/)) return; // getName
            names.push(uuid) 
        } catch (e) {
            console.error(e);
        }
        })
        global.socket.send({type: 'command-v2', payload: {command: 'purselb', payload: names}});
    }).setName('purselb');;

    register('command', () => {
        global.socket.send({type: 'command-v2', payload: {command: 'downloadrooms', payload: {
            route: settings.route_developer_mode ? settings.editing_route : settings.use_route,
            overwrites: settings.route_developer_mode ? [] : JSON.parse(FileLib.read("OrangeAddons", "./persists/routeOverwrites.json"))
        }}});
    }).setName('downloadrooms');

    function maincmd(args) {
        if (args[0] === "settings" || args[0] === undefined) {
            refreshSettings(getInfoMsg());
            console.log(JSON.stringify(getInfoMsg()));
        } else if (args[0] === "help" || args[0] === 'h') {    
            const helpMessage = FileLib.read("OrangeAddons", "help.json");
            messageHandler(JSON.parse(helpMessage));
    
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
    
        } else if (args[0] === 'pf' || args[0] === 'editpf') {
            global.socket.send({type: 'command-v2', payload: {command: 'editpf', payload: FileLib.read("OrangeAddons","persists/partyFinder.json").toString()}});

        } else if (args[0].toLowerCase() === 'gui' || args[0].toLowerCase() === 'editgui') {
            global.editingUI = !global.editingUI;
            ChatLib.chat('&6&lOA - &aEditing UI, open chat and drag to move them, run /oa gui again to stop editing.')
        } else if (args[0].toLowerCase() === 'ping') {
            global.socket.send({type: 'command-v2', payload: {command: 'ping', payload: Date.now()}}, ping2);
        }  else if (args[0].toLowerCase() === 'routes') {
            global.socket.send({type: 'command-v2', payload: {command: 'routeBrowser', payload: {
                devMode: settings.route_developer_mode,
                editing: settings.editing_route,
                using: settings.use_route,
                overwrites: JSON.parse(FileLib.read("OrangeAddons", "./persists/routeOverwrites.json"))
            }}});
        } else 
            ChatLib.chat('&6&lOA - &6Unknown Command. type /oa help or /orangeaddons help')
        
    }
    register('command', (...args) => { maincmd(args) }).setName('oa');
    register('command', (...args) => { maincmd(args) }).setName('orangeaddons');


    function ping2(data) {
        ChatLib.chat(`&6&lOA - &aPing to OA Backend: ${Date.now() - data.ping}ms`);
    }



}
export default loadCommands;