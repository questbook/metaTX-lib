"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaWallet = void 0;
const web3_1 = require("./contexts/web3");
const web3Mumbai = web3_1.Web3Mumbai;
class MetaWallet {
    constructor() {
        /**
         * Attach a gas station with this wallet to so it can be used
         * as a relayer later
         *
         * @param {string} gas_station - name of the gas station
         * @param {string} api_key - The API key (endpoint) of the gas station
         * @returns {void}
         */
        this.attachGasStation = (gas_station, api_key) => {
            this.gasStations[gas_station] = api_key;
        };
        const privateKey = localStorage.getItem('privateKey');
        // create a wallet from localstorage privateKey
        // or create a new one if no privateKey is found
        this.mumbai_wallet = privateKey != null
            ? web3Mumbai.eth.accounts.privateKeyToAccount(privateKey)
            : web3Mumbai.eth.accounts.create();
        if (privateKey === null)
            localStorage.setItem('privateKey', this.mumbai_wallet.privateKey);
        this.address = this.mumbai_wallet.address;
        this.gasStations = {};
    }
}
exports.MetaWallet = MetaWallet;
;
