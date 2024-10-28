import { @TextProperty, @Vigilant, @SwitchProperty } from 'Vigilance';

@Vigilant('OrangeAddons','OrangeAddons Settings')
class Settings {
    @SwitchProperty({
        name: 'Secrets per run',
        description: 'Displays your teammates secrets per run at the end of a run',
        category: 'Dungeons'
    })
    secrets_per_run = true;
    @SwitchProperty({
        name: 'Party Finder',
        description: 'Toggles the party finder module',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    party_finder = true;
    @SwitchProperty({
        name: 'Show own stats in Party Finder',
        description: 'Shows your own stats whenever you join a party (must have Party Finder enabled)',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    show_own_stats_in_party_finder = false;
    @SwitchProperty({
        name: 'Show Run Stats',
        description: 'Show peoples secrets per run, deaths and rooms cleared per run, from actual runs',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    show_run_stats = true;
    @SwitchProperty({
        name: 'Shitter List',
        description: 'Enable OA Shitter List',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    shitter_list = true;
    @SwitchProperty({
        name: 'Mobs per run',
        description: 'Show a players mobs per run in the floor you queueing for',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    mobs_per_run = true;
    @SwitchProperty({
        name: 'Cata Level',
        description: 'Show a players cata level',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    cata_level = true;
    @SwitchProperty({
        name: 'Death Count',
        description: 'Show a players dungeon death count',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    death_count = true;
    @SwitchProperty({
        name: 'Secret Count',
        description: 'Show a players secret count',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    secret_count = true;
    @SwitchProperty({
        name: 'Blood Mob Count',
        description: 'Show a players blood mob kills',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    blood_mob_count = true;
    @SwitchProperty({
        name: 'Cata 50 Date',
        description: 'Show when a player hit cata 50',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    cata_50_date = true;
    @SwitchProperty({
        name: 'Personal Bests',
        description: 'Shows players personal bests',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    personal_bests = true;
    @SwitchProperty({
        name: 'Ender Chest and Backpack Shown',
        description: 'Shows Ender Chest & Backpack results in items',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    ender_chest_and_backpack_shown = false;
    @SwitchProperty({
        name: 'Unique Pets',
        description: 'Show a players unique pets',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    unique_pets = true;
    @TextProperty({
        name: 'Party Finder Items',
        description: 'DO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    party_finder_items = '[     "HYPERION",     "SCYLLA",     "ASTRAEA",     "VALKYRIE",     "NECRON_BLADE",     "DARK_CLAYMORE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS",     "SPEED_WITHER_HELMET",     "SPEED_WITHER_CHESTPLATE",     "SPEED_WITHER_LEGGINGS",     "SPEED_WITHER_BOOTS",     "SPRING_BOOTS",     "JERRY_STAFF",     "DIAMOND_PICKAXE",     "ALPHA_PICK",     "STONK" ]';
    @TextProperty({
        name: 'Healer Party Finder Items',
        description: 'DO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    healer_party_finder_items = '[     "TERMINATOR",     "SOUL_WHIP",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]';
    @TextProperty({
        name: 'Mage Party Finder Items',
        description: 'DO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    mage_party_finder_items = '[     "DARK_CLAYMORE",     "WISE_WITHER_HELMET",     "WISE__WITHER_CHESTPLATE",     "WISE_WITHER_LEGGINGS",     "WISE_WITHER_BOOTS",     "LAST_BREATH",     "RAGNAROCK_AXE" ]';
    @TextProperty({
        name: 'Berserk Party Finder Items',
        description: 'DO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    berserk_party_finder_items = '[     "TERMINATOR",     "DARK_CLAYMORE",     "RAGNAROCK_AXE" ]';
    @TextProperty({
        name: 'Archer Party Finder Items',
        description: 'DO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    archer_party_finder_items = '[     "TERMINATOR",     "RAGNAROCK_AXE",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS" ]';
    @TextProperty({
        name: 'Tank Party Finder Items',
        description: 'DO NOT CHANGE UNLESS YOU KNOW WHAT YOURE DOING',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    tank_party_finder_items = '[     "TERMINATOR",     "TANK_WITHER_HELMET",     "TANK_WITHER_CHESTPLATE",     "TANK_WITHER_LEGGINGS",     "TANK_WITHER_BOOTS",     "LAST_BREATH",     "POWER_WITHER_HELMET",     "POWER_WITHER_CHESTPLATE",     "POWER_WITHER_LEGGINGS",     "POWER_WITHER_BOOTS",     "SOUL_WHIP",     "AXE_OF_THE_SHREDDED" ]';
    @TextProperty({
        name: 'Party Finder Floor',
        description: '(Automatcly Updates), what floor party finder messages will check with FMPR on join.',
        category: 'Dungeons',
        subcategory: 'Party Finder'
    })
    party_finder_floor = "F0";
    @TextProperty({
        name: 'Low Soulflow Amount',
        description: 'If your soulflow ever drops below this number, you will be alerted (-1 to disable)',
        category: 'Misc'
    })
    low_soulflow_amount = '500';
    @SwitchProperty({
        name: 'Remove Selfie Mode',
        description: 'Removes the selfie mode in f5',
        category: 'Misc'
    })
    remove_selfie_mode = false;
    @SwitchProperty({
        name: 'Katana Alerts',
        description: 'Alerts you when your Katana Expires',
        category: 'Misc'
    })
    katana_alerts = false;
    @SwitchProperty({
        name: 'Healing Wand Alerts',
        description: 'Alerts you when your healing wand expires!',
        category: 'Misc'
    })
    healing_wand_alerts = false;
    @SwitchProperty({
        name: 'Wither Cloak Alerts',
        description: 'Alerts you when you run out mana while using Wither Cloak!',
        category: 'Misc'
    })
    wither_cloak_alerts = true;
    @SwitchProperty({
        name: 'Weird Tuba Alerts',
        description: 'Alerts you when your Weird or Weirder Tuba Expires!',
        category: 'Misc'
    })
    weird_tuba_alerts = false;
    @SwitchProperty({
        name: 'Cells Alignment Alerts',
        description: 'Alerts you 2 Seconds Before Cells Alignment expires, and when it expires!',
        category: 'Misc'
    })
    cells_alignment_alerts = false;
    @SwitchProperty({
        name: 'Ice Spray alerts',
        description: 'Counts down when the mobs you ice sprayed will be let loose',
        category: 'Misc'
    })
    ice_spray_alerts = false;
    @SwitchProperty({
        name: 'Load Alerts Module',
        description: 'Toggles the alerts module (YOU MUST /ct load AFTER CHANGING THIS)',
        category: 'Loaders'
    })
    load_alerts_module = true;
    @SwitchProperty({
        name: 'Load Dungeons Module',
        description: 'Toggles the dungeons module (YOU MUST /ct load AFTER CHANGING THIS)',
        category: 'Loaders'
    })
    load_dungeons_module = true;
    @SwitchProperty({
        name: 'Load Kuudra Module',
        description: 'Toggles the kuudra module (YOU MUST /ct load AFTER CHANGING THIS)',
        category: 'Loaders'
    })
    load_kuudra_module = true;

    constructor() {
        this.initialize(this);
    }
}

export default new Settings();