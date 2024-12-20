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
        global.socket.send(packet);
    }).setCriteria(/^Sending\sto\sserver\s.+$/)
    
}
export default loadSoulflowModule;