/// <reference types="../../CTAutocomplete" />

/**
 * @typedef {import('../index.js').default} MainType
 */
export default class SessionUtils {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        this.main = main;
        this.previousId = null;
    }

    getServerId() {
        if (this.previousId && this.previousId.generatedTime + 1000 * 60 * 1 > Date.now() && this.previousId.name === Player.getName()) {
            return this.previousId.serverId;
        }
        // from https://www.chattriggers.com/modules/v/IRC (thank you fork)
        const serverId = java.util.UUID.randomUUID().toString().replace(/-/g, "")
        try {
            Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId);
        } catch (e) {}
        this.previousId = {
            serverId,
            name: Player.getName(),
            generatedTime: Date.now()
        };
        return serverId;
    }
}