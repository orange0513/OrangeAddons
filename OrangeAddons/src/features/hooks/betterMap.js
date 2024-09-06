import global from '../../comms/internal';
function loadBetterMapModule() {
    function getChat() {
        const ChatGUI = Client.getChatGUI();
        let chat = ChatGUI?.field_146252_h;
        let search = 0;
        const BM = []
        while (true) {
            let message = chat[search]?.func_151461_a()?.func_150260_c();
            if (message == undefined) {
                console.log('Undefined :/')
                break;
            }
            if (search > 100) {
                console.log('Search > 100')
                break;
            }
            let messageNoColor = message.removeFormatting();
            if (messageNoColor.startsWith('[BM]')) {
                BM.push(messageNoColor)
            } else if (messageNoColor.startsWith('[BetterMap]')) {
                break;
            }
            search++;
        }
        return BM;
        //?.func_151461_a()?.func_150260_c()
    }
    register('chat', () => {
        setTimeout(() => {
            const messages = getChat();
            if (messages.length > 0) {
                Object.keys(messages).forEach((message) => {
                    let msg = messages[message];
                    let regex = /\[BM\]\s([a-zA-Z0-9_]+)\scleared\s(\d+)-(\d+)\srooms\s\|\s(\d+)\ssecrets\s\|\s(\d+)\sdeaths/
                    let result = regex.exec(msg);
                    if (result != null) {
                        const name = result[1];
                        const roomsLow = result[2];
                        const roomsHigh = result[3];
                        const secrets = result[4];
                        const deaths = result[5];
                        const packet = {
                            "type": "dungeonStats",
                            "payload": {
                                "name": name,
                                "roomsLow": roomsLow,
                                "roomsHigh": roomsHigh,
                                "secrets": secrets,
                                "deaths": deaths
                            }
                        }
                        global.sendData.send(JSON.stringify(packet));
                    }
                });
            }
        }, 7500);
    }).setCriteria('                             > EXTRA STATS <');
    console.log('OrangeAddons - Loaded BetterMap Hook!')
}

export default loadBetterMapModule;