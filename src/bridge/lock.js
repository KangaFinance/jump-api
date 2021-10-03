require("dotenv").config();

const { BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE, ACTION_TYPE } = require('bridge-sdk');
const BN = require('bn.js');
const ethers = require('ethers');
const configs = require('bridge-sdk/lib/configs');
const { isPropertyAccessOrQualifiedName } = require("typescript");

module.exports.Lock = async function(approveTxnHash, lockTxnHash, jumperAddress, amount) {
  return await lock(approveTxnHash, lockTxnHash, jumperAddress, amount);
}

module.exports.LockTxn = async function(nodeURL, gasLimit, abiJson, contractManagerAddress, privateKey, amountInWei) {
  return await lockTxn(nodeURL, gasLimit, abiJson, contractManagerAddress, privateKey, amountInWei);
}

async function lockTxn(nodeURL, gasLimit, abiJson, contractManagerAddress, privateKey, amountInWei) {
/*

  let transaction = await busdContract.methods
    .lockToken(amountInWei, wallet.address)
    .send({
      from: wallet.address,
      gas: gasLimit,
      gasPrice: new BN(await ethers.getGasPrice()),
    });
  return transaction.transactionHash;
*/
  const provider = new ethers.providers.JsonRpcProvider(nodeURL);
  // const gasPrice = provider.getGasPrice()
  const wallet = new ethers.Wallet(privateKey, provider)
  const busdJson = require(abiJson);
  const busdContract = new ethers.Contract(
    contractManagerAddress,
    busdJson.abi,
    wallet,
  );
  console.log(`wallet.address; ${wallet.address}`)
  const tx = await busdContract.lockToken(amountInWei, contractManagerAddress) 
  const receipt = await tx.wait()
  const success = receipt && receipt.status === 1
  console.log(
    `lockTxn -  Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
  )
  return tx
}

const lock = async (approveTxnHash, lockTxnHash, jumperAddress, amount) => {
  try {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 });
    await bridgeSDK.init(configs.testnet);
    const operation = await bridgeSDK.createOperation({
      type: EXCHANGE_MODE.ETH_TO_ONE, 
      token: TOKEN.BUSD,
      network: NETWORK_TYPE.ETHEREUM,
      amount: amount,
      swapperOneAddress: process.env.JUMPER_ONE_ADDRESS,
      swapperEthAddress: jumperAddress,
    });
    await operation.confirmAction({
      actionType: ACTION_TYPE.approveEthManger,
      transactionHash: approveTxnHash,
    });
    console.log("Eth Manager Approved")
    await operation.confirmAction({
      actionType: ACTION_TYPE.lockToken,
      transactionHash: lockTxnHash,
    });
    console.log("Lock Token Approved")
    return { trx: "swap", success: true, error_message: null, error_body: null}
  
  } catch (e) {
    return { trx: "swap", success: true, error_message: e.message, error_body: e.response?.body}
  }
}

