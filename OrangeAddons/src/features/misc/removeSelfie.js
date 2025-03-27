import settings from '../../../settings';

let key = new KeyBind(Client.getMinecraft().field_71474_y.field_151457_aa);
let keyPressed = false;

export default function removeSelfie() {
    register("tick", () => {
        if (settings.remove_selfie_mode) {
            try {
            if (Client.settings.getSettings().field_74320_O === 2) Client.settings.getSettings().field_74320_O = 0;
            else if (Keyboard.isKeyDown(key.getKeyCode()) && !keyPressed) {
                if (Client.settings.getSettings().field_74320_O === 1) Client.settings.getSettings().field_74320_O = 2;
                keyPressed = true;
            } else if (!Keyboard.isKeyDown(key.getKeyCode()) && keyPressed) keyPressed = false;
            } catch (err) {
            if (Client.settings.getSettings().field_74320_O === 2) Client.settings.getSettings().field_74320_O = 0;
            }
        }
    })
}