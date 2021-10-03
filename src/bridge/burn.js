require("dotenv").config()

const { BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE, ACTION_TYPE } = require('bridge-sdk')
const configs = require('bridge-sdk/lib/configs')
const BN = require('bn.js')
const ethers = require('ethers');
const formatEther = require('ethers').utils.formatEther
const parseEther = require('ethers').utils.parseEther

/*
 * Exports for all public functions
*/
module.exports.Burn = async function(depositTxnHash, approveTxnHash, burnTxnHash, jumperAddress, amount) {
  return await burn(depositTxnHash, approveTxnHash, burnTxnHash, jumperAddress, amount)
}
module.exports.Deposit = async function(nodeURL, gasLimit, abiJson,  privateKey, depositAmountInWei) {
  return await deposit(nodeURL, gasLimit, abiJson,  privateKey, depositAmountInWei)
}
module.exports.BurnTxn = async function(nodeURL, gasLimit, abiJson, contractManagerAddress, privateKey, amountInWei) {
  return await burnTxn(nodeURL, gasLimit, abiJson, contractManagerAddress, privateKey, amountInWei)
}

/* Signs a `deposit` transaction and generates a hash
 * @param {string} nodeURL
 * @param {string} gasLimit
 * @param {string} abiJson
 * @param {string} privateKey
 * @param {string} amount
 * @return {string} JSON with the request response
*/
async function deposit(nodeURL, gasLimit, abiJson,  privateKey, depositAmountInWei) {
  const provider = new ethers.providers.JsonRpcProvider(nodeURL)
  let wallet = new ethers.Wallet(privateKey, provider)
  const depositJson = require(abiJson)
  const depositContract = new ethers.Contract(
    process.env.HMY_DEPOSIT_CONTRACT,
    depositJson.abi,
    wallet,
  )
  // console.log(`toWei: 15000000000000000000`)
  // console.log(`psEth: ${JSON.stringify(parseEther("15"))}`)
  console.log(`depositAmountInWei: ${depositAmountInWei}`)
  const tx = await depositContract.deposit(
    parseEther('15'),
    // depositAmountInWei,
    {
      gasLimit: gasLimit,
      value: parseEther('15') 
    }
  ) 
  const receipt = await tx.wait()
  const success = receipt && receipt.status === 1
  console.log(
    `depositTxn -  Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
  )
  return tx
}

/* Signs a `burn` transaction and generates a hash
 * @param {string} nodeURL
 * @param {string} gasLimit
 * @param {string} abiJson
 * @param {string} contractManagerAddress
 * @param {string} privateKey
 * @param {BigNumber} amountInWei
 * @return {string} JSON with the request response
*/
async function burnTxn(nodeURL, gasLimit, abiJson, contractManagerAddress, privateKey, amountInWei) {
  const provider = new ethers.providers.JsonRpcProvider(nodeURL)
  let wallet = new ethers.Wallet(privateKey, provider)
  const busdJson = require(abiJson)
  const busdContractManager = new ethers.Contract(
    contractManagerAddress,
    busdJson.abi,
    wallet,
  );
  const tx = await busdContractManager.burnToken(
    process.env.HMY_bscBUSD_CONTRACT, 
    amountInWei, 
    wallet.address,
    {
      gasLimit: gasLimit
    }
  )  
  const receipt = await tx.wait()
  const success = receipt && receipt.status === 1
  console.log(
    `burnTxn -  Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
  )
  return tx
}

/* Bridges assets from Harmony to Ethereum or BSC networks
 * @param {string} depositTxnHash
 * @param {string} approveTxnHash
 * @param {string} burnTxnHash
 * @param {string} jumperAddress
 * @param {string} amount
 * @return {string} JSON with the request response
*/
const burn = async (depositTxnHash, approveTxnHash, burnTxnHash, jumperAddress, amount) => {
  try {
    
    const bridgeSDK = new BridgeSDK({ logLevel: 2 })
    await bridgeSDK.init(configs.testnet)
    console.log(`Bridge Initialized for Testnet`)
    formattedAmount = amount/1e18
    formattedAmount = 2
    jumperOneAddress = process.env.JUMPER_ONE_ADDRESS 

    // bridgeSDK.addOneWallet(process.env.PRIVATE_KEY);

    console.log(`One Wallet Added`)
    console.log(`type: ${EXCHANGE_MODE.ONE_TO_ETH}`)
    console.log(`token: ${TOKEN.BUSD}`)
    console.log(`network: ${NETWORK_TYPE.BINANCE}`)
    console.log(`formattedAmount: ${formattedAmount}`)
    console.log(`jumperOneAddress: ${jumperOneAddress}`)
    console.log(`jumperAddress: ${jumperAddress}`)
    console.log(`depositTxnHash: ${JSON.stringify(depositTxnHash)}`)

    const operation = await bridgeSDK.createOperation({
      type: EXCHANGE_MODE.ONE_TO_ETH,
      token: TOKEN.ERC20,
      erc20Address: process.env.BSC_BUSD_CONTRACT,
      network: NETWORK_TYPE.BINANCE,
      amount: formattedAmount,
      oneAddress: process.env.JUMPER_ONE_ADDRESS,
      ethAddress: jumperAddress,
      // formattedAmount,
      // jumperOneAddress,
      // jumperAddress,
    })
    console.log(`Operation Created`)
    await operation.confirmAction({
      actionType: ACTION_TYPE.depositOne,
      transactionHash: depositTxnHash.hash,
    })
    console.log(`depositOne Completed`)
    await operation.confirmAction({
      actionType: ACTION_TYPE.approveHmyManger,
      transactionHash: approveTxnHash,
    })
    console.log("Hmy Manager Approved")
    await operation.confirmAction({
      actionType: ACTION_TYPE.burnToken,
      transactionHash: burnTxnHash,
    })
    console.log("Burn Token Completed")
    return { trx: "swap", success: true}
  
  } catch (e) {
    console.log (`Burn error message: ${JSON.stringify(e.message)}`)
    console.log (`Burn error body: ${JSON.stringify(e.response?.body)}`)
    return { trx: "swap", success: true, error_message: e.message, error_body: e.response?.body}
  }
}



