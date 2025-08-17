import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class editPfCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "oa_editpf",
            aliases: [
                "oa_pf"
            ],
        }, main);
        this.main = main;
    }

    execute() {
        this.main.socket.send({type: 'command-v2', payload: {command: 'editpf', payload: 
            this.main.FileUtils.read("/data/partyFinder.json")
        }});
    }
}