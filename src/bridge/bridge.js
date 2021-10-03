require("dotenv").config();

const BN = require('bn.js');
const ethers = require('ethers');
const formatEther = require('ethers').utils.formatEther
const parseEther = require('ethers').utils.parseEther

var lock = require('./lock.js');
var burn = require('./burn.js');

/*
 * Exports for all public functions
*/
module.exports.Bridge = async function(trx, jumperAddress, nodeURL, gasLimit, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, privateKey, amount) {
  return await bridge(trx, jumperAddress, nodeURL, gasLimit, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, privateKey, amount);
}

module.exports.LockWithHash = async function(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount) {
  return await lockWithHash(approveTxnHash, lockTxnHash, oneAddress, ethAddress, amount);
}

module.exports.BurnWithHash = async function(approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress, amount) {
  return await burnWithHash(approveTxnHash, depositTxnHash, burnTxnHash, oneAddress, ethAddress, amount);
}

const setAllowance = async function(fromTokenContract, amount, router) {
  await fromTokenContract.approve(router.address, amount)
}


/* Create and sign a transaction to approve a manager contract
 * @param {string} nodeURL
 * @param {string} gasLimit
 * @param {string} abiJson
 * @param {string} contractAddress
 * @param {string} contractManagerAddress
 * @param {string} privateKey
 * @param {string} amountInWei
 * @return {string} the signed transaction hash
*/
async function approveContractManager(nodeURL, gasLimit, abiJson, contractAddress, contractManagerAddress, privateKey, amountInWei) {
  const provider = new ethers.providers.JsonRpcProvider(nodeURL);
  // const gasPrice = provider.getGasPrice()
  const wallet = new ethers.Wallet(privateKey, provider)
  const busdJson = require(abiJson);
  const busdContract = new ethers.Contract(
    contractAddress,
    busdJson.abi,
    wallet,
  );
  console.log(`wallet.address; ${wallet.address}`)
  const tx = await busdContract.approve(contractManagerAddress, amountInWei) 
  const receipt = await tx.wait()
  const success = receipt && receipt.status === 1
  console.log(
    `approveContractManager -  Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
  )
  return tx
}

/* Call Harmony Horizon Bridge to bridge assets
 * @param {int} trx 
 * @param {string} jumperEthAddress
 * @param {string} nodeURL
 * @param {string} gasLimit
 * @param {string} contractAbiJson
 * @param {string} contractAddress
 * @param {string} contractManagerAbiJson
 * @param {string} contractManagerAddress
 * @param {string} privateKey
 * @param {string} amount
 * @return {string} JSON with the request response
*/
async function bridge(trx, jumperAddress, nodeURL, gasLimit, contractAbiJson, contractAddress, contractManagerAbiJson, contractManagerAddress, privateKey, amount) {
  try {
    let formattedAmount = parseEther(amount)
    let depositFormattedAmount = parseEther(process.env.DEPOSIT_AMOUNT) 
    console.log("NodeURL:", nodeURL)
    console.log("Gas Limit:", gasLimit)
    console.log("Token ABI:", contractAbiJson)
    console.log("Token Contract Address:", contractAddress)
    console.log("Manager ABI:", contractManagerAbiJson)
    console.log("Contract Manager Address:", contractManagerAddress)
    console.log("Amount:", amount)
    console.log("Amount in Wei:", formattedAmount)
    console.log("Deposit Amount:", process.env.DEPOSIT_AMOUNT)
    console.log("Deposit Amount in Wei:", depositFormattedAmount)
    // ===== Approve Contract Manager ===== //
    const approveTxnHash = await approveContractManager(nodeURL, gasLimit, contractAbiJson, contractAddress, contractManagerAddress, privateKey, formattedAmount);
    console.log("approveTxnHash", approveTxnHash);

    switch (trx) {
      case 0: //Lock
        console.log("Trx:", "Lock it!")
        const lockTxnHash = await lock.LockTxn(nodeURL, gasLimit, contractManagerAbiJson, contractManagerAddress, privateKey, formattedAmount);
        console.log("lockTxnHash", lockTxnHash);
        await lock.Lock(approveTxnHash, lockTxnHash, jumperAddress, formattedAmount);
        break;
      case 1: // Burn
      console.log("Trx:", "Burn it!") 
        const depositTxnHash = await burn.Deposit(nodeURL, gasLimit, '../constants/abi/Deposit.json', privateKey, depositFormattedAmount);
        console.log("depositTxnHash", depositTxnHash);
        const burnTxnHash = await burn.BurnTxn(nodeURL, gasLimit, contractManagerAbiJson, contractManagerAddress, privateKey, formattedAmount);
        console.log("burnTxnHash", burnTxnHash);
        await burn.Burn(depositTxnHash, approveTxnHash, burnTxnHash, jumperAddress, formattedAmount);
        break;
      default:
        return { trx: "bridge", success: false, error_message: "Wrong transaction value", error_body: "Only possible values are 0 or 1"}
    }
    return { trx: "bridge", success: true, error_message: null, error_body: null}
  } catch (e) {
    console.log (`trx: "bridge", success: false, error_message: ${JSON.stringify(e.message)}, error_body: ${JSON.stringify(e.response?.body)}`)
    return { trx: "bridge", success: false, error_message: e.message, error_body: e.response?.body}
  }
}

/* Bridges assets from Ethereum to Harmony network
 * @param {string} approveTxnHash
 * @param {string} lockTxnHash
 * @param {string} jumperAddress
 * @param {string} amount
 * @return {string} JSON with the request response
*/
async function lockWithHash(approveTxnHash, lockTxnHash, jumperAddress, amount) {
  try {
    let formattedAmount = parseEther(amount);
    console.log("approveTxnHash", approveTxnHash);
    console.log("Trx:", "Lock it!")
    console.log("lockTxnHash", lockTxnHash);
    await lock.Lock(approveTxnHash, lockTxnHash, jumperAddress, formattedAmount);
    return { trx: "bridge", success: true, error_message: null, error_body: null}
  } catch (e) {
    return { trx: "bridge", success: false, error_message: e.message, error_body: e.response?.body}
  }
}

/* Bridges assets from Harmony to Ethereum or BSC networks
 * @param {string} approveTxnHash
 * @param {string} depositTxnHash
 * @param {string} burnTxnHash
 * @param {string} jumperAddress
 * @param {string} amount
 * @return {string} JSON with the request response
*/
async function burnWithHash(approveTxnHash, depositTxnHash, burnTxnHash, jumperAddress, amount) {
  try {
    let formattedAmount = parseEther(amount);
    console.log("Trx:", "Burn it!") 
    console.log("approveTxnHash", approveTxnHash);
    console.log("depositTxnHash", depositTxnHash);
    console.log("burnTxnHash", burnTxnHash);
    await burn.Burn(depositTxnHash, approveTxnHash, burnTxnHash, jumperAddress, formattedAmount);
    return { trx: "bridge", success: true, error_message: null, error_body: null}
  } catch (e) {
    return { trx: "bridge", success: false, error_message: e.message, error_body: e.response?.body}
  }
}


