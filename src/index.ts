import express from "express";
import { ethers } from "ethers";


require('dotenv').config()

const app = express();

app.use(express.json());

var cors=require('cors');

var kanga = require('../src/kanga.js')

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

app.post('/kanga/addLiquidity', async(req, res) => {
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

app.post('/kanga/removeLiquidity', async(req, res) => {
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

// Swap
app.post('/kanga/swap', async(req, res) => {

  const account_from = {
    privateKey: req.body.privateKey || process.env.PRIVATE_KEY || '',
    address: req.body.fromAddress || process.env.DEFAULT_ADDRESS || '',
    oneAddress: req.body.fromOneAddress || process.env.DEFAULT_ONE_ADDRESS || ''
  }
  let fromToken = req.body.fromToken || process.env.HMY_BUSD_CONTRACT || ''
  let toToken = req.body.toToken || process.env.HMY_BSCBUSD_CONTRACT || ''
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
  
  app.post('/kanga/balance',async(req, res) => {
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
  
    // walletAddress BUSD 0xc4860463c59d59a9afac9fde35dff9da363e8425
    // tokenAddress 0x8875fc2A47E35ACD1784bB5f58f563dFE86A8451
  
    // const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425' // BUSD
    // const walletAddress = req.body.walletAddress || ''
    const tokenAddress = req.body.tokenAddress || ''
    console.log("tokenAddress: ", tokenAddress)
  
    let tokenBalance = await kanga.checkBalance(wallet, tokenAddress)
    console.log("Returned Token Balance: ", tokenBalance)
  
    //res.send('Balance');
    // res.send(tokenBalance);
    let responseBody = {"tokenBalance": tokenBalance}
    res.json(responseBody);

  });
  
  // Test Endpoints
  
  app.get('/test/kanga/swap',(req, res) => {
    
    //kanga.ExactInputTrade();
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
  
    // Variables
    const account_from = {
      privateKey: process.env.PRIVATE_KEY || '',
    };
  
    // Create Wallet
    let wallet = new ethers.Wallet(account_from.privateKey, provider);
  
    // From BUSD 0xc4860463c59d59a9afac9fde35dff9da363e8425
    // To bscBUSD 0x6d307636323688cc3fe618ccba695efc7a94f813
  
    const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425' // BUSD
    const toToken = '0x6d307636323688cc3fe618ccba695efc7a94f813'   // bscBUSD
  
    const destinationAddress = '0x9E1AD78422Fd571B26D93EeB895f631A67Cd5462'
  
    kanga.swapForToken("1",wallet, fromToken, toToken, destinationAddress)
    
    res.send('Test Kanga Swap');
  });
  
  app.get('/test/kanga/balance',(req, res) => {
    // kanga.ExactInputTrade();
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    const provider = new ethers.providers.JsonRpcProvider(process.env.HARMONY_NODE_URL);
  
    // Variables
    const account_from = {
      privateKey: process.env.PRIVATE_KEY || "",
    };
  
    // Create Wallet
    let wallet = new ethers.Wallet(account_from.privateKey, provider);
  
    // From BUSD 0xc4860463c59d59a9afac9fde35dff9da363e8425
    // To bscBUSD 0x6d307636323688cc3fe618ccba695efc7a94f813
  
    const fromToken = '0xc4860463c59d59a9afac9fde35dff9da363e8425' // BUSD
  
    kanga.checkBalance(wallet, fromToken, "1")
    res.send('Test Balance');
  
    
  
  });

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));