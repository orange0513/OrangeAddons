export function getLobbyUUIDS() {
    let names = []
    
    Player.getPlayer().field_71174_a.func_175106_d().forEach(player => { // get players from tab
    let profile = player.func_178845_a(); // getGameProfile

    if (player.func_178854_k() == '') return; // get display name
    try {
        const uuid = profile.getId().toString(); // get uuid
        if (typeof uuid !== 'string' || profile.getName().match(/^[0-9a-z]{10}$/) || profile.getName().match(/^\![A-Za-z]\-[A-Za-z]$/)) return; // getName
        names.push(uuid) 
    } catch (e) {
        console.error(e);
    }
    });
    if (!names.includes(Player.getUUID())) names.push(Player.getUUID());
    return names;
}

export default '';