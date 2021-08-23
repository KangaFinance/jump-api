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
const ChainId = require('@kangafinance/sdk').ChainId;
const ethers = require('ethers');
const ROUTER_ADDRESSES = require('@kangafinance/sdk').ROUTER_ADDRESSES;
module.exports.getInfo = function (chain) {
    return __awaiter(this, void 0, void 0, function* () {
        yield getInfo(chain);
    });
};
const getInfo = function (chain) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("chain: ", chain);
            console.log("ROUTER_ADDRESSES: ", ROUTER_ADDRESSES);
            return "Harmony Testnet is 123";
        }
        catch (e) {
            console.error("Error: ", e.message, e);
        }
    });
};
//# sourceMappingURL=kanga.js.map