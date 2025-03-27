import settings from '../../../../settings';
import sleep from 'sleep';
function loadpfGuiReader() {
    register('GuiOpened', () => {
        sleep(40, () => {
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
                
                settings.party_finder_floor = typedone + floordone;
                return ".";
            }
        });
        return ".";
    })
    
}
export default loadpfGuiReader;