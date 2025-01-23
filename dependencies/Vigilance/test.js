import Settings from "./example";

console.log(`text input value: ${Settings.textInput}`);

register("command", () => Settings.openGUI()).setName("testconfig");