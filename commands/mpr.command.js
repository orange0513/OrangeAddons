import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class mprCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "mpr",
            aliases: [
                "mobsperrun"
            ],
        }, main);
        this.main = main;
    }

    execute(text) {
        const args = text.split(" ");
        this.main.socket.send({
            type: "command",
            payload: {
                command: 'mpr',
                name: args[0],
                floor: args[1]
            }
        })
    }
}