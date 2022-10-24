import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";

class Client extends Obj {
	get url() {
		let client = this;
		let {network, urls} = client;
		return urls[network];
	}
	async toGet(path) {
		let client = this;
		let {url} = client;
		let rsp = await fetch(url + path, {
			method: "GET",
			headers: {},
		});
		let json = await rsp.json();
		return json;
	}
	async toPost(path, data) {
		let client = this;
		let {url} = client;
		let rsp = await fetch(url + path, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: Object.entries(Object(data)).map(bi => bi.map(encodeURIComponent).join("=")).join("&"),
		});
		let json = await rsp.json();
		return json;
	}
	async toPut(path, data) {
		let client = this;
		let {url} = client;
		let rsp = await fetch(url + path, {
			method: "PUT",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: Object.entries(Object(data)).map(bi => bi.map(encodeURIComponent).join("=")).join("&"),
		});
		let json = await rsp.json();
		return json;
	}
	async toDelete(path) {
		let client = this;
		let {url} = client;
		let rsp = await fetch(url + path, {
			method: "DELETE",
			headers: {},
		});
		let json = await rsp.json();
		return json;
	}
	async toGetAddressInfo(address) {
		let client = this;
		let info = await client.toGet(`/address/${address}`);
		return info;
	}
	async toGetAddressBalance(address) {
		let client = this;
		let info = await client.toGetAddressInfo(address);
		let balance = (info.chain_stats.funded_txo_sum - info.chain_stats.spent_txo_sum) * 1e-8;
		return balance;
	}
}
cutil.extend(Client.prototype, {
	network: "mainnet",
	urls: {
		mainnet: "https://blockstream.info/api/",
		testnet: "https://blockstream.info/testnet/api/",
		liquid: "https://blockstream.info/liquid/api/",
	},
});

export {Client};
