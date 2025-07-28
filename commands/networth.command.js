import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class networthCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "networth",
            aliases: [
                "nw",
            ],
        }, main);
        this.main = main;
    }

    execute(text) {
        this.main.socket.send({
            type: "command",
            payload: {
                command: 'networth',
                name: text || Player.getName(),
            }
        })
    }
}