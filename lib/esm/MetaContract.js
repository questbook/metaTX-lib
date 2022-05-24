var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ContractWithWallet } from './ContractWithWallet';
function enableNoSuchMethod(obj) {
    return new Proxy(obj, {
        get(target, p) {
            if (p in target) {
                return target[p];
            }
            else if (target["supportedChains"].includes(p.toLowerCase())) {
                return function (...args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let newArgs = [p];
                        newArgs.push(...args);
                        return yield target.addChain.call(target, ...newArgs);
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
class MetaContract {
    constructor() {
        // Store different chains' contracts information
        this.supportedChains = ["ethereum", "polygon"];
        this.contract = {};
        this.supportedChains.forEach((chain) => { this.contract[chain] = null; });
        this.__noSuchMethod__ = function () {
            throw new Error("No such function / Chain provided is not supported yet!");
        };
        return enableNoSuchMethod(this);
    }
    /**
     * Sets the polygon chain contract
     *
     * @param {Array<AbiItem>} abi - The contract's ABI
     * @param {string} contractAddress - The contract's address
     * @returns {void}
     *
    */
    addChain(chain, abi, contractAddress) {
        console.log(chain, abi, contractAddress);
        this.contract[chain] = {
            abi: abi,
            address: contractAddress
        };
    }
    /**
     * Sets the polygon chain contract
     *
     * @param {Array<AbiItem>} abi - The contract's ABI
     * @param {string} contractAddress - The contract's address
     * @returns {void}
     *
    */
    /**
     * Gets the information about the contract for a given chain
     *
     * @param {string} chain
     * @returns {ContractJson | null} - Contract details (abi, ContractAddress)
     */
    getChainJson(chain) {
        return this.contract[chain];
    }
    /**
     * Attach a wallet with a contract to be able to call the contract
     * using the attached wallet
     *
     * @param {MetaWallet} wallet
     * @returns {ContractWithWallet} - Object to interact with the relayer
     *
     */
    attach(wallet) {
        return new ContractWithWallet(this, wallet);
    }
}
export { MetaContract };
