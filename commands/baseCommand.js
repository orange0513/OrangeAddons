export default class BaseCommand {
    constructor(options, main) {
        this.name = options.name;
        this.aliases = options.aliases || [];
        this.loadCondition = options.loadCondition || (() => true);
        if (!this.loadCondition()) return;
        main.commands.push(this);
    }
}