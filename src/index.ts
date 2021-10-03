import express from "express";
import { ethers } from "ethers";


require('dotenv').config()

const app = express();

const math = require('mathjs')
const parseEther = require('ethers').utils.parseEther

app.use(express.json());

var cors=require('cors');

var kanga = require('../src/liquidity/kanga.js')

var bridge = require('../src/bridge/bridge.js');

app.use(cors({origin:true,credentials: true}));

// Hello World
app.get('/',(req, res) => {
    res.send('Hello World!');
});

// Get Info

app.get('/info',(req, res) => {
    res.send('Kanga Info get');
});

// Info
app.post('/info', async(req, res) => {
    const result = await kanga.getInfo(req,res)
    res.send('Kanga Info');
});

// Add Liquidity

app.post('/addLiquidity', async(req, res) => {
  const account_from = {
    privateKey: req.body.privateKey || process.env.PRIVATE_KEY || '',
    address: req.body.fromAddress || process.env.DEFAULT_ADDRESS || '',
    oneAddress: req.body.fromOneAddress || process.env.DEFAULT_ONE_ADDRESS || ''
  };
    console.log("account_from.privateKey: ", account_from.privateKey)
    console.log("process.env.HMY_NODE_URL: ", process.env.HMY_NODE_URL)
    const provider = new ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
    let wallet = new ethers.Wallet(account_from.privateKey, provider)
    let tokenA = req.body.tokenA || ""
    let tokenB = req.body.tokenB || ""
    let amountADesired = req.body.amountADesired || "0"
    let amountBDesired = req.body.amountBDesired || "0"
    let amountAMin = req.body.amountAMin || "0"
    let amountBMin = req.body.amountBMin || "0"
    let sendTo = req.body.to || ""
    let deadline = Date.now() + 1000 * 60 * 3
    let result = await kanga.addLiquidity(req,res)
    let addLiquidityResult = await kanga.addLiquidity(
      provider,
      wallet,
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      sendTo,
      deadline
    )

    let responseBody = {"addLiquidityResult": addLiquidityResult}

    console.log(`Returned receipt: ${addLiquidityResult}`)
  
    res.json(responseBody);
    //res.send('Kanga Add Liquidity');
});

// Remove Liquidity

app.post('/removeLiquidity', async(req, res) => {
  const account_from = {
    privateKey: req.body.privateKey || process.env.PRIVATE_KEY || '',
    address: req.body.fromAddress || process.env.DEFAULT_ADDRESS || '',
    oneAddress: req.body.fromOneAddress || process.env.DEFAULT_ONE_ADDRESS || ''
  };
    console.log("account_from.privateKey: ", account_from.privateKey)
    console.log("process.env.HMY_NODE_URL: ", process.env.HMY_NODE_URL)
    const provider = new ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
    let wallet = new ethers.Wallet(account_from.privateKey, provider)
    let tokenA = req.body.tokenA || ""
    let tokenB = req.body.tokenB || ""
    let removalPercentage = req.body.removalPercentage || 100
    let deadline = Date.now() + 1000 * 60 * 3
    let result = await kanga.removeLiquidity(req,res)
    let removeLiquidityResult = await kanga.removeLiquidity(
      provider,
      wallet,
      tokenA,
      tokenB,
      removalPercentage,
      deadline
    )

    let responseBody = {"removeLiquidityResult": removeLiquidityResult}

    console.log(`Returned removalLiquidityResult: ${removeLiquidityResult}`)
  
    res.json(responseBody);

    //res.send('Kanga Remove Liquidity')
});

// Swap on Kanga Liquidity Pool
app.post('/swap', async(req, res) => {

  const account_from = {
    privateKey: req.body.privateKey || process.env.PRIVATE_KEY || '',
    address: req.body.fromAddress || process.env.DEFAULT_ADDRESS || '',
    oneAddress: req.body.fromOneAddress || process.env.DEFAULT_ONE_ADDRESS || ''
  }
  let fromToken = req.body.fromToken || process.env.HMY_BUSD_CONTRACT || ''
  let toToken = req.body.toToken || process.env.HMY_bscBUSD_CONTRACT || ''
  let amount = req.body.amount || ''
  let recipientAddress = req.body.recipientAddress || process.env.DEFAULT_RECIPIENT_ADDRESS || ''

  let provider = new ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
  let wallet = new ethers.Wallet(account_from.privateKey, provider);

  let receipt = await kanga.swapForToken(amount,wallet, fromToken, toToken, recipientAddress)

  let responseBody = {"receipt": receipt}

  console.log(`Returned receipt: ${receipt}`)

  res.json(responseBody);
  
  //res.send('Kanga Swap');
});

// Get Balance
  
  app.post('/balance',async(req, res) => {
    //kanga.ExactInputTrade();
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    const provider = new ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
  
    // Variables
    const account_from = {
      privateKey: process.env.PRIVATE_KEY || '',
    };
  
    // Create Wallet
    let wallet = new ethers.Wallet(account_from.privateKey, provider);
  
    const tokenAddress = req.body.tokenAddress || ''
    console.log("tokenAddress: ", tokenAddress)
  
    let tokenBalance = await kanga.checkBalance(wallet, tokenAddress)
    console.log("Returned Token Balance: ", tokenBalance)
  
    let responseBody = {"tokenBalance": tokenBalance}
    res.json(responseBody);

  });
  
  // Flash Assets from Ethereum to BSC
  app.post('/flash', async(req, res) => {
    const jumperAddress = req.body.jumperAddress || process.env.JUMPER_ADDRESS
    const amount = req.body.amount || process.env.FLASH_AMOUNT
    const privateKey = req.body.privateKey || process.env.PRIVATE_KEY
    
    const lockResult = await bridge.Bridge(0,
      jumperAddress,
      process.env.ETH_NODE_URL,
      process.env.ETH_GAS_LIMIT,
      '../constants/abi/BUSD.json', 
      process.env.ETH_BUSD_CONTRACT,
      '../constants/abi/BUSDEthManager.json', 
      process.env.ETH_BUSD_MANAGER_CONTRACT, 
      privateKey, 
      amount)
  
    if (lockResult.success == true) {
      console.log("Assets Successfully Bridged, swapping bridged assets");
      const provider = new ethers.providers.JsonRpcProvider(process.env.HMY_NODE_URL);
      let wallet = new ethers.Wallet(privateKey, provider);
      const fromToken = process.env.HMY_BUSD_CONTRACT
      const toToken   = process.env.HMY_bscBUSD_CONTRACT
      const destinationAddress = jumperAddress
      await kanga.checkBalance(wallet, fromToken, amount).then(async(fromTokenBalanceHex) => {
        console.log(`From Token CheckBalance Result: ${JSON.stringify(fromTokenBalanceHex)}`)
        console.log(`amount._hex: ${JSON.stringify(parseEther(amount)._hex)}`)
        if (math.compare(parseEther(amount)._hex, fromTokenBalanceHex)) {
        // if (result.success == true) { 
          const swapResult = await kanga.swapForToken(amount, wallet, fromToken, toToken, destinationAddress)
          console.log(`swapResult: ${JSON.stringify(swapResult)}`)
          if (swapResult.success == true) {
            await kanga.checkBalance(wallet, toToken, amount).then(async(toTokenBalanceHex) => {
              console.log(`To Token CheckBalance Result: ${JSON.stringify(toTokenBalanceHex)}`)
              if (toTokenBalanceHex != '') { 
                await bridge.Bridge(1,
                  jumperAddress,
                  process.env.HMY_NODE_URL,
                  process.env.HMY_GAS_LIMIT,
                  '../constants/abi/BUSD.json', 
                  process.env.HMY_bscBUSD_CONTRACT,
                  '../constants/abi/BridgeManager.json', 
                  process.env.HMY_bscBUSD_MANAGER_CONTRACT, 
                  privateKey, 
                  amount)
              } else {
                res.send(swapResult);
              }
            })
          }
          res.send({ trx: "kanga", success: true});
        } else {
          console.log(`CheckBalance Result not True: ${JSON.stringify(fromTokenBalanceHex)}`)
          res.send(fromTokenBalanceHex);
        }
      })
  
    } else {
      console.log("Assets Bridging Failed");
      res.send(lockResult);
    }
  });

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));