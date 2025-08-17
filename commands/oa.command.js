import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class soaCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "oa",
            aliases: [
                "orangeaddons"
            ],
        }, main);
        this.main = main;
    }

    execute(text) {

        const cmd = text ? text.split(" ")[0] : null;
        if (!cmd)
            return this.main.settings.openSettingsMenu();
        const args = text ? text.split(" ").slice(1) : null;

        const command = this.main.commands.find((c) => c.name === cmd || c.aliases.includes(cmd) || ('oa_'+ cmd) === c.name || c.aliases.includes('oa_'+ cmd));
        if (!command) return ChatLib.chat(`&cUnknown subcommand. Use /oa help for a list of commands.`);

        command.execute(args ? args.join(" ") : null, cmd);
    }
}