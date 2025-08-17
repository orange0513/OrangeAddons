import autoKick from "./autoKick/index";
import dungeonStats from "./dungeonStats/index";
import DungeonScanner from "../../../tska/skyblock/dungeon/DungeonScanner.js";
import goldorCounts from "./goldorCounts/index";
import dungeonRoutes from "./dungeonRoutes/index.js";

/**
 * @typedef {import('../../index.js').default} MainType
 */
export default class dungeons {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        this.main = main;
        this.DungeonScanner = DungeonScanner;
        this.autoKick = new autoKick(main);
        this.dungeonStats = new dungeonStats(main);
        this.goldorCounts = new goldorCounts(main);
        this.dungeonRoutes = new dungeonRoutes(main);

        const _this = this;
        register('GuiOpened', () => {
            if (!_this.main.settings.values.party_finder) return;
            setTimeout(() => {
                if (!Player.getContainer()) return;
                const guiname = Player.getContainer().getName();
                if (guiname == "Party Finder") {
                    const item = Player.getContainer().getStackInSlot(50).getLore();
                    const type = item[4];
                    let floor = item[5];
                    floor = floor +" ";
                    const floorregex = /.* (1|2|3|4|5|6|7|I|II|III|IV|V|VI|VII|Entrance) .*/;
                    // let typeparsed = typeregex.exec(type);
                    let typedone;
                    ;
                    if (type === '§5§o§aDungeon: §bMaster Mode The Catacombs') {
                        typedone = "M";
                    } else if (type === '§5§o§aDungeon: §bThe Catacombs') {
                        typedone = "F";
                    }
                    let floorparsed = floorregex.exec(floor);
                    let floordone = floorparsed[1];
                    if (floordone == undefined) {
                        ChatLib.chat('&6&lOA - &cInternal Error, floor == undefined')
                        return ".";
                    } else if (floordone == "Entrance") {
                        floordone = 0;
                    } else if (floordone == "VII" || floordone == "7") {
                        floordone = 7;
                    } else if (floordone == "VI" || floordone == "6") {
                        floordone = 6;
                    } else if (floordone == "V" || floordone == "5") {
                        floordone = 5;
                    } else if (floordone == "IV" || floordone == "4") {
                        floordone = 4;
                    } else if (floordone == "III" || floordone == "3") {
                        floordone = 3;
                    } else if (floordone == "II" || floordone == "2") {
                        floordone = 2;
                    } else if (floordone == "I" || floordone == "1") {
                        floordone = 1;
                    }
                    
                    _this.main.settings.setValue("party_finder_floor",typedone + floordone);
                    return ".";
                }
            }, 50);
            return ".";
        });

        register('chat', (...args) => {
            function displaystats() {
                if (_this.main.settings.values.party_finder == true) {
                    ChatLib.chat('&6&lOA - &r&aFetching stats for ' + args[0])
                    try {
                        JSON.parse(_this.main.settings.values.party_finder_items)
                    } catch (e) {
                        ChatLib.chat('&6&lOA - &r&cInvalid Party Finder Items. resetting them to default')
                       _this.main.settings.setValue('party_finder_items', '[     "HYPERION",     "SCYLLA",     "ASTRAEA",     "VALKYRIE",     "NECRON_BLADE",     "DARK_CLAYMORE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS",     "SPEED_WITHER_HELMET",     "SPEED_WITHER_CHESTPLATE",     "SPEED_WITHER_LEGGINGS",     "SPEED_WITHER_BOOTS",     "SPRING_BOOTS",     "JERRY_STAFF",     "DIAMOND_PICKAXE",     "ALPHA_PICK",     "STONK" ]')
                    }
                    try {
                        JSON.parse(_this.main.settings.values.healer_party_finder_items)
                    } catch (e) {
                        ChatLib.chat('&6&lOA - &r&cInvalid Healer Party Finder Items. resetting them to default')
                        _this.main.settings.setValue('healer_party_finder_items','[     "TERMINATOR",     "SOUL_WHIP",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]')
                    }
                    try {
                        JSON.parse(_this.main.settings.values.mage_party_finder_items)
                    } catch (e) {
                        ChatLib.chat('&6&lOA - &r&cInvalid Mage Party Finder Items. resetting them to default')
                        _this.main.settings.setValue('mage_party_finder_items','[     "DARK_CLAYMORE",     "WISE_WITHER_HELMET",     "WISE__WITHER_CHESTPLATE",     "WISE_WITHER_LEGGINGS",     "WISE_WITHER_BOOTS",     "LAST_BREATH",     "RAGNAROCK_AXE" ]')
                    }
                    try {
                        JSON.parse(_this.main.settings.values.berserk_party_finder_items)
                    } catch (e) {
                        ChatLib.chat('&6&lOA - &r&cInvalid Berserk Party Finder Items. resetting them to default')
                       _this.main.settings.setValue('berserk_party_finder_items','[     "TERMINATOR",     "DARK_CLAYMORE",     "RAGNAROCK_AXE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]')
                    }
                    try {
                        JSON.parse(_this.main.settings.values.archer_party_finder_items)
                    } catch (e) {
                        ChatLib.chat('&6&lOA - &r&cInvalid Archer Party Finder Items. resetting them to default')
                       _this.main.settings.setValue('archer_party_finder_items', '[     "TERMINATOR",     "RAGNAROCK_AXE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]')
                    }
                    try {
                        JSON.parse(_this.main.settings.values.tank_party_finder_items)
                    } catch (e) {
                        ChatLib.chat('&6&lOA - &r&cInvalid Tank Party Finder Items. resetting them to default')
                        _this.main.settings.setValue('tank_party_finder_items', '[     "TERMINATOR",     "TANK_WITHER_HELMET",     "TANK_WITHER_CHESTPLATE",     "TANK_WITHER_LEGGINGS",     "TANK_WITHER_BOOTS",     "LAST_BREATH",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS",     "SOUL_WHIP",     "AXE_OF_THE_SHREDDED" ]')
                    }
                    let dclass = args[1].toLowerCase()
                    let allitems = JSON.parse(_this.main.settings.values.party_finder_items)
                    if (dclass == "berserk") {
                        let berserkitems = JSON.parse(_this.main.settings.values.berserk_party_finder_items)
                        allitems = allitems.concat(berserkitems)
                    } else if (dclass == "mage") {
                        let mageitems = JSON.parse(_this.main.settings.values.mage_party_finder_items)
                        allitems = allitems.concat(mageitems)
                    } else if (dclass == "healer") {
                        let healeritems = JSON.parse(_this.main.settings.values.healer_party_finder_items)
                        allitems = allitems.concat(healeritems)
                    } else if (dclass == "archer") {
                        let archeritems = JSON.parse(_this.main.settings.values.archer_party_finder_items)
                        allitems = allitems.concat(archeritems)
                    } else if (dclass == "tank") {
                        let tankitems = JSON.parse(_this.main.settings.values.tank_party_finder_items)
                        allitems = allitems.concat(tankitems)
                    }
                    let embededsettings = {
                        "fmprfloor": _this.main.settings.values.party_finder_floor,
                        "items": JSON.stringify(allitems),
                        "ecbp": _this.main.settings.values.ender_chest_and_backpack_shown,
                    }
                    let forward = JSON.stringify(embededsettings);
                    const show = JSON.parse(FileLib.read("OrangeAddons","data/partyFinder.json"))
                    const packet = {
                        type: "partyFinderV2",
                        payload: {
                            name: args[0],
                            settings: forward,
                            show
                        }
                    }
                    _this.main.socket.send(packet);
                }
            }
            if (args[0] != Player.getName()) {
                displaystats()
            } else if (_this.main.settings.values.show_own_stats_in_party_finder == true) {
                displaystats()
            }
        }).setCriteria(/Party Finder > ([A-Za-z0-9_]{2,16}) joined the dungeon group! \((Mage|Tank|Berserk|Healer|Archer) Level \d+\)/)
    }

    getDungeonTeammates() {
        let names = [];
        for (let name of TabList.getNames()) {
            let noColors = ChatLib.removeFormatting(name);
            let regex = /\[\d+\]\s([A-Za-z0-9_]{1,32})\s/;
            let match = regex.exec(noColors);
            if (match) names.push(match[1]);
        }
        return names;
    }
}