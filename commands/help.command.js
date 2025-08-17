import FileUtils from "../utils/file.js";
import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class helpCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "oa_help",
            aliases: [],
        }, main);
        this.main = main;
    }

    execute() {
        this.main.MessageUtils.sendMessage(this.main.FileUtils.readJSON("/data/help.json"));
    }
}