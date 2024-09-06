import global from '../../../comms/internal';
import settings from '../../../../settings';
function loadSoulflowModule() {
    register('chat', () => {
        const packet = {
            "type": "lowSoulflow",
            "payload": {
                "amount": settings.low_soulflow_amount
            }
        }
        global.sendData.send(JSON.stringify(packet));
    }).setCriteria(/^Sending\sto\sserver\s.+$/)
    console.log('OrangeAddons - Loaded Soulflow Module!')
}
export default loadSoulflowModule;