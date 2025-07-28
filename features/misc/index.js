import { registerWhen } from '../../../BloomCore/utils/Utils';

export default class misc {
    /**
     * @param {import('../../../index.js').default} main
     */
    constructor(main) {
        this.main = main;

        registerWhen( // from /src/features/misc/removeSelfie.js
            register("tick", () => {
                try {
                if (Client.settings.getSettings().field_74320_O === 2) Client.settings.getSettings().field_74320_O = 0;
                else if (Keyboard.isKeyDown(key.getKeyCode()) && !keyPressed) {
                    if (Client.settings.getSettings().field_74320_O === 1) Client.settings.getSettings().field_74320_O = 2;
                    keyPressed = true;
                } else if (!Keyboard.isKeyDown(key.getKeyCode()) && keyPressed) keyPressed = false;
                } catch (err) {
                if (Client.settings.getSettings().field_74320_O === 2) Client.settings.getSettings().field_74320_O = 0;
                }
            }), () => this.main.settings.values.remove_selfie_mode
        )

        register('chat', (player) => {
            if (!this.main.settings.values.wttwmo) return;
            const name = player.split(' ')[player.split(' ').length - 1];
            const players = this.main.helpers.getLobbyUUIDS();
            this.main.socket.send({
                type: 'wttwmo',
                payload: {
                    names: players,
                    warper: name
                }
            })
        }).setCriteria("-----------------------------------------------------\n${player} has invited you to join their party!\nYou have 60 seconds to accept. Click here to join!\n-----------------------------------------------------")
    
    }
}