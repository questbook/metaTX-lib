import { ContractJson, AbiItem } from './types/MetaContractTypes';
import { MetaWallet } from './MetaWallet';
import { ContractWithWallet } from './ContractWithWallet';
declare class MetaContract {
    polygonContract: ContractJson | null;
    optimismContract: ContractJson | null;
    solanaContract: ContractJson | null;
    constructor();
    /**
     * Sets the polygon chain contract
     *
     * @param {Array<AbiItem>} abi - The contract's ABI
     * @param {string} contractAddress - The contract's address
     * @returns {void}
     *
    */
    polygon(abi: Array<AbiItem>, contractAddress: string): void;
    /**
     * Gets the information about the contract for a given chain
     *
     * @param {string} chain
     * @returns {ContractJson | null} - Contract details (abi, ContractAddress)
     */
    getChainJson(chain: string): ContractJson | null;
    /**
     * Attach a wallet with a contract to be able to call the contract
     * using the attached wallet
     *
     * @param {MetaWallet} wallet
     * @returns {ContractWithWallet} - Object to interact with the relayer
     *
     */
    attach(wallet: MetaWallet): ContractWithWallet;
}
export { MetaContract };
