/// <reference types="../../../../../CTAutocomplete" />
import sleep from 'sleep';
import settings from '../../../../index';
import global from '../../../comms/internal';
import axios from 'axios';
import { singleLine } from '../../../handlers/message';
import DungeonScanner from "../../../../../tska/skyblock/dungeon/DungeonScanner";

function loadSecretsPerRun() {
    let dungeonactive = false;
    let teammates = {};

    let registers = [];
    let isF7 = false;
    // 'Starting in 1 second.' trigger
    register('Chat', () => {
        console.log(JSON.stringify(DungeonScanner.players
            .map(p => p.name)))
        teammates = {};
        for (let name of TabList.getNames()) {
            let noColors = ChatLib.removeFormatting(name);
            let regex = /\[\d+\]\s([A-Za-z0-9_]{1,32})\s/;
            let match = regex.exec(noColors);
            if (match) {
                teammates[match[1]] = {
                    scount: '0:0',
                    counts: {
                        terminal: 0,
                        lever: 0,
                        device: 0
                    }
                };
                if (Object.keys(teammates).length >= 5) break;
            }
        }
        const routes = JSON.parse(FileLib.read("OrangeAddons", "/src/features/dungeonRoutes/rooms.json"));

        global.socket.send({sync: true, type: 'registerDungeonRun', payload: {id: global.serverId, players: DungeonScanner.players
            .map(p => p.name)
            , routes: routes}});

        sleep(2000, () => {
            if (!settings.goldor_counts) return;

            isF7 = ['m7','f7'].includes(Scoreboard.getLines()[4].toString().removeFormatting().split('(')[1].replace(')', ''));

            if (isF7) {

                for (let register of registers) {
                    register.unregister();
                }


                registers.push(
                    register("Chat", () => {
                        for (let key of Object.keys(teammates)) {
                            let tm = teammates[key];
                            axios.get('https://api.orangeaddons.dev/rendername/' + key).then((response) => {
                                singleLine('&6&lOA - &6' + response.data + ` &r&6got &a${tm.counts.terminal} &r&6terminals, &a${tm.counts.lever} &r&6levers and &a${tm.counts.device} &r&6devices.`);
                            }).catch((error) => {
                                console.error(error);
                            });
                        }
                    }).setChatCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")
                )

                registers.push(
                    register("Chat", (...args) => {
                        const name = args[0];
                        const type = args[2];
                        if (teammates[name]) {

                            teammates[name].counts[type] += 1;
                        };
                    }).setCriteria(/([a-zA-Z0-9_]+) (completed|activated) a (terminal|lever|device)! \(\d\/\d\)/)
                )
            };
        });

    }).setCriteria('Starting in 1 second.');
    register('Chat', () => {
        sleep(1000, () => {
            function send(data) {
                for (let d of data.payload.secretCounts) {
                    if (teammates[d.name]?.scount) {
                        teammates[d.name].scount = `${d.old}:${d.new}`;
                    }
                }
            }

            global.socket.send({
                type: 'fetch',
                payload: {
                    type: 'secretCountV2',
                    names: Object.keys(teammates),
                },
            },send);

            dungeonactive = true;
        });
    }).setCriteria('Starting in 1 second.');

    // 'EXTRA STATS' trigger
    register('Chat', () => {
        if (settings.route_sharing) {
            global.socket.send({sync: true, type: 'deleteDungeonRun', payload: {id: global.serverId}});
            global.replaceWhenFound.routes = {};
        }
        if (!settings.secrets_per_run) {
            for (let register of registers) {
                register.unregister();
            }
            return
        } 
        sleep(1, () => {
            let players;
            try {
                players = DungeonScanner.players
            } catch (error) {
            }

            let packets = [];

                for (let name in teammates) {
                    const player = players.find(p => p.name === name);
                    if (player) {

                        let secrets = teammates[name]; // 'old:new' format
                        let rooms = [];
                        player.getWhiteChecks().forEach((name, data) => {
                            rooms.push({
                                name: name,
                                solo: data.solo,
                            })
                            
                        });
                        packets.push({
                            name: name,
                            roomsNewFormat: rooms,
                            roomsHigh: rooms.length,
                            roomsLow: rooms.filter(r => r.solo).length,
                            deaths: player.deaths,
                            secrets: secrets,
                        });

                    };
                }
                const packet = {
                    type: 'secretsPerRunV2',
                    payload: packets,
                };
                global.socket.send(packet);

            dungeonactive = false;

            for (let register of registers) {
                register.unregister();
            }
        });
    }).setCriteria('                             > EXTRA STATS <');
}

export default loadSecretsPerRun;