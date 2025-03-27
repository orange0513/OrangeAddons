/// <reference types="../CTAutocomplete" />

import Settings from "../Amaterasu/core/Settings"
import DefaultConfig from "../Amaterasu/core/DefaultConfig"
const config = new DefaultConfig("OrangeAddons", "settings.json")

.addSwitch({
    category: "Dungeons",
    configName: "secrets_per_run",
    title: "&aDungeon Stats At The End Of A Run",
    description: "&eShows your teammates Secrets / Rooms Cleared / Deaths at the end of a run",
    subcategory: "",
    value: true
})
.addSwitch({
    category: "Dungeons",
    configName: "goldor_counts",
    title: "&aGoldor Counts",
    description: "&eDisplays how many devices/terms/levers your teammates have done in F7/M7",
    subcategory: "",
    value: false

})
.addSwitch({
    category: "Dungeons",
    configName: "dungeon_routes",
    title: "&aDungeon Routes",
    description: "&eDisplays Dungeon Routes, modify with /oa routes",
    subcategory: "Dungeon Routes",
    value: true
})
.addSwitch({
    category: "Dungeons",
    configName: "route_sharing",
    title: "&aRoute Sharing",
    description: "&eShares progress of routes between all party members using OrangeAddons",
    subcategory: "Dungeon Routes",
    value: true
})
.addSwitch({
    category: "Dungeons",
    configName: "render_full_block",
    title: "&aRender Full Block",
    description: "&eCovers the full block instead of just an outline",
    subcategory: "Dungeon Routes",
    value: true
})
.addSlider({
    category: "Dungeons",
    configName: "transparency_on_block",
    title: "&aTransparency on block",
    description: "&eAjust the transparency of the block",
    options: [0, 1000],
    value: 0,
    subcategory: "Dungeon Routes",
    value: 175
})
.addSlider({
    category: "Dungeons",
    configName: "transparency_on_line",
    title: "&aTransparency on line",
    description: "&eAjust the transparency of the line",
    options: [0, 1000],
    value: 0,
    subcategory: "Dungeon Routes",
    value: 750
})
.addSwitch({
    category: "Dungeons",
    configName: "line_to_yellow",
    title: "&aDraw Line To Next Block",
    description: "&eDraws a line to the yellow block in dungeon routes (Next)",
    subcategory: "Dungeon Routes",
    value: true
})
.addSwitch({
    category: "Dungeons",
    configName: "line_to_red",
    title: "&aDraw Line To 3rd Block",
    description: "&eDraws a line to the red block in dungeon routes (3rd)",
    subcategory: "Dungeon Routes",
    value: true
})
.addSlider({
    category: "Dungeons",
    configName: "transparency_on_text",
    title: "&aTransparency On Block Text",
    description: "&eAjust the transparency of the route text",
    options: [0, 1000],
    value: 800,
    subcategory: "Dungeon Routes"
})
.addColorPicker({
    category: "Dungeons",
    configName: "change_current_route_color",
    title: "&aChange current route color",
    description: "&eChanges the color of the current block in the route",
    value: [0, 204, 0, 255],
    subcategory: "Dungeon Routes"
})
.addColorPicker({
    category: "Dungeons",
    configName: "change_next_route_color",
    title: "&aChange Color Of Next Block",
    description: "&eChanges the color of the next blocks in the route",
    value: [255, 255, 0, 255],
    subcategory: "Dungeon Routes"
})
.addColorPicker({
    category: "Dungeons",
    configName: "change_3rd_route_color",
    title: "&aChange Color Of 3rd Block",
    description: "&eChanges the color of the 3rd block in the route",
    value: [255, 0, 0, 255],
    subcategory: "Dungeon Routes"
})
.addSwitch({
    category: "Dungeons",
    configName: "party_finder",
    title: "&aParty Finder",
    description: "&eToggles the party finder module",
    subcategory: "Party Finder",
    value: true
})
.addSwitch({
    category: "Dungeons",
    configName: "show_own_stats_in_party_finder",
    title: "&aShow Your Own Stats In Party Finder",
    description: "&eShows your own stats whenever you join a party (must have Party Finder enabled)",
    subcategory: "Party Finder",
    value: false
})
.addSwitch({
    category: "Dungeons",
    configName: "ender_chest_and_backpack_shown",
    title: "&aEnder Chest and Backpack Shown",
    description: "&eShows Ender Chest & Backpack results in items",
    subcategory: "Party Finder",
    value: false
})
.addTextInput({
    category: "Dungeons",
    configName: "party_finder_items",
    title: "Party Finder Items",
    description: "&eDO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING",
    placeHolder: "",
    subcategory: "Party Finder",
    shouldShow: () => false,
    value: '[     "HYPERION",     "SCYLLA",     "ASTRAEA",     "VALKYRIE",     "NECRON_BLADE",     "DARK_CLAYMORE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS",     "SPEED_WITHER_HELMET",     "SPEED_WITHER_CHESTPLATE",     "SPEED_WITHER_LEGGINGS",     "SPEED_WITHER_BOOTS",     "SPRING_BOOTS",     "JERRY_STAFF",     "DIAMOND_PICKAXE",     "ALPHA_PICK",     "STONK" ]'
})
.addTextInput({
    category: "Dungeons",
    configName: "healer_party_finder_items",
    title: "Healer Party Finder Items",
    description: "&eDO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING",
    placeHolder: "",
    subcategory: "Party Finder",
    shouldShow: () => false,
    value: '[     "TERMINATOR",     "SOUL_WHIP",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]'
})
.addTextInput({
    category: "Dungeons",
    configName: "mage_party_finder_items",
    title: "Mage Party Finder Items",
    description: "&eDO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING",
    placeHolder: "",
    subcategory: "Party Finder",
    shouldShow: () => false,
    value: '[     "DARK_CLAYMORE",     "WISE_WITHER_HELMET",     "WISE__WITHER_CHESTPLATE",     "WISE_WITHER_LEGGINGS",     "WISE_WITHER_BOOTS",     "LAST_BREATH",     "RAGNAROCK_AXE" ]'
})
.addTextInput({
    category: "Dungeons",
    configName: "berserk_party_finder_items",
    title: "Berserk Party Finder Items",
    description: "&eDO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING",
    value: "",
    placeHolder: "",
    subcategory: "Party Finder",
    shouldShow: () => false,
    value: '[     "TERMINATOR",     "DARK_CLAYMORE",     "RAGNAROCK_AXE" ]'
})
.addTextInput({
    category: "Dungeons",
    configName: "archer_party_finder_items",
    title: "Archer Party Finder Items",
    description: "&eDO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING",
    placeHolder: "",
    subcategory: "Party Finder",
    shouldShow: () => false,
    value: '[     "TERMINATOR",     "RAGNAROCK_AXE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]'
})
.addTextInput({
    category: "Dungeons",
    configName: "tank_party_finder_items",
    title: "Tank Party Finder Items",
    description: "&eDO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING",
    placeHolder: "",
    subcategory: "Party Finder",
    shouldShow: () => false,
    value: '[     "TERMINATOR",     "TANK_WITHER_HELMET",     "TANK_WITHER_CHESTPLATE",     "TANK_WITHER_LEGGINGS",     "TANK_WITHER_BOOTS",     "LAST_BREATH",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS",     "SOUL_WHIP",     "AXE_OF_THE_SHREDDED" ]'

})
.addTextInput({
    category: "Dungeons",
    configName: "party_finder_floor",
    title: "Party Finder Floor",
    description: "&e(Automatcly Updates), what floor party finder messages will check with FMPR on join.",
    value: "",
    placeHolder: "",
    subcategory: "Party Finder",
    shouldShow: () => false
})
.addSwitch({
    category: "Dungeons",
    configName: "auto_kick_shitters",
    title: "&aAuto Kick Shitters",
    description: "&eAutomatically kicks people who are shitters",
    subcategory: "Party Finder",
    value: false
})
.addSwitch({
    category: "Dungeons",
    configName: "party_message_on_shitter_kick",
    title: "&aParty Message on Shitter Kick",
    description: "&eSends a message to the party when a shitter is kicked",
    subcategory: "Party Finder",
    value: false
})
.addTextInput({
    category: "Dungeons",
    configName: "shitter_kick_message",
    title: "&aShitter Kick Message",
    description: "&eMessage to send to the party when a shitter is kicked",
    placeHolder: "",
    subcategory: "Party Finder",
    value: 'Kicking {name} for being on the OA Shitter List!',
})
.addSwitch({
    category: "Dungeons",
    configName: "auto_kick_from_pb",
    title: "&aAuto Kick From PB",
    description: "&eAutomatically kicks people depending on their PB",
    subcategory: "Party Finder",
    value: false
})
.addSwitch({
    category: "Dungeons",
    configName: "party_message_on_pb_kick",
    title: "&aParty Message on PB Kick",
    description: "&eSends a message to the party when a player is kicked for having a bad PB",
    subcategory: "Party Finder",
    value: false
})
.addTextInput({
    category: "Dungeons",
    configName: "pb_kick_message",
    title: "&aPB Kick Message",
    description: "&eMessage to send to the party when a player is kicked for having a bad PB",
    placeHolder: "",
    subcategory: "Party Finder",
    value: 'Kicking {name} for having a bad PB ({pb})',
})
.addTextInput({
    category: "Dungeons",
    configName: "f0_pb_kick_threshold",
    title: "&aEntrence PB Kick",
    description: "&eThe Completion PB threshold for Entrance (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "f1_pb_kick_threshold",
    title: "&aF1 PB Requirement",
    description: "&eThe S PB threshold for Floor 1 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "f2_pb_kick_threshold",
    title: "&aF2 PB Requirement",
    description: "&eThe S PB threshold for Floor 2 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "f3_pb_kick_threshold",
    title: "&aF3 PB Requirement",
    description: "&eThe S PB threshold for Floor 3 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "f4_pb_kick_threshold",
    title: "&aF4 PB Requirement",
    description: "&eThe S PB threshold for Floor 4 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "f5_pb_kick_threshold",
    title: "&aF5 PB Requirement",
    description: "&eThe S+ PB threshold for Floor 5 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "f6_pb_kick_threshold",
    title: "&aF6 PB Requirement",
    description: "&eThe S+ PB threshold for Floor 6 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "f7_pb_kick_threshold",
    title: "&aF7 PB Requirement",
    description: "&eThe S+ PB threshold for Floor 7 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "m1_pb_kick_threshold",
    title: "&aM1 PB Requirement",
    description: "&eThe S PB threshold for Master Mode Floor 1 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "m2_pb_kick_threshold",
    title: "&aM2 PB Requirement",
    description: "&eThe S PB threshold for Master Mode Floor 2 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "m3_pb_kick_threshold",
    title: "&aM3 PB Requirement",
    description: "&eThe S PB threshold for Master Mode Floor 3 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "m4_pb_kick_threshold",
    title: "&aM4 PB Requirement",
    description: "&eThe S+ PB threshold for Master Mode Floor 4 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "m5_pb_kick_threshold",
    title: "&aM5 PB Requirement",
    description: "&eThe S+ PB threshold for Master Mode Floor 5 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "m6_pb_kick_threshold",
    title: "&aM6 PB Requirement",
    description: "&eThe S+ PB threshold for Master Mode Floor 6 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Dungeons",
    configName: "m7_pb_kick_threshold",
    title: "&aM7 PB Requirement",
    description: "&eThe S+ PB threshold for Master Mode Floor 7 (IN SECONDS) (0 to disable)",
    value: "0",
    placeHolder: "",
    subcategory: "Party Finder",
})
.addTextInput({
    category: "Misc",
    configName: "low_soulflow_amount",
    title: "&3Low Soulflow Notification",
    description: "&eIf your soulflow ever drops below this number, you will be alerted (-1 to disable)",
    value: "500",
    placeHolder: "",
    subcategory: "",
})
.addSwitch({
    category: "Misc",
    configName: "remove_selfie_mode",
    title: "&cRemove Selfie Mode",
    description: "&eRemoves the selfie mode in F5",
    subcategory: "",
    value: false
})
.addSwitch({
    category: "Misc",
    configName: "katana_alerts",
    title: "&5EMAN Katana Alerts",
    description: "&eAlerts you when your Katana Expires",
    subcategory: "",
    value: false
})
.addSwitch({
    category: "Misc",
    configName: "healing_wand_alerts",
    title: "&6Healing Wand Alerts",
    description: "&eAlerts you when your healing wand expires!",
    subcategory: "",
    value: false
})
.addSwitch({
    category: "Misc",
    configName: "wither_cloak_alerts",
    title: "&8Wither Cloak Alerts",
    description: "&eAlerts you when you run out mana while using Wither Cloak!",
    subcategory: "",
    value: false
})
.addSwitch({
    category: "Misc",
    configName: "weird_tuba_alerts",
    title: "&5Weird/Weirder Tuba Alerts",
    description: "&eAlerts you when your Weird or Weirder Tuba Expires!",
    subcategory: "",
    value: false
})
.addSwitch({
    category: "Misc",
    configName: "cells_alignment_alerts",
    title: "&dGyro Wand Cells Alignment Alerts",
    description: "&eAlerts you 2 Seconds Before Cells Alignment expires, and when it expires!",
    subcategory: "",
    value: false
})
.addSwitch({
    category: "Misc",
    configName: "ice_spray_alerts",
    title: "Ice Spray Wand alerts",
    description: "&eCounts down when the mobs you ice sprayed will be let loose",
    subcategory: "",
    value: false
})
.addSwitch({
    category: "Misc",
    configName: "route_developer_mode",
    title: "Route Developer Mode",
    description: "&eToggles route developer mode (You'll beable to create your own routes)",
    subcategory: "",
    value: false,
    shouldShow: () => false
})
.addTextInput({
    category: "Misc",
    configName: "use_route",
    title: "Use Route",
    description: "&eUses this route in dungeons, (default = \"default\")",
    value: "default",
    placeHolder: "",
    subcategory: "",
    shouldShow: () => false
})
.addTextInput({
    category: "Misc",
    configName: "editing_route",
    title: "Editing Route",
    description: "&eThe route you are currently editing",
    value: "default",
    placeHolder: "",
    subcategory: "",
    shouldShow: () => false
})



const metadata = JSON.parse(FileLib.read('OrangeAddons', './metadata.json'))
const description = metadata.description;
const version = description.split(" ").splice(1).join(" ");
let setting = new Settings("OrangeAddons", config, "ColorScheme.json", "&6&lOrangeAddons &e"+ version) // make sure to set your command with [.setCommand("commandname")]
const textWrap = setting.AmaterasuGui.descriptionElement.textWrap
textWrap.enabled = false;
textWrap.linesLimit = 7;
textWrap.wrapHeight = 7;
setting.AmaterasuGui.apply()
function refreshSettings(textArray){
    clearInformation(textArray);
    setting.openGui();
}

function clearInformation(textArrayA) {
    let textArray = [...textArrayA];

        let extraLines = textArray.length - 7;
        if (extraLines > 0)
        textWrap.removeLines = (extraLines * -0.9);
    
    config.config = [];
    config.Information = [];     
    config
        .addTextParagraph({
            category: 'Information',
            configName: "infoPage",
            title: textArray.shift(),
            description: textArray.length > 0 ? textArray.join("\n") : "",
            centered: true
        });
    config._makeConfig();
    setting.config = config.config;
    setting.apply();
}

const settingsObj = setting;
const predefinedCategories = {
    "editing_route": "Misc",
    "use_route": "Misc",
    "route_developer_mode": "Misc",
    "party_finder_floor": "Dungeons"
}
const settings = setting.settings
export { config, refreshSettings, clearInformation, settingsObj, settings}
export function setConfigValue(name, value, category) {
    if (!category) 
        category = predefinedCategories[name]

    if (!category)
        throw new Error(`Category not found for ${name}`)
        
    setting.setConfigValue(category, name, value)
}

setTimeout(() => {
    ChatLib.chat("&6&lOrangeAddons &eSettings have been loaded!")
}, 1000)

export default setting.settings