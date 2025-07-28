import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class staffCommands extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: null,
            aliases: [ 
            ],
        }, main);
        this.main = main;
        this.main.staffCommands = this;
    }

    execute(text, command) {
        this.main.socket.send({
            type: "staffCommand",
            payload: {
                command: command,
                payload: text,
            }
        })
    }
}