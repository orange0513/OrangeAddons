import settings from '../../config';
import axios from 'axios';
function api(item, key, data, data2, data3, data4) {
	let version = 2;
	const newline = /\<NL\>/;
    let url = "https://api.orange0513.com/hypixel/";
	let apikey = "";
	if (settings.apikey != "none") {
		apikey = "&key="+ settings.orangeaddons_api_key;
	}
    axios.get(url + item +"?name="+ key +"&data="+ data +"&data2="+ data2 +"&data3="+ data3 +"&data4="+ data4 + apikey, {
		headers: {
			"User-Agent": "Mozilla/5.0 (CT - OrangeAddons)",
			"OA": true,
			"OA-V": version,
			"auth": ""+ Player.getName() +"-"+ Date.now()
		}
	})
	.then(response => {
		let finaldata = response.data;
		while (true) {
			if (newline.test(finaldata)) {
			 const sep = linechecker.exec(finaldata)
			 ChatLib.chat(sep[1])
			 finaldata = sep[3];
			} else {
				break;
			}
		}
		ChatLib.chat(finaldata);
	})
	.catch(error => {
		print("error: "+ error);
	})
}
function apireturn(item, key, data) {
    let url = "https://api.orange0513.com/hypixel/";
	let apikey = "";
	if (settings.apikey != "none") {
		apikey = "&key="+ settings.orangeaddons_api_key;
	}
    axios.get(url + item +"?name="+ key +"&data="+ data + apikey)
	    .then(response => {
			return response.data.replace(newline, "\n");
        })
        .catch(function(error) {
            print("error: "+ error);
        });
}
function apinumber(item, key, data) {
    let url = "https://api.orange0513.com/hypixel/";
	let apikey = "";
	if (settings.apikey != "none") {
		apikey = "&key="+ settings.orangeaddons_api_key;
	}
    axios.get(url + item +"?n1="+ key +"&n2="+ data + apikey, {
		headers: {
			"User-Agent": "Mozilla/5.0 (CT - OrangeAddons)",
			"OA": true,
			"OA-V": version,
			"auth": ""+ Player.getName() +"-"+ Date.now()
		}
	})
	.then(response => {
		sendmsg(response.data.replace(newline, "\n"));
	})
	.catch(error => {
		print("error: "+ error);
	})
}
function apidev(key1, key2, boom, data2, data3) {
    let url = "https://api.orange0513.com/hypixel/ur";
	let apikey = "";
	if (settings.apikey != "none") {
    apikey = "&key="+ settings.orangeaddons_api_key;
	}
    axios.get(url +"?cmd="+ key1 +"&name="+ key2 +"&data2="+ data2 +"&data3="+ data3 +"&v=0.2.0&data="+ boom + apikey, {
		headers: {
			"User-Agent": "Mozilla/5.0 (CT - OrangeAddons)",
			"OA": true,
			"OA-V": version,
			"auth": ""+ Player.getName() +"-"+ Date.now()
		}
	})
	.then(response => {
		sendmsg(response.data.replace(newline, "\n"));
	})
	.catch(error => {
		print("error: "+ error);
	})
}
export default api;
export { apireturn, apinumber, apidev };
