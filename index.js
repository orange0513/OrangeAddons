/// <reference types="../CTAutocomplete" />
import FileUtils from "./utils/file";
import settings from "./data/settings";
import helpers from "./utils/helpers";
import socket from "./socket";
import MessageUtils from "./utils/message";
import settings from "./data/settings";
import SessionUtils from "./utils/session";
import dungeons from "./features/dungeons/index";
import misc from "./features/misc/index";
import alerts from "./features/alerts";
export default new class main {
    constructor() {
        setTimeout(() => {
            this.helpers = new helpers(this);
            this.FileUtils = new FileUtils(this);
            this.MessageUtils = new MessageUtils(this);
            this.SessionUtils = new SessionUtils(this);
            this.metadata = this.FileUtils.readJSON("metadata.json");
            this.version = this.metadata.description.split(" ").splice(1).join(" ");
            this.socket = new socket(this);
            this.settings = new settings(this);
            this.features = {};
            this.features.dungeons = new dungeons(this);
            this.features.alerts = new alerts(this);
            this.features.misc = new misc(this);
            this.serverId = this.helpers.generateUUID();
            register('chat', () => {
                this.serverId = this.helpers.generateUUID();
            }).setCriteria(/^Sending\sto\sserver\s.+$/)
            this.commands = [];
            this.init();
            this.loadCommands();
            this.unloaded = false;
        }, 1500); // delaying the loading of OA so getServerId works properly (welcome to ct)
    }

    /**
     * @returns {void}
     * @description Adds files that are required for the module to work.
     * @description This is called when the module is loaded.
     */
    init() {
        register("GameUnload", () => {
            this.unloaded = true;
            if (!this.socket.socketObj) return;
            this.socket.socketObj.dontReconnect = true;
            this.socket.socketObj.close();
        });
        if (!this.FileUtils.exists("/data/routeOverwrites.json"))
            this.FileUtils.write("/data/routeOverwrites.json", "[]");
        if (!this.FileUtils.exists("/data/partyFinder.json"))
            this.FileUtils.write("/data/partyFinder.json", JSON.stringify(["cataLevel","secretsPerRun","roomsCleared","deaths","magicalPower","bloodMobKills","personalBests","shitterList","actionButtons","blank","armorEquip","goodItems"]));
    }

    loadCommands() {
        const commandsPath = "./config/ChatTriggers/modules/OrangeAddons/commands";
        const File = Java.type("java.io.File");
        const commandFiles = new File(commandsPath).listFiles();
    
        if (commandFiles)
            Array.from(commandFiles).forEach(file => {
                if (file.isFile() && file.getName().endsWith(".command.js"))
                    new (require(`./commands/${file.getName()}`).default)(this);
            });
    
        register("messageSent", (m, e) => {
            try {
                if (!m.startsWith("/")) return;
                const command = m.split(" ")[0].substring(1);
                const foundCommand = this.commands.find(c => c.name?.toLowerCase() === command?.toLowerCase() || c.aliases.includes(command?.toLowerCase()));
                if (!foundCommand) return;
                cancel(e);
                foundCommand.execute(m.substring(command.length + 2), command);
            } catch (error) {
                console.error(error)
            }
        });
    }
    
}