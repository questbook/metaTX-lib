import { Web3Mumbai } from './contexts/web3';
import Web3 from "web3";

const web3Mumbai: Web3 = Web3Mumbai;

class MetaWallet{
    address: string;
    gasStations: {
        [key: string]: string
    };
    mumbai_wallet: any; // TODO change type

    constructor() {
        const privateKey: string | null = localStorage.getItem('privateKey');

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

    /**
     * Attach a gas station with this wallet to so it can be used 
     * as a relayer later
     * 
     * @param {string} gas_station - name of the gas station
     * @param {string} api_key - The API key (endpoint) of the gas station
     * @returns {void}
     */
    attachGasStation = (gas_station: string, api_key: string) => {
        this.gasStations[gas_station] = api_key;
    }

};

export {
    MetaWallet
}

