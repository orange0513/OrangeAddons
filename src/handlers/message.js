function messageHandler(messageJSON) {
    Object.keys(messageJSON).forEach((i) => {
        console.log('Parsing Line: ' + i)
        const text = messageJSON[i].text
        const hover = messageJSON[i].hoverText
        const textParsed = text.replace(/:NEWLINE:/g, '\n')
        const hoverParsed = hover.replace(/:NEWLINE:/g, '\n')
        let message = new Message()
        let component = new TextComponent(textParsed)
        if (hoverParsed != "NONE") component.setHoverValue(hoverParsed)
        message.addTextComponent(component)
        message.chat()

    })

}
export default messageHandler;