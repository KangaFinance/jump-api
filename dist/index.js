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
const math = require('mathjs');
const parseEther = require('ethers').utils.parseEther;
app.use(express_1.default.json());
var cors = require('cors');
var kanga = require('../src/liquidity/kanga.js');
var bridge = require('../src/bridge/bridge.js');
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
app.post('/addLiquidity', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account_from = {
        privateKey: req.body.privateKey || process.env.PRIVATE_KEY || '',
        address: req.body.fromAddress || process.env.DEFAULT_ADDRESS || '',
        oneAddress: req.body.fromOneAddress || process.env.DEFAULT_ONE_ADDRESS || ''
    };
    console.log("account_from.privateKey: ", account_from.privateKey);
    console.log("process.env.HMY_NODE_URL: ", process.env.HMY_NODE_URL);
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
    let wallet = new ethers_1.ethers.Wallet(account_from.privateKey, provider);
    let tokenA = req.body.tokenA || "";
    let tokenB = req.body.tokenB || "";
    let amountADesired = req.body.amountADesired || "0";
    let amountBDesired = req.body.amountBDesired || "0";
    let amountAMin = req.body.amountAMin || "0";
    let amountBMin = req.body.amountBMin || "0";
    let sendTo = req.body.to || "";
    let deadline = Date.now() + 1000 * 60 * 3;
    let result = yield kanga.addLiquidity(req, res);
    let addLiquidityResult = yield kanga.addLiquidity(provider, wallet, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, sendTo, deadline);
    let responseBody = { "addLiquidityResult": addLiquidityResult };
    console.log(`Returned receipt: ${addLiquidityResult}`);
    res.json(responseBody);
}));
app.post('/removeLiquidity', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account_from = {
        privateKey: req.body.privateKey || process.env.PRIVATE_KEY || '',
        address: req.body.fromAddress || process.env.DEFAULT_ADDRESS || '',
        oneAddress: req.body.fromOneAddress || process.env.DEFAULT_ONE_ADDRESS || ''
    };
    console.log("account_from.privateKey: ", account_from.privateKey);
    console.log("process.env.HMY_NODE_URL: ", process.env.HMY_NODE_URL);
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
    let wallet = new ethers_1.ethers.Wallet(account_from.privateKey, provider);
    let tokenA = req.body.tokenA || "";
    let tokenB = req.body.tokenB || "";
    let removalPercentage = req.body.removalPercentage || 100;
    let deadline = Date.now() + 1000 * 60 * 3;
    let result = yield kanga.removeLiquidity(req, res);
    let removeLiquidityResult = yield kanga.removeLiquidity(provider, wallet, tokenA, tokenB, removalPercentage, deadline);
    let responseBody = { "removeLiquidityResult": removeLiquidityResult };
    console.log(`Returned removalLiquidityResult: ${removeLiquidityResult}`);
    res.json(responseBody);
}));
app.post('/swap', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account_from = {
        privateKey: req.body.privateKey || process.env.PRIVATE_KEY || '',
        address: req.body.fromAddress || process.env.DEFAULT_ADDRESS || '',
        oneAddress: req.body.fromOneAddress || process.env.DEFAULT_ONE_ADDRESS || ''
    };
    let fromToken = req.body.fromToken || process.env.HMY_BUSD_CONTRACT || '';
    let toToken = req.body.toToken || process.env.HMY_bscBUSD_CONTRACT || '';
    let amount = req.body.amount || '';
    let recipientAddress = req.body.recipientAddress || process.env.DEFAULT_RECIPIENT_ADDRESS || '';
    let provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
    let wallet = new ethers_1.ethers.Wallet(account_from.privateKey, provider);
    let receipt = yield kanga.swapForToken(amount, wallet, fromToken, toToken, recipientAddress);
    let responseBody = { "receipt": receipt };
    console.log(`Returned receipt: ${receipt}`);
    res.json(responseBody);
}));
app.post('/balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
app.post('/flash', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jumperAddress = req.body.jumperAddress || process.env.JUMPER_ADDRESS;
    const amount = req.body.amount || process.env.FLASH_AMOUNT;
    const privateKey = req.body.privateKey || process.env.PRIVATE_KEY;
    const lockResult = yield bridge.Bridge(0, jumperAddress, process.env.ETH_NODE_URL, process.env.ETH_GAS_LIMIT, '../constants/abi/BUSD.json', process.env.ETH_BUSD_CONTRACT, '../constants/abi/BUSDEthManager.json', process.env.ETH_BUSD_MANAGER_CONTRACT, privateKey, amount);
    if (lockResult.success == true) {
        console.log("Assets Successfully Bridged, swapping bridged assets");
        const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
        let wallet = new ethers_1.ethers.Wallet(privateKey, provider);
        const fromToken = process.env.HMY_BUSD_CONTRACT;
        const toToken = process.env.HMY_bscBUSD_CONTRACT;
        const destinationAddress = jumperAddress;
        yield kanga.checkBalance(wallet, fromToken, amount).then((fromTokenBalanceHex) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`From Token CheckBalance Result: ${JSON.stringify(fromTokenBalanceHex)}`);
            console.log(`amount._hex: ${JSON.stringify(parseEther(amount)._hex)}`);
            if (math.compare(parseEther(amount)._hex, fromTokenBalanceHex)) {
                const swapResult = yield kanga.swapForToken(amount, wallet, fromToken, toToken, destinationAddress);
                console.log(`swapResult: ${JSON.stringify(swapResult)}`);
                if (swapResult.success == true) {
                    yield kanga.checkBalance(wallet, toToken, amount).then((toTokenBalanceHex) => __awaiter(void 0, void 0, void 0, function* () {
                        console.log(`To Token CheckBalance Result: ${JSON.stringify(toTokenBalanceHex)}`);
                        if (toTokenBalanceHex != '') {
                            yield bridge.Bridge(1, jumperAddress, process.env.HMY_NODE_URL, process.env.HMY_GAS_LIMIT, '../constants/abi/BUSD.json', process.env.HMY_bscBUSD_CONTRACT, '../constants/abi/BridgeManager.json', process.env.HMY_bscBUSD_MANAGER_CONTRACT, privateKey, amount);
                        }
                        else {
                            res.send(swapResult);
                        }
                    }));
                }
                res.send({ trx: "kanga", success: true });
            }
            else {
                console.log(`CheckBalance Result not True: ${JSON.stringify(fromTokenBalanceHex)}`);
                res.send(fromTokenBalanceHex);
            }
        }));
    }
    else {
        console.log("Assets Bridging Failed");
        res.send(lockResult);
    }
}));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on PORT ${port}`));
//# sourceMappingURL=index.js.map