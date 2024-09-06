import api from '../../../comms/legacy_backend';
import axios from 'axios';
import sleep from 'sleep';
import settings from '../../../../settings';
import global from '../../../comms/internal';
function loadSecretsPerRun() {
    let version = 2;
	const newline = /\<NL\>/;
    let dungeonteam = ['dummy',null,null,null,null,null];
	let dungeonsecrets = ['dummy',null,null,null,null,null];
	let dungeonactive = false;
	register('Chat', () => {
		if (settings.secrets_per_run == false) {
			return null;
		}
		sleep(1000, () => {

			dungeonteam[1] = null;
			dungeonteam[2] = null;
			dungeonteam[3] = null;
			dungeonteam[4] = null;
			dungeonteam[5] = null;
			dungeonsecrets[1] = null;
			dungeonsecrets[2] = null;
			dungeonsecrets[3] = null;
			dungeonsecrets[4] = null;
			dungeonsecrets[5] = null;
			function saveteammate(num,tabnum,data) {
				let tregex = /\[\d+\]\s([A-Za-z0-9_]{2,16}).+/;
				let datastrip = ChatLib.removeFormatting(data);
				let test = tregex.test(datastrip)
				if (test) {
					let datatemp = tregex.exec(datastrip)
					dungeonteam[num] = datatemp[1];
					secrets(num);
					let newnum = num + 1;
					let newtabnum = tabnum + 4
					saveteammate(newnum,newtabnum,TabList.getNames()[newtabnum])
				} else {
					dungeonteam[num] = null;
				}
			}
			function secrets(num) {
				if (dungeonteam[num]  != null && dungeonteam[num] != undefined) {
					const packet = {
						"type": "fetch",
						"payload":{
							"type": "secretCount",
							"name": dungeonteam[num]
						}
					}
					function send(count) {
						dungeonsecrets[num] = count;
					}
					if (global.returnPacket.secretCount[dungeonteam[num]] == undefined) {
						global.returnPacket.secretCount[dungeonteam[num]] = {}
					} 
					global.returnPacket.secretCount[dungeonteam[num]].send = send;
					global.sendData.send(JSON.stringify(packet))
				}
			}
			saveteammate(1,1,TabList.getNames()[1]);
			dungeonactive = true;
		});

	}).setCriteria('Starting in 1 second.');
	register('Chat', () => {
		sleep(3000, () => {
			let num = 1;
			function secrets(num) {
				if (dungeonteam[num] != null) {
					const packet = {
						"type": "secretsPerRun",
						"payload":{
							"name": dungeonteam[num],
							"secrets": dungeonsecrets[num]
						}
					}
					dungeonteam[num] = null;
					dungeonsecrets[num] = null;
					global.sendData.send(JSON.stringify(packet))
					newnum = num + 1;
					
					secrets(newnum);
				}
			}
			secrets(num);
			dungeonactive = false;
		});

	}).setCriteria('                             > EXTRA STATS <');
    console.log('OrangeAddons - Loaded Secrets Per Run!')
}
export default loadSecretsPerRun;