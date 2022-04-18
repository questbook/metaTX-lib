declare class MetaWallet {
    address: string;
    gasStations: {
        [key: string]: string;
    };
    mumbai_wallet: any;
    constructor();
    /**
     * Attach a gas station with this wallet to so it can be used
     * as a relayer later
     *
     * @param {string} gas_station - name of the gas station
     * @param {string} api_key - The API key (endpoint) of the gas station
     * @returns {void}
     */
    attachGasStation: (gas_station: string, api_key: string) => void;
}
export { MetaWallet };
