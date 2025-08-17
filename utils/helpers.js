/// <reference types="../../CTAutocomplete" />

/**
 * @typedef {import('../index.js').default} MainType
 */
export default class helpers {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        this.main = main;
        this.intervals = [];
        register('gameUnload', () => {
            this.intervals.forEach(interval => {
                interval.clear();
            });
        })
    }


    /**
     * @returns {string}
     * @description Generates a UUID without dashes.
     */
    generateUUID() {
        return java.util.UUID.randomUUID().toString().replace(/-/g, "");
    }

    /**
     * @param {number} min
     * @param {number} max
     * @returns {number}
     * @description Generates a random number between min and max.
     */
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @description Gets all UUIDS of players in  your lobby
     * @returns {string[]}
     */
    getLobbyUUIDS() {
        let names = []
        
        Player.getPlayer().field_71174_a.func_175106_d().forEach(player => { // get players from tab
        let profile = player.func_178845_a(); // getGameProfile
    
        if (player.func_178854_k() == '') return; // get display name
        try {
            const uuid = profile.getId().toString(); // get uuid
            if (typeof uuid !== 'string' || profile.getName().match(/^[0-9a-z]{10}$/) || profile.getName().match(/^\![A-Za-z]\-[A-Za-z]$/)) return; // getName
            names.push(uuid) 
        } catch (e) {
            console.error(e);
        }
        });
        if (!names.includes(Player.getUUID())) names.push(Player.getUUID());
        return names;
    }
    
    /**
     * @description Gets all names of players in  your lobby
     * @returns {string[]}
     */
    getLobbyNames() {
        let names = []
        
        Player.getPlayer().field_71174_a.func_175106_d().forEach(player => { // get players from tab
        let profile = player.func_178845_a(); // getGameProfile
    
        if (player.func_178854_k() == '') return; // get display name
        try {
            const name = profile.getName().toString();
            if (typeof name !== 'string' || profile.getName().match(/^[0-9a-z]{10}$/) || profile.getName().match(/^\![A-Za-z]\-[A-Za-z]$/)) return; // getName
            names.push(name) 
        } catch (e) {
            console.error(e);
        }
        });
        if (!names.includes(Player.getName())) names.push(Player.getName());
        return names;
    }


    /**
     * @param {Function} func
     * @param {number} time
     * @returns {Object}
     * @description Sets an interval similar to node.js setInterval
    */
    setInterval(func, time) {
        let cleared = false;
        function run() {
            if (cleared) return;
            func();
            setTimeout(run, time);
        }
        run();
        const interval = {
            clear: () => {
                cleared = true;
                this.intervals = this.intervals.filter(i => i !== interval);
            }
        };
        this.intervals.push(interval);
        return interval;
    }

}