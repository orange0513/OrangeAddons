import BaseCommand from "./baseCommand";
/**
 * @typedef {import('../index.js').default} MainType
 */
export default class routesCommand extends BaseCommand {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        super({
            name: "oa_routes",
            aliases: [
                'oa_route'
            ],
        }, main);
        this.main = main;
    }

    execute() {
        this.main.socket.send({type: 'command-v2', payload: {command: 'routeBrowser', payload: {
            devMode: this.main.settings.values.route_developer_mode,
            editing: this.main.settings.values.editing_route,
            using: this.main.settings.values.use_route,
            overwrites: this.main.FileUtils.readJSON('/data/routeOverwrites.json'),
        }}});
    }
}