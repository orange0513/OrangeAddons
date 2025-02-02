const File = java.io.File;
let hasClearBreakdown = false;

try {
    hasClearBreakdown = JSON.parse(FileLib.read("soopyAddonsData", "bettermapsettings.json")).clearedRoomInfo || false;
} catch (error) {
}

let global = {
    returnPacket: {
        "secretCount": function() {
            return false;
        }
    },
    currentDungeonMap: undefined,
    hasBetterMap: new File(Config.modulesFolder).listFiles().find(module => {
        return module.getName() === "BetterMap";
        }) ? hasClearBreakdown : false,

    onMessage: function(message) {
    }, 
    editingUI: false,
    config: JSON.parse(FileLib.read("OrangeAddons", "hiddenConfig.json")),    
}

register("step", () => {
    if (JSON.stringify(global.config) !== JSON.stringify(JSON.parse(FileLib.read("OrangeAddons", "hiddenConfig.json"))))
        FileLib.write("OrangeAddons", "hiddenConfig.json", JSON.stringify(global.config, null, 2));
}).setFps(1);
export default global;