import Web3 from "web3";
const mumbaiProvider = new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/");
const rinkebyProvider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/");
export const Web3Mumbai = new Web3(mumbaiProvider);
export const Web3Rinkeby = new Web3(rinkebyProvider);
