import global from '../comms/internal';

function messageHandler(messageJSON) {
    console.log('Parsing Message')
    console.log('Keys: ' + Object.keys(messageJSON))
    console.log('Format: ' + messageJSON.format);
    if (!messageJSON.format) {
        console.log('No Format Specified, Defaulting to v1')
        Object.keys(messageJSON).forEach((i) => {
            if (global.debugging) console.log('Parsing Line: ' + i)
            const text = messageJSON[i].text
            const hover = messageJSON[i].hoverText
            const textParsed = text.replace(/:NEWLINE:/g, '\n')
            const hoverParsed = hover.replace(/:NEWLINE:/g, '\n')
            let message = new Message()
            let component = new TextComponent(textParsed)
            if (hoverParsed != "NONE") component.setHoverValue(hoverParsed)
            message.addTextComponent(component)
            message.chat()

        }); // v1 Format Handler 
    } else if (messageJSON.format === 'v2') {
        const lines = messageJSON.lines
        if (global.debugging) console.log('v2')
            if (global.debugging) console.log('Parsing ' + lines.length + ' Lines')
        for (const line of lines) {
            if (global.debugging) console.log('Parsing Line: ' + (lines.indexOf(line) + 1))
                if (global.debugging) console.log('Keys: ' + Object.keys(line));
            if (global.debugging) console.log('Parsing ' + line.length + ' Components')
            let message = new Message()
            for (const comp of line) {
                try {
                    if (global.debugging) console.log('Parsing Comp: ' + (line.indexOf(comp) + 1))
                    let text = comp.text
                    let hover = comp.hover
                    let command = comp.command
                    const textParsed = text.replace(/:NEWLINE:/g, '\n')
                    if (!textParsed) {
                        if (global.debugging) console.log('No Text Provided, Skipping Component')
                        continue;
                    }
                    const hoverParsed = hover?.replace(/:NEWLINE:/g, '\n')
                    let component = new TextComponent(textParsed)
                    if (command) {
                        let validActions = [
                            "run_command",
                            "suggest_command"
                        ]
                        if (validActions.includes(command.action)) {
                            component.setClickAction(command.action)
                            component.setClickValue(command.value)
                        }
                    }
                    if (hoverParsed && hoverParsed != "NONE") component.setHoverValue(hoverParsed)
                    message.addTextComponent(component)
                } catch (e) {
                    if (global.debugging) console.log('Error Parsing Component: ', e)
                    continue;
                }

            }
            message.chat();
        }
    }

}
export default messageHandler;