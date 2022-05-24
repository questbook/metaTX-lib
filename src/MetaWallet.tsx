import { Web3Rinkeby } from './contexts/web3';
import Web3 from "web3";
import { ethers } from 'ethers';

const abiCoder = new ethers.utils.AbiCoder();

// const web3Mumbai: Web3 = Web3Mumbai;
const web3Rinkeby: Web3 = Web3Rinkeby;

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
        this.wallets["rinkeby"] = web3Rinkeby.eth.accounts.create();
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

    async getSignedTX(argsTypes: Array<string>, argsValues: Array<any>, functionName: string, functionParamsInterface: string) {

        let toSignData = abiCoder.encode(
            argsTypes,
            argsValues,
        );

        let signature = await this.wallets["rinkeby"].sign(toSignData, this.wallets["rinkeby"].privateKey);

        const functionInterface = new ethers.utils.Interface([
            "function " + functionName + functionParamsInterface
        ])

        const data = functionInterface.encodeFunctionData(
            functionName, argsValues
        )

        let newArgsTypes = ["tuple(bytes32, uint8, bytes32, bytes32)"];
        newArgsTypes.push(...argsTypes);

        let newArgsValues = [[signature.messageHash, signature.v, signature.r, signature.s]];
        newArgsValues.push(...argsValues);
        
        let gaslessArgs = abiCoder.encode(
            newArgsTypes,
            newArgsValues
        );

        let newData = data.substring(0, 10) + gaslessArgs.substring(2);

        return newData;
    }

};

export {
    MetaWallet
}

