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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractWithWallet = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const abiCoder = new ethers_1.ethers.utils.AbiCoder();
function enableNoSuchMethod(obj) {
    return new Proxy(obj, {
        get(target, p) {
            if (p in target) {
                return target[p];
            }
            else if (target["chain"] && target["toGasStation"]) {
                return function (...args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield target.handleContractFunctionCall.call(target, p, args);
                    });
                };
            }
            else {
                return function (...args) {
                    return target.__noSuchMethod__.call(target, p, args);
                };
            }
        }
    });
}
class ContractWithWallet {
    constructor(contract, wallet) {
        this.contract = contract;
        this.wallet = wallet;
        this.chain = null;
        this.toGasStation = null;
        this.__noSuchMethod__ = function () {
            throw new Error("Chain or Relayer are not defined! Use both 'on' and 'to' methods.");
        };
        return enableNoSuchMethod(this);
    }
    /**
     * Checks & Validates the called function
     *
     * @param {string} name - Contract function name to execute
     * @param {any} args - Arguments of the function to execute
     * @returns
     */
    handleContractFunctionCall(name, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.chain)
                throw new Error("No chain specified");
            let contractJSON = this.contract.getChainJson(this.chain);
            if (!contractJSON)
                throw new Error("No Contract provided on the specified chain");
            let contractABI = contractJSON.abi;
            let contractAddress = contractJSON.address;
            // get the function definition
            let functionABIs = contractABI.filter(function (item) {
                return item.name === name && item.type === "function";
            });
            if (functionABIs.length === 0)
                throw new Error(`No such function in the contract provided at address ${contractAddress}!`);
            let functionABI = functionABIs[0];
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
            let argsJSON = args.map((value, index) => {
                return {
                    name: functionABI.inputs[index].name,
                    value: value,
                    type: functionABI.inputs[index].type
                };
            });
            return this.sendSignedTransaction(name, argsJSON);
        });
    }
    /**
     * Signs the transaction with this.wallet and then relay it to the
     * provided gas station
     *
     * @param {string} functionName - Contract function name to execute
     * @param {ArgsJSON[]} argsJSON - Arguments of the function to execute
     * @returns
     */
    sendSignedTransaction(functionName, argsJSON) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let argsNames = argsJSON.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {});
            // array with the params types (in the same order as in the function definition)
            let argsTypes = argsJSON.map((param) => (param["type"]));
            // array with the values of the params 
            let argsValues = argsJSON.map((param) => (param["value"]));
            let data = Object.assign({}, argsNames);
            console.log("DATA ", data);
            let toSignData = abiCoder.encode(argsTypes, argsValues);
            let signature = yield this.wallet.mumbai_wallet.sign(toSignData, this.wallet.mumbai_wallet.privateKey);
            console.log("Signature", signature);
            let txHash = yield axios_1.default.post(this.toGasStation, {
                function: functionName,
                args: argsJSON,
                contract: this.contract.getChainJson(this.chain),
                txSignatureParsed: signature,
                originalTX: data
            });
            return txHash;
        });
    }
    /**
     * Sets the Gas Station to use
     *
     * @param {string} gas_station - Name of gas station
     * @returns {ContractWithWallet}
     */
    to(gas_station) {
        this.toGasStation = this.wallet.gasStations[gas_station];
        return this;
    }
    /**
     * Sets the chain to use
     *
     * @param {string} chain - Name of the chain
     * @returns {ContractWithWallet}
     */
    on(chain) {
        this.chain = chain;
        return this;
    }
}
exports.ContractWithWallet = ContractWithWallet;
