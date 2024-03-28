import registerStaffCommands from "./commands/staff_commands";
function loadStaffModule(settings) {
    console.log('OrangeAddons - Loading Staff Module...')
    registerStaffCommands(settings);
    console.log('OrangeAddons - Loaded Staff Module!')
}
export default loadStaffModule;