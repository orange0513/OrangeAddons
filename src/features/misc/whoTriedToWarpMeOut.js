/// <reference types="../../../../CTAutocomplete" />
import { getLobbyUUIDS } from '../../helpers/index.js';
import global from '../../comms/internal';
export default function registerWTTWMO() {
    register('chat', (player) => {
        const name = player.split(' ')[player.split(' ').length - 1];
        const players = getLobbyUUIDS();
        global.socket.send({
            type: 'wttwmo',
            payload: {
                names: players,
                warper: name
            }
        })
    }).setCriteria("-----------------------------------------------------\n${player} has invited you to join their party!\nYou have 60 seconds to accept. Click here to join!\n-----------------------------------------------------")

}