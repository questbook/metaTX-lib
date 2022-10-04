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

class MetaWallet{
    address: string;
    gasStations: {
        [key: string]: string
    };
    wallets = {} as any;

    constructor() {
        // const privateKey: string | null = ""; //localStorage.getItem('privateKey');
        
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

    /**
     * Attach a gas station with this wallet to so it can be used 
     * as a relayer later
     * 
     * @param {string} gas_station - name of the gas station
     * @param {string} api_key - The API key (endpoint) of the gas station
     * @returns {void}
     */
    attachGasStation = (gas_station: string, api_key: string): void => {
        this.gasStations[gas_station] = api_key;
    }

    // @TODO: attach an API endpoint to call when building the execution transaction (using biconomy)

    // @TODO: get the right way to sign the transaction based on biconomy
    async getSignedTX(argsTypes: Array<string>, argsValues: Array<any>, functionName: string, functionParamsInterface: string) {

        let x = {argsTypes, argsValues, functionName, functionParamsInterface};
        return x;
       
    }

};

export {
    MetaWallet
}

