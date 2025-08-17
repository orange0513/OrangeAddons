import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class v2Commands extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "badge",
            aliases: [
                //"cheapest",
                "oares",
                "oa_bug_report",
                "oa_shitter_report",
                "oa_suggest_feature",
                "oa_shitter_appeal",
                "oa_view_mail",
                "gems",
            ],
        }, main);
        this.main = main;
        this.main.v2Commands = this;
    }

    execute(text, command) {
        this.main.socket.send({
            type: "command-v2",
            payload: {
                command: command,
                payload: text,
            }
        })
    }
}