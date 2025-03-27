/// <reference types="../../../../CTAutocomplete" />

import global from '../../comms/internal';
import settings from '../../../index';
export default function autoKick() {
    register('chat', (...args) => {
        if (!settings.auto_kick_shitters || !settings.auto_kick_from_pb) return;
        if (args[0] === Player.getName()) return;
        ChatLib.chat('&6&lOA - &r&cChecking ' + args[0] + ' for auto kick eligibility'); // remove this line on release
        function returnData(data) {
            if (data.kick) {
                switch (data.kickReason) {
                    case "shitter":
                        ChatLib.chat('&6&lOA - &r&cKicking ' + args[0] + ' for being a shitter');

                        if (settings.party_message_on_shitter_kick)
                            ChatLib.command(`pc ${
                                settings.shitter_kick_message.replace(/{name}/g, args[0])
                            }`);
                        
                        setTimeout(() => {
                            ChatLib.command(`p kick ${args[0]}`);
                        }, settings.party_message_on_shitter_kick ? 1750 : 0);
                        break;
                    
                    case "PB":
                        ChatLib.chat('&6&lOA - &r&cKicking ' + args[0] + ' for being having a PB of '+ data.pb);


                        if (
                            settings.party_message_on_pb_kick && 
                            (
                                (!/{pb}/.test(settings.pb_kick_message) || /^((\d+m\s\d+s)|(\d+s))$/.test(data.pb)) &&
                                (!/{req}/.test(settings.pb_kick_message) || /^((\d+m\s\d+s)|(\d+s))$/.test(data.req))
                            )
                        )
                            ChatLib.command(`pc ${
                                settings.pb_kick_message
                                .replace(/{name}/g, args[0])
                                .replace(/{pb}/g, data.pb)
                                .replace(/{req}/g, data.req)
                            }`);
                        
                        setTimeout(() => {
                            ChatLib.command(`p kick ${args[0]}`);
                        }, settings.party_message_on_pb_kick ? 1750 : 0);
                        break;
                }

            }

        };

        global.socket.send({
                type: "autoKick",
                payload: {
                    name: args[0],
                    shitterKick: settings.auto_kick_shitters,
                    PBKickEnabled: settings.auto_kick_from_pb && settings[`${settings.party_finder_floor.toLowerCase()}_pb_kick_threshold`] !== "0",
                    PBKickTime: settings[`${settings.party_finder_floor.toLowerCase()}_pb_kick_threshold`],
                    PBKickFloor: settings.party_finder_floor
                }

            },
                returnData
        )
    }).setCriteria(/^Party Finder > ([A-Za-z0-9_]{2,16}) joined the dungeon group! \((Mage|Tank|Berserk|Healer|Archer) Level \d+\)$/)
}