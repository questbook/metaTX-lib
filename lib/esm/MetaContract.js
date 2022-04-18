import { ContractWithWallet } from './ContractWithWallet';
class MetaContract {
    constructor() {
        this.polygonContract = null;
        this.optimismContract = null;
        this.solanaContract = null;
    }
    /**
     * Sets the polygon chain contract
     *
     * @param {Array<AbiItem>} abi - The contract's ABI
     * @param {string} contractAddress - The contract's address
     * @returns {void}
     *
    */
    polygon(abi, contractAddress) {
        this.polygonContract = {
            abi: abi,
            address: contractAddress
        };
    }
    /**
     * Gets the information about the contract for a given chain
     *
     * @param {string} chain
     * @returns {ContractJson | null} - Contract details (abi, ContractAddress)
     */
    getChainJson(chain) {
        if (chain === "polygon") {
            return this.polygonContract;
        }
        if (chain === "optimism") {
            return this.optimismContract;
        }
        return null;
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
