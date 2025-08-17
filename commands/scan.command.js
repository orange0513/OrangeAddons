import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class scanCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "scan",
            aliases: [
            ],
        }, main);
        this.main = main;
    }

    execute() {
        this.main.socket.send({
            type: "scan",
            payload: JSON.stringify(this.main.helpers.getLobbyUUIDS()),
        })
    }
}