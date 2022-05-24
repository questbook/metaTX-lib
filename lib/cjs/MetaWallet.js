"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaWallet = void 0;
const web3_1 = require("./contexts/web3");
const ethers_1 = require("ethers");
const abiCoder = new ethers_1.ethers.utils.AbiCoder();
// const web3Mumbai: Web3 = Web3Mumbai;
const web3Rinkeby = web3_1.Web3Rinkeby;
class MetaWallet {
    constructor() {
        // const privateKey: string | null = ""; //localStorage.getItem('privateKey');
        this.wallets = {};
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
        // create a wallet from localstorage privateKey
        // or create a new one if no privateKey is found
        // this.mumbaiWallet = privateKey != null
        //     ? web3Mumbai.eth.accounts.privateKeyToAccount(privateKey)
        //     : web3Mumbai.eth.accounts.create();
        // if (privateKey === null)
        //     localStorage.setItem('privateKey', this.mumbaiWallet.privateKey);
        this.wallets["rinkeby"] = web3Rinkeby.eth.accounts.create();
        this.address = this.wallets["rinkeby"].address;
        this.gasStations = {};
    }
    getSignedTX(argsTypes, argsValues) {
        return __awaiter(this, void 0, void 0, function* () {
            let toSignData = abiCoder.encode(argsTypes, argsValues);
            let signature = yield this.wallets["rinkeby"].sign(toSignData, this.wallets["rinkeby"].privateKey);
            let returnArgs = argsValues;
            returnArgs.push({ txHash: signature.messageHash, v: signature.v, r: signature.r, s: signature.s });
            return returnArgs;
        });
    }
}
exports.MetaWallet = MetaWallet;
;
