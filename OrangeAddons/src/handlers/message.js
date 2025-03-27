import global from '../comms/internal';
function getIGNPreLoad() {
    let clientClass = Client.getMinecraft().func_110432_I().func_148256_e().toString()
    let regex = /name=([A-Za-z_0-9]+)/
    let result = regex.exec(clientClass)
    return result[1]
}

let currentChats = new Map();

const debugging = getIGNPreLoad() === "orange0513";
function messageHandler(messageJSON) {
    if (debugging) console.log(JSON.stringify(messageJSON));
    try {
        // Handle replacement before setting a new entry
        if (messageJSON.flags && messageJSON.flags.includes('replace')) {
            if (debugging) console.log('Replace Flag Detected, Replacing Message');
            const chatToReplace = currentChats.get(messageJSON.messageId);
            if (chatToReplace) {
               //chatToReplace.messages.forEach(message => ChatLib.deleteChat(message));
               ChatLib.clearChat(chatToReplace.messages);
            } else if (debugging) {
                console.log('Message to Replace Not Found, Skipping');
            }
        }

        // Set the new chat entry after handling replacements
        currentChats.set(messageJSON.messageId, { messages: [] });
        setTimeout(() => {
            currentChats.delete(messageJSON.messageId);
        }, messageJSON.timeout || 30 * 60 * 1000);

        const lines = messageJSON.lines;
        if (debugging) console.log('v2');
        if (debugging) console.log(`Parsing ${lines.length} Lines`);
        lines.forEach((line, lineNum) => {
            if (debugging) {
                console.log(`Parsing Line: ${lineNum + 1}`);
                console.log(`Keys: ${Object.keys(line)}`);
                console.log(`Parsing ${line.length} Components`);
            }
            let message = new Message();
            if (messageJSON.flags && messageJSON.flags.includes('replace')) {
                const messageId = Math.floor(Math.random() * 2000000000) + 1;
                message.setChatLineId(messageId);
                if (debugging) console.log('Adding Message to Replace List');
                currentChats.get(messageJSON.messageId).messages.push(messageId);
            }
            line.forEach((comp, compIndex) => {
                try {
                    if (debugging) console.log(`Parsing Comp: ${compIndex + 1}`);
                    let text = comp.text.replace(/:NEWLINE:/g, '\n');
                    if (!text) {
                        if (debugging) console.log('No Text Provided, Skipping Component');
                        return;
                    }
                    let hoverParsed = comp.hover?.replace(/:NEWLINE:/g, '\n');
                    let component = new TextComponent(text);
                    if (comp.command && ["run_command", "suggest_command"].includes(comp.command.action)) {
                        component.setClickAction(comp.command.action);
                        component.setClickValue(comp.command.value);
                    }
                    if (hoverParsed && hoverParsed !== "NONE") component.setHoverValue(hoverParsed);
                    message.addTextComponent(component);
                } catch (e) {
                    if (debugging) console.log('Error Parsing Component:', e);
                }
            });
            message.chat();
        });
    } catch (e) {
        console.error(e);
    }
}
function singleLine(text) {
    let message = new Message();
    text = text.replace(/:NEWLINE:/g, '\n');

    if (debugging) console.log(text);

    const hoverRegex = /\(([\s\S]+?)\)\[([\s\S]+?)\]/g;
    let match;
    let lastIndex = 0;

    while ((match = hoverRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            let beforeText = text.substring(lastIndex, match.index);
            if (debugging) console.log('Before Text:', beforeText);
            let beforeComponent = new TextComponent(beforeText);
            message.addTextComponent(beforeComponent);
        }
        let mainText = match[1];
        let hoverText = match[2];
        if (debugging) console.log('Main Text:', mainText, 'Hover Text:', hoverText);
        let component = new TextComponent(mainText);
        component.setHoverValue(hoverText);
        message.addTextComponent(component);

        lastIndex = hoverRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        let remainingText = text.substring(lastIndex);
        if (debugging) console.log('Remaining Text:', remainingText);
        let remainingComponent = new TextComponent(remainingText);
        message.addTextComponent(remainingComponent);
    }

    message.chat();
}
function bulkDelete(messageIds) {
    const messages = messageIds.map(id => currentChats.get(id));
    let chatIds = [];
    messages.forEach(message => {
        chatIds.push(...message.messages);
    });

    ChatLib.clearChat(chatIds);
}
export { singleLine, bulkDelete };
export default messageHandler;