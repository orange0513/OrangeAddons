import { registerWhen } from '../../../../BloomCore/utils/Utils';

export default class autoKick {
    /**
     * @param {import('../../../index.js').default} main
     */
    constructor(main) {
        this.main = main;
        registerWhen(register('chat', (...args) => {
            console.log(JSON.stringify(args, null, 2)); // remove line on release   
            if (args[0] === Player.getName()) return;
    
            main.socket.send({
                    type: "autoKick",
                    payload: {
                        name: args[0],
                        shitterKick: main.settings.values.auto_kick_shitters,
                        PBKickEnabled: main.settings.values.auto_kick_from_pb && main.settings.values[`${main.settings.values.party_finder_floor.toLowerCase()}_pb_kick_threshold`] !== "0",
                        PBKickTime: main.settings.values[`${main.settings.values.party_finder_floor.toLowerCase()}_pb_kick_threshold`],
                        PBKickFloor: main.settings.values.party_finder_floor
                    }
    
                }
            ).then((data) => {
                console.log(JSON.stringify(data, null, 2)); // remove line on release
                if (data.kick) {
                    switch (data.kickReason) {
                        case "shitter":
                            ChatLib.chat('&6&lOA - &r&cKicking ' + args[0] + ' for being a shitter');
    
                            if (main.settings.values.party_message_on_shitter_kick)
                                ChatLib.command(`pc ${
                                    main.settings.values.shitter_kick_message.replace(/{name}/g, args[0])
                                }`);
                            
                            setTimeout(() => {
                                ChatLib.command(`p kick ${args[0]}`);
                            }, main.settings.values.party_message_on_shitter_kick ? 1750 : 0);
                            break;
                        
                        case "PB":
                            ChatLib.chat('&6&lOA - &r&cKicking ' + args[0] + ' for being having a PB of '+ data.pb);
    
    
                            if (
                                main.settings.values.party_message_on_pb_kick && 
                                (
                                    (!/{pb}/.test(main.settings.values.pb_kick_message) || /^((\d+m\s\d+s)|(\d+s))$/.test(data.pb)) &&
                                    (!/{req}/.test(main.settings.values.pb_kick_message) || /^((\d+m\s\d+s)|(\d+s))$/.test(data.req))
                                )
                            )
                                ChatLib.command(`pc ${
                                    main.settings.values.pb_kick_message
                                    .replace(/{name}/g, args[0])
                                    .replace(/{pb}/g, data.pb)
                                    .replace(/{req}/g, data.req)
                                }`);
                            
                            setTimeout(() => {
                                ChatLib.command(`p kick ${args[0]}`);
                            }, main.settings.values.party_message_on_pb_kick ? 1750 : 0);
                            break;
                    }
    
                }
            });
        }).setCriteria(/^Party Finder > ([A-Za-z0-9_]{2,16}) joined the dungeon group! \((Mage|Tank|Berserk|Healer|Archer) Level \d+\)$/),
        () => main.settings.values.auto_kick_shitters || main.settings.values.auto_kick_from_pb 
        )
    }
}
