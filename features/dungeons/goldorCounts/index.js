import axios from 'axios';

export default class goldorCounts {
    /**
     * @param {import('../../../index.js').default} main
     */
    constructor(main) {
        this.main = main;
        this.registers = [];

        register('Chat', () => {
                if (!this.main.settings.values.goldor_counts) return;
    
                let isF7 = ['m7','f7'].includes(Scoreboard.getLines()[4].toString().removeFormatting().split('(')?.[1]?.replace(')', ''));
    
                if (!isF7)  return;

                for (let register of this.registers) {
                    register.unregister();
                }
                this.registers = [];


                this.registers.push(
                    register("Chat", () => {
                        for (let tm of this.main.features.dungeons.dungeonStats.teammates) {
                            axios.get('https://api.orangeaddons.dev/rendername/' + tm).then((response) => {
                                this.main.MessageUtils.singleLine('&6&lOA - &6' + response.data + ` &r&6got &a${tm.counts.terminal} &r&6terminals, &a${tm.counts.lever} &r&6levers and &a${tm.counts.device} &r&6devices.`);
                            }).catch((error) => {
                                console.error(error);
                            });
                        }
                    }).setChatCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")
                )

                this.registers.push(
                    register("Chat", (...args) => {
                        const name = args[0];
                        const type = args[2];
                        const tm = this.main.features.dungeons.dungeonStats.teammates.find(t => t.name === name);
                        if (tm)
                            tm.counts[type] += 1;
                    }).setCriteria(/([a-zA-Z0-9_]+) (completed|activated) a (terminal|lever|device)! \(\d\/\d\)/)
                )
        }).setCriteria('Starting in 1 second.');
    }

}