import Web3 from "web3";
const mumbaiProvider = new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/");
export const Web3Mumbai = new Web3(mumbaiProvider);
