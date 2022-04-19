import axios from 'axios';
import { ethers } from 'ethers';
import { MetaContract } from './MetaContract';
import { MetaWallet } from './MetaWallet';
import { ContractJson, ArgsJSON, AbiItem, ArgsNames } from './types/MetaContractTypes';


const abiCoder = new ethers.utils.AbiCoder();

function enableNoSuchMethod(obj: ContractWithWallet) {
    return new Proxy(obj, {
        get(target, p: string) {
            if (p in target) {
                return target[p];
            }
            else if (target["chain"] && target["toGasStation"]) {
                return async function (...args: any) {
                    return await target.handleContractFunctionCall.call(target, p, args);
                }
            }
            else {
                return function (...args: any) {
                    return target.__noSuchMethod__.call(target, p, args);
                }
            }
        }
    });
}

class ContractWithWallet {
    contract: MetaContract;
    wallet: MetaWallet;
    chain: string | null;
    toGasStation: string | null;
    [key: string]: any;
    __noSuchMethod__: () => void;

    constructor(contract: MetaContract, wallet: MetaWallet) {
        this.contract = contract;
        this.wallet = wallet;
        this.chain = null;
        this.toGasStation = null;
        this.__noSuchMethod__ = function (): void {
            throw new Error("Chain or Relayer are not defined! Use both 'on' and 'to' methods.");
        }
        return enableNoSuchMethod(this);
    }

    /**
     * Checks & Validates the called function 
     * 
     * @param {string} name - Contract function name to execute
     * @param {any} args - Arguments of the function to execute
     * @returns 
     */
    async handleContractFunctionCall(name: string, args: any) {
        if (!this.chain)
            throw new Error("No chain specified");

        let contractJSON: ContractJson | null = this.contract.getChainJson(this.chain);

        if (!contractJSON)
            throw new Error("No Contract provided on the specified chain");

        let contractABI: Array<AbiItem> = contractJSON.abi;
        let contractAddress: string = contractJSON.address;

        // get the function definition
        let functionABIs = contractABI.filter(function (item: AbiItem) {
            return item.name === name && item.type === "function";
        });

        if (functionABIs.length === 0)
            throw new Error(`No such function in the contract provided at address ${contractAddress}!`);

        let functionABI: AbiItem = functionABIs[0];

        // minus 4 because of the (hash, v, r, s)
        // let actualNumParams = functionABI.inputs.length - 4;

        // if (actualNumParams !== args.length)
        //   throw new Error(`Invalid number of arguments! \nExpected ${functionABI.inputs.length} but instead got ${args.length}`)

        // TODO check for types validity

        // for (let i = 0; i < args.length; i += 1) {
        //   if (functionABI.inputs[i].type === "address") 
        //     assert(args[i][0] === "0" && args[i][1] === "x", `The parameter ${functionABI.inputs[i].name} should be of type address!`) 

        //   if(functionABI.inputs[i].type === "string")
        //     assert(typeof(args[i]) === String, `The parameter ${functionABI.inputs[i].name} should be of type string!`)

        //   if(["uint", "uint8", "uin"]functionABI.inputs[i].type === "uint" || )

        // }

        let argsJSON: ArgsJSON[] = args.map((value: any, index: number) => {
            return {
                name: functionABI.inputs[index].name,
                value: value,
                type: functionABI.inputs[index].type
            }
        });

        return this.sendSignedTransaction(name, argsJSON);
    }

    /**
     * Signs the transaction with this.wallet and then relay it to the
     * provided gas station
     * 
     * @param {string} functionName - Contract function name to execute
     * @param {ArgsJSON[]} argsJSON - Arguments of the function to execute
     * @returns 
     */
    async sendSignedTransaction(functionName: string, argsJSON: ArgsJSON[]) {

        if (!this.toGasStation)
            throw new Error("No Gas Station Specified!");

        if (!this.chain)
            throw new Error("No chain specified");

        /* contains a key pair where 
        {
          param1_name: param1_value,
          param2_name: param2_value,
          ...
        }
        */
        let argsNames: ArgsNames = argsJSON.reduce(
            (obj, item) => Object.assign(obj, { [item.name]: item.value }), {}
        );

        // array with the params types (in the same order as in the function definition)
        let argsTypes: Array<string> = argsJSON.map((param) => (param["type"]));

        // array with the values of the params 
        let argsValues: Array<any> = argsJSON.map((param) => (param["value"]));

        let data = {
            ...argsNames,
        };

        console.log("DATA ", data);

        let toSignData = abiCoder.encode(
            argsTypes,
            argsValues,
        )

        let signature = await this.wallet.mumbai_wallet.sign(toSignData, this.wallet.mumbai_wallet.privateKey);

        console.log("Signature", signature);
        argsValues.push(signature.messageHash, signature.v, signature.r, signature.s);
        console.log(...argsValues);
        let txHash = await axios.post(this.toGasStation, {
            function: functionName,
            // args: argsJSON,
            contract: this.contract.getChainJson(this.chain),
            // txSignatureParsed: signature,
            // originalTX: data,
            args: argsValues
        });
        console.log(txHash);
        return txHash;
    }

    /**
     * Sets the Gas Station to use
     * 
     * @param {string} gas_station - Name of gas station
     * @returns {ContractWithWallet}
     */
    to(gas_station: string) {
        this.toGasStation = this.wallet.gasStations[gas_station];
        return this;
    }

    /**
     * Sets the chain to use
     * 
     * @param {string} chain - Name of the chain
     * @returns {ContractWithWallet}
     */
    on(chain: string) {
        this.chain = chain;
        return this;
    }
}

export {
    ContractWithWallet
}