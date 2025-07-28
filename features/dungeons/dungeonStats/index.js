import { registerWhen } from '../../../../BloomCore/utils/Utils';

export default class dungeonStats {
    /**
     * @param {import('../../../index.js').default} main
     */
    constructor(main) {
        this.main = main;
        this.teammates = [];



        registerWhen(
            register('Chat', () => {
                const teammateNames = this.main.features.dungeons.DungeonScanner.players.map(p => p.name);
                this.main.socket.send(
                    {
                        sync: true,
                        type: 'registerDungeonRun',
                        payload:
                            {
                                id: this.main.serverId,
                                players: teammateNames,
                                routes: this.main.FileUtils.readJSON('/data/dungeonRoutes.json')
                            }
                    }
                );

                this.teammates = teammateNames
                .map(name => {
                    return {
                        name: name,
                        counts: {
                            secrets: '0:0',
                            terminal: 0,
                            lever: 0,
                            device: 0
                        }
                    }
                });

                if (!this.main.settings.values.secrets_per_run) return;

                this.main.socket.send({
                    type: 'fetch',
                    payload: {
                        type: 'secretCountV2',
                        names: teammateNames,
                    }
                }).then((response) => {
                    if (!response) return;
                    const secretCounts = response.payload.secretCounts;
                    this.teammates.forEach(teammate => {
                        const foundTeammate = secretCounts.find(t => t.name === teammate.name);
                        if (foundTeammate)
                            teammate.counts.secrets = `${foundTeammate.old}:${foundTeammate.new}`;
                    });
                });

            }).setCriteria('Starting in 1 second.'), 
            () => this.main.settings.values.secrets_per_run || this.main.settings.values.goldor_counts || this.main.settings.values.dungeon_routes
        )

        registerWhen(
            register('Chat', () => {
                this.main.socket.send({sync: true, type: 'deleteDungeonRun', payload: {id: this.main.serverId}});
                this.main.socket.send({
                    type: 'secretsPerRunV2',
                    payload: this.teammates.map(teammate => {
                        const player = this.main.features.dungeons.DungeonScanner.players.find(p => p.name === teammate.name);
                        if (!player) return null;
                        let rooms = [];
                        player.getWhiteChecks().forEach(check => {
                            rooms.push(check);
                        });

                        return {
                            name: teammate.name,
                            secrets: {scount: teammate.counts.secrets},
                            roomsHigh: rooms.length,
                            roomsLow: rooms.map(r => r.solo).length,
                            deaths: player.deaths,
                        };
                    }).filter((teammate) => teammate !== null),
                });
    
            }).setCriteria('                             > EXTRA STATS <'), 
            () => this.main.settings.values.secrets_per_run 
        )


    }
}