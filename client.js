import { cutil } from "@ghasemkiani/base";
import { Obj } from "@ghasemkiani/base";
import { fetch as toFetch } from "@ghasemkiani/fetch";
import { d } from "@ghasemkiani/decimal";

class Client extends Obj {
  static {
    cutil.extend(this.prototype, {
      proxify: false,
      network: "mainnet",
      urls: {
        mainnet: "https://blockstream.info/api/",
        testnet: "https://blockstream.info/testnet/api/",
        liquid: "https://blockstream.info/liquid/api/",
      },
    });
  }
  toFetch(...rest) {
    let client = this;
    let { proxify } = client;
    if (proxify) {
      let [url, options] = rest;
      return toFetch(url, options);
    } else {
      return fetch(...rest);
    }
  }
  get url() {
    let client = this;
    let { network, urls } = client;
    return urls[network];
  }
  async toGet(path) {
    let client = this;
    let { url } = client;
    let rsp = await client.toFetch(url + path, {
      method: "GET",
      headers: {},
    });
    let json = await rsp.json();
    return json;
  }
  async toPost(path, data) {
    let client = this;
    let { url } = client;
    let rsp = await client.toFetch(url + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.entries(Object(data))
        .map((bi) => bi.map(encodeURIComponent).join("="))
        .join("&"),
    });
    let json = await rsp.json();
    return json;
  }
  async toPut(path, data) {
    let client = this;
    let { url } = client;
    let rsp = await client.toFetch(url + path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.entries(Object(data))
        .map((bi) => bi.map(encodeURIComponent).join("="))
        .join("&"),
    });
    let json = await rsp.json();
    return json;
  }
  async toDelete(path) {
    let client = this;
    let { url } = client;
    let rsp = await client.toFetch(url + path, {
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
  async toGetUtxos(address) {
    let client = this;
    let info = await client.toGet(`/address/${address}/utxo`);
    return info;
  }
  async toGetAddressBalance_(address) {
    let client = this;
    let info = await client.toGetAddressInfo(address);
    let balance_ = d(info.chain_stats.funded_txo_sum)
      .minus(info.chain_stats.spent_txo_sum)
      .toFixed(0);
    return balance_;
  }
  async toGetAddressBalance(address) {
    let client = this;
    let balance_ = await client.toGetAddressBalance_(address);
    let balance = d(balance_).mul(1e-8).toNumber();
    return balance;
  }
}

export { Client };
