import { MetaContract } from './MetaContract';
import { MetaWallet } from './MetaWallet';
import { ArgsJSON } from './types/MetaContractTypes';
declare class ContractWithWallet {
    contract: MetaContract;
    wallet: MetaWallet;
    chain: string | null;
    toGasStation: string | null;
    [key: string]: any;
    __noSuchMethod__: () => void;
    constructor(contract: MetaContract, wallet: MetaWallet);
    /**
     * Checks & Validates the called function
     *
     * @param {string} name - Contract function name to execute
     * @param {any} args - Arguments of the function to execute
     * @returns
     */
    handleContractFunctionCall(name: string, args: any): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * Signs the transaction with this.wallet and then relay it to the
     * provided gas station
     *
     * @param {string} functionName - Contract function name to execute
     * @param {ArgsJSON[]} argsJSON - Arguments of the function to execute
     * @returns
     */
    sendSignedTransaction(functionName: string, argsJSON: ArgsJSON[]): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * Sets the Gas Station to use
     *
     * @param {string} gas_station - Name of gas station
     * @returns {ContractWithWallet}
     */
    to(gas_station: string): this;
    /**
     * Sets the chain to use
     *
     * @param {string} chain - Name of the chain
     * @returns {ContractWithWallet}
     */
    on(chain: string): this;
}
export { ContractWithWallet };
