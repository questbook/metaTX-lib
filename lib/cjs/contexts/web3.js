"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Rinkeby = exports.Web3Mumbai = void 0;
const web3_1 = __importDefault(require("web3"));
const mumbaiProvider = new web3_1.default.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/");
const rinkebyProvider = new web3_1.default.providers.HttpProvider("https://rinkeby.infura.io/v3/");
exports.Web3Mumbai = new web3_1.default(mumbaiProvider);
exports.Web3Rinkeby = new web3_1.default(rinkebyProvider);
