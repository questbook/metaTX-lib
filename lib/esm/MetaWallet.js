var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from 'ethers';
// let EIP712_SAFE_TX_TYPE = {
//     // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
//     SafeTx: [
//       { type: "address", name: "to" },
//       { type: "uint256", name: "value" },
//       { type: "bytes", name: "data" },
//       { type: "uint8", name: "operation" },
//       { type: "uint256", name: "safeTxGas" },
//       { type: "uint256", name: "baseGas" },
//       { type: "uint256", name: "gasPrice" },
//       { type: "address", name: "gasToken" },
//       { type: "address", name: "refundReceiver" },
//       { type: "uint256", name: "nonce" },
//     ],
//   };
// const abiCoder = new ethers.utils.AbiCoder();
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
        this.wallets["rinkeby"] = ethers.Wallet.createRandom();
        this.address = this.wallets["rinkeby"].address;
        this.gasStations = {};
    }
    getSignedTX(argsTypes, argsValues, functionName, functionParamsInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            let x = { argsTypes, argsValues, functionName, functionParamsInterface };
            return x;
        });
    }
}
;
export { MetaWallet };
