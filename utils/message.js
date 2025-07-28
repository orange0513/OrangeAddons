/// <reference types="../../CTAutocomplete" />

/**
 * @typedef {import('../index.js').default} MainType
 */
export default class MessageUtils {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        this.main = main;
        this.messages = new Map();
    }

    /**
     * 
     * @param {
    *     lines: {
    *         text: string;
    *         hover: string | null | undefined;
    *         command?: {
    *             action: 'run_command' | 'suggest_command';
    *             value: string;
    *         } | null | undefined;
    *     }[];
    *     flags?: string[];
    *     timeout?: number;
    *     messageId: string;
    *
    *    
    * } message
    * @returns {void}
    */
    sendMessage(message) {
        if (message.flags && message.flags.includes('replace')) {
            const chatToReplace = this.messages.get(message.messageId);
            if (chatToReplace)
               ChatLib.clearChat(chatToReplace);

            message.replace = true;
        }

        this.messages.set(message.messageId, [])
        setTimeout(() => this.messages.delete(message.messageId), message.timeout || 1000 * 60 * 5);

        if (!message.lines || message.lines.length === 0) return;

        message.lines.forEach((lines) => {
            const lineObj = new Message();

            if (message.replace) {
                const id = this.main.helpers.randomNumber(0, 10000000);
                lineObj.setChatLineId(id);
                this.messages.get(message.messageId).push(id);
            }

            lines.forEach((line) => {
                const t = line.text?.replace(/:NEWLINE:/g, "\n");
                if (!t) return;
                const hover = line.hover?.replace(/:NEWLINE:/g, "\n") || null;

                const component = new TextComponent(t);
                if (hover && hover !== 'NONE')
                    component.setHoverValue(hover);
                if (line.command && ['run_command', 'suggest_command'].includes(line.command.action)) {
                    component.setClickAction(line.command.action);
                    component.setClickValue(line.command.value);
                }
                lineObj.addTextComponent(component);
            });
            lineObj.chat();
        })

    }


    /**
     * * @param {string} message
     * * @description Sends a message to the chat but handles hover & newline stuf
     * @returns {void}
     */
    // sendLine(message) {
    //     const lineObj = new Message();
    //     message = message.replace(/:NEWLINE:/g, "\n");

    //     const hoverRegex = /(?<!\{)\(([\s\S]+?)\)(?!\})\[(?!\{)([\s\S]+?)\](?!\})/g;
    //     let match;
    //     let lastIndex = 0;

    //     while ((match = hoverRegex.exec(text)) !== null) {
    //         if (match.index > lastIndex) {
    //             const textComponent = new TextComponent(message.substring(lastIndex, match.index));
    //             lineObj.addTextComponent(textComponent);
    //         }
    //         let mainText = match[1];
    //         let hoverText = match[2];
    //         const textComponent = new TextComponent(mainText);
    //         textComponent.setHoverValue(hoverText);
    //         lineObj.addTextComponent(textComponent);
    //         lastIndex = match.index + match[0].length;
    //     }

    //     if (lastIndex < message.length) {
    //         const textComponent = new TextComponent(message.substring(lastIndex));
    //         lineObj.addTextComponent(textComponent);
    //     }
    //     lineObj.chat();
    // }


    /**
     * @param {string[]} messageIds
     * @description Clears the chat lines with the given messageIds.
     * @returns {void}
     */
    clearMessages(messageIds) {
        messageIds.forEach((id) => {
            const chatToReplace = this.messages.get(id);
            if (chatToReplace) {
                ChatLib.clearChat(chatToReplace);
                this.messages.delete(id);
            }
        });
    }
}
