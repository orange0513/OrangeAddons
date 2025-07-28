import BaseCommand from "./baseCommand.js";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class dungeonsCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "oa_dungeons",
            aliases: [
                'showpf'
            ],
        }, main);
        this.main = main;
    }

    execute(text) {
        const args = text.split(" ");
        ChatLib.simulateChat(`Party Finder > ${args[0] || Player.getName()} joined the dungeon group! (${args[1] || "Mage"} Level 1)`)
    }
}