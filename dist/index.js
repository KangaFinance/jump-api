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
const express_1 = __importDefault(require("express"));
const ethers_1 = require("ethers");
require('dotenv').config();
const app = express_1.default();
app.use(express_1.default.json());
var cors = require('cors');
var kanga = require('../src/kanga.js');
app.use(cors({ origin: true, credentials: true }));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/info', (req, res) => {
    res.send('Kanga Info get');
});
app.post('/info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield kanga.getInfo(req, res);
    res.send('Kanga Info');
}));
app.post('/kanga/addLiquidity', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield kanga.getInfo(req, res);
    res.send('Kanga Add Liquidity');
}));
app.post('/kanga/withdrawLiquidity', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield kanga.getInfo(req, res);
    res.send('Kanga Withdraw Liquidity');
}));
app.post('/kanga/swap', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = req.body.amount;
    const oneAddress = req.body.oneAddress;
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
    let wallet = new ethers_1.ethers.Wallet(req.body.wallet, provider);
    const fromToken = process.env.HMY_BUSD_CONTRACT;
    const toToken = process.env.HMY_BSCBUSD_CONTRACT;
    const destinationAddress = oneAddress;
    kanga.swapForToken(amount, wallet, fromToken, toToken, destinationAddress);
    res.send('kanga Swap');
}));
app.post('/kanga/balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
    const account_from = {
        privateKey: process.env.PRIVATE_KEY || '',
    };
    let wallet = new ethers_1.ethers.Wallet(account_from.privateKey, provider);
    const tokenAddress = req.body.tokenAddress || '';
    console.log("tokenAddress: ", tokenAddress);
    let tokenBalance = yield kanga.checkBalance(wallet, tokenAddress);
    console.log("Returned Token Balance: ", tokenBalance);
    let responseBody = { "tokenBalance": tokenBalance };
    res.json(responseBody);
}));
app.get('/test/kanga/swap', (req, res) => {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
    const account_from = {
        privateKey: process.env.PRIVATE_KEY || '',
    };
    let wallet = new ethers_1.ethers.Wallet(account_from.privateKey, provider);
    const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425';
    const toToken = '0x6d307636323688cc3fe618ccba695efc7a94f813';
    const destinationAddress = '0x9E1AD78422Fd571B26D93EeB895f631A67Cd5462';
    kanga.swapForToken("1", wallet, fromToken, toToken, destinationAddress);
    res.send('Test Kanga Swap');
});
app.get('/test/kanga/balance', (req, res) => {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
    const account_from = {
        privateKey: process.env.PRIVATE_KEY,
    };
    let wallet = new ethers_1.ethers.Wallet('ca5073a6e8dbd0b86ba192262c801f97561aa0d81398f7886219ee6feb21c80a', provider);
    const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425';
    kanga.checkBalance(wallet, fromToken, "1");
    res.send('Test Balance');
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on PORT ${port}`));
//# sourceMappingURL=index.js.map