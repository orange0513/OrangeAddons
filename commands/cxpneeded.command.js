import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class cataXPNeededCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "cxpneeded",
            aliases: [
                "cataxpneeded",
                "cxp",
            ],
        }, main);
        this.main = main;
    }

    execute(text) {
        const args = text.split(" ");
        let lowLevel = args[0];
        let highLevel = args[1];
		if (args[1] == undefined) {
			highLevel = lowLevel;
            lowLevel = "name="+ Player.getName() +"";
		}
        this.main.socket.send({
            type: "command",
            payload: {
                command: 'cxpneeded',
                lowLevel: lowLevel,
                highLevel: highLevel,
            }
        })
    }
}