import FileUtils from "../utils/file.js";
import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class purseLbCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "purselb",
            aliases: [],
        }, main);
        this.main = main;
    }

    execute() {
        this.main.socket.send({type: 'command-v2', payload: {command: 'purselb', payload: 
            this.main.helpers.getLobbyUUIDS()
        }});
    }
}