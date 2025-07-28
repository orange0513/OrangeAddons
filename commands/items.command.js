import FileUtils from "../utils/file.js";
import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class itemsCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "oa_items",
            aliases: [
                'oa_item'
            ],
        }, main);
        this.main = main;
    }

    execute(data) {
        const args = data.split(" ");
        //ChatLib.chat('Will be implemented later');
        if (args[0] === "dungeons") {
            if (args[1] === undefined) return ChatLib.chat('&6&lOA - &6Usage: /oa items dungeons [class | all] [add | remove] [Item ID]');

            if (/healer|mage|berserk|archer|tank|all/.test(args[1].toLowerCase())) {
                let name = "party_finder_items";
                if (args[1].toLowerCase() !== "all") {
                    name = args[1].toLowerCase() + "_party_finder_items";
                }
                if (args[2] == undefined) {
                    ChatLib.chat('&6&lOA - &a' + args[2].toLowerCase() + ' Items:');
                    const items = JSON.parse(settings[name]);
                    Object.keys(items).forEach((name, i) => {
                        ChatLib.chat('&6&lOA - &a' + items[i]);
                        ChatLib.chat('     &eRemove with: &7/oa items dungeons ' + args[1].toLowerCase() + ' remove ' + items[i]);
                    });
                } else if (args[2].toLowerCase() === "add") {
                    if (args[3] == undefined) {
                        ChatLib.chat('&6&lOA - &6Usage: /oa items dungeons '+ args[1].toLowerCase() +' add [item]')
                    } else {
                        let items = JSON.parse(this.main.settings.values[name]);
                        if (items.includes(args[3].toUpperCase())) {
                            ChatLib.chat('&6&lOA - &6Item already in ' + args[1].toLowerCase() + ' items.')
                        } else {
                            items.push(args[3].toUpperCase());
                            this.main.settings.setValue(name) = JSON.stringify(items);
                            ChatLib.chat('&6&lOA - &aAdded ' + args[3].toUpperCase() + ' to ' + args[1].toLowerCase() + ' items.')
                        }
                    }
                } else if(args[2].toLowerCase() === "remove") {
                    if (args[3] == undefined) {
                        ChatLib.chat('&6&lOA - &6Usage: /oa items dungeons '+ args[1].toLowerCase() +' remove [item]')
                    } else {
                        let items = JSON.parse(this.main.settings.values[name]);
                        if (items.includes(args[3].toUpperCase())) {
                            items = items.filter(item => item !== args[3].toUpperCase());
                            this.main.settings.setValue(name) = JSON.stringify(items);
                            ChatLib.chat('&6&lOA - &aRemoved ' + args[3].toUpperCase() + ' from ' + args[1].toLowerCase() + ' items.')
                        } else {
                            ChatLib.chat('&6&lOA - &6' + args[3].toUpperCase() + ' is not in ' + args[1].toLowerCase() + ' items');
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
        } else {
            ChatLib.chat('&6&lOA - &6Unknown Item List, /oa items dungeons (class or all) [add | remove] [item id]')
        }
    }
}