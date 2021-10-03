require("dotenv").config();

const ChainId = require('@kangafinance/sdk').ChainId
const ethers = require('ethers')
const formatEther = require('ethers').utils.formatEther
const parseEther = require('ethers').utils.parseEther
const FACTORY_ADDRESS = require('@kangafinance/sdk').FACTORY_ADDRESS
const ROUTER_ADDRESS = require('@kangafinance/sdk').ROUTER_ADDRESS

const math = require('mathjs')
var contracts = require('./contracts.js')

const setAllowance = async function(fromTokenContract, amount, router) {
  await fromTokenContract.approve(router.address, amount)
}

module.exports.getInfo = async function(chain) {
    await getInfo(chain);
  }

  const getInfo = async function(chain) {
    try {
        let chainId = ChainId.HARMONY_TESTNET
        let routerAddress = ROUTER_ADDRESS[ChainId.HARMONY_TESTNET]
        let factoryAddress = FACTORY_ADDRESS[ChainId.HARMONY_TESTNET]

        console.log("chainId: ", chainId)
        console.log("routerAddress: ", routerAddress)
        console.log("factoryAddress: ", factoryAddress)
        // console.log("HARMONY TESTNET ROUTER_ADDRESS: ", ROUTER_ADDRESS[ChainId.HARMONY_TESTNET])
        return "Harmony Testnet is 123"
      } catch (e) {
        console.error("Error: ", e.message, e);
      } 
  }

  // Check Balance

  module.exports.checkBalance = async function(wallet, tokenAddress) {
    return await checkBalance(wallet, tokenAddress);
  }

  const checkBalance = async function(wallet, tokenAddress) {

    try {
      const fromTokenContract = contracts.getTokenContract(ChainId.HARMONY_TESTNET, tokenAddress, wallet)
      const fromTokenSymbol = await fromTokenContract.symbol()
      console.log(`Checking ${fromTokenSymbol} balance for ${wallet.address} ...`)
      const tokenBalance = await fromTokenContract.balanceOf(wallet.address)
      console.log("tokenBalance: ",tokenBalance._hex)
      return tokenBalance._hex
      // return math.compare(tokenBalance._hex, parseEther(amount)._hex)
    } catch (e) {
      console.error("Error: ", e.message, e);
    } 
  
  }

  // Add Liquidity

  module.exports.addLiquidity = async function(
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
  ) {
    return await addLiquidity(
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
    );
  }

  const addLiquidity = async function(
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
  ) {

    try {
      const routerContract = contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet)
      const tokenAContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, tokenA, wallet)
      await setAllowance(tokenAContract, parseEther(amountADesired), routerContract)
      const tokenBContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, tokenB, wallet)
      await setAllowance(tokenBContract, parseEther(amountBDesired), routerContract)
      let tx = await routerContract.addLiquidity(
        tokenA,
        tokenB,
        parseEther(amountADesired),
        parseEther(amountBDesired),
        parseEther(amountAMin),
        parseEther(amountBMin),
        sendTo,
        deadline,
        {
          gasLimit: process.env.HMY_GAS_LIMIT
        }
      );
      const receipt = await tx.wait()
      const success = receipt && receipt.status === 1
      console.log(
        `Add Liquidity -  Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
      )
      return tx
    } catch (e) {
      console.error("Error: ", e.message, e);
    } 
  }  


// Remove Liquidity

module.exports.removeLiquidity = async function(
  provider,
  wallet,
  tokenA,
  tokenB,
  removalPercentage,
  deadline
) {
  return await removeLiquidity(
    provider,
    wallet,
    tokenA,
    tokenB,
    removalPercentage,
    deadline
  );
}

const removeLiquidity = async function(
  provider,
  wallet,
  tokenA,
  tokenB,
  removalPercentage,
  deadline
) {

  try {

    // Factory GetPair address for tokens
    const factoryContract = await contracts.getFactoryContract(ChainId.HARMONY_TESTNET, wallet)
    const routerContract = await contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet)
    let getPairResult = await factoryContract.getPair(tokenA, tokenB)
    console.log(`getPairResult: ${getPairResult}`)
    const pairContract = await contracts.getPairContract(getPairResult, wallet)
    console.log("Have pair contract")
    // TokenPair Get balance for user
    let getBalanceResult = await pairContract.balanceOf(wallet.address)
    console.log(`getBalanceResult: ${getBalanceResult}`)
    console.log(`SettingAllowance`)
    await setAllowance(pairContract, getBalanceResult, routerContract)
    console.log(`AllowanceSet`)
    let removalAmount = getBalanceResult // 10^18 //* removalPercentage / 100 
    // Router Remove the amount
    console.log("Creating Zero Big Number")
    const zeroMin = parseEther('0.1') //math.bignumber('0')
    console.log(`zeroMin: ${zeroMin}`)
    console.log(`wallet.address: ${wallet.address}`)

    console.log(`tokenA: ${tokenA}`)
    console.log(`tokenB: ${tokenB}`)
    console.log(`liquidity: ${removalAmount}`)
    console.log(`amountAMin: ${zeroMin}`)
    console.log(`amountBMin: ${zeroMin}`)
    console.log(`to: ${wallet.address}`)
    console.log(`Deadline (ms): ${deadline}`)

    let tx = await routerContract.removeLiquidity(
      tokenA, 
      tokenB, 
      removalAmount, 
      zeroMin,
      zeroMin,
      wallet.address,
      deadline,
      {
        gasLimit: process.env.HMY_GAS_LIMIT
      }
    );
    const receipt = await tx.wait()
    const success = receipt && receipt.status === 1
    console.log(
      `Liquidity Removal -  Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
    )
    return tx
  } catch (e) {
    console.error("Error: ", e.message, e);
  } 
}  

  //Swap

  module.exports.swapForToken = async function(
    amount,
    wallet,
    fromToken,
    toToken,
    destinationAddress
  ) {
    return await swapForToken(
      amount,
      wallet,
      fromToken,
      toToken,
      destinationAddress
    );
  }

  const swapForToken = async function(amount, wallet, fromToken, toToken, destinationAddress) {
    
    destinationAddress = destinationAddress ? destinationAddress : wallet.address
    const parsedAmount = parseEther(amount)
  
    let dryRun = false
    const deadline = Date.now() + 1000 * 60 * 3
  
    const routerContract = await contracts.getRouterContract(ChainId.HARMONY_TESTNET, wallet)
    const fromTokenContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, fromToken, wallet)
    
    const toTokenContract = await contracts.getTokenContract(ChainId.HARMONY_TESTNET, toToken, wallet)
      
    if (routerContract && fromTokenContract && toTokenContract) {
      
      try {
        const fromTokenSymbol = await fromTokenContract.symbol()
        const toTokenSymbol = await toTokenContract.symbol()
        console.log(`Checking ${fromTokenSymbol} balance for ${wallet.address} ...`)
        const tokenBalance = await fromTokenContract.balanceOf(wallet.address)
        if (!tokenBalance.isZero()) {
          await setAllowance(fromTokenContract, tokenBalance, routerContract)
  
          const amounts = await routerContract.getAmountsOut(parsedAmount, [fromTokenContract.address, toTokenContract.address])
          const [_, targetAmount] = amounts
      
          const adjustedTargetAmount = targetAmount.sub(targetAmount.div(100))
          const swapMethod = 'swapExactTokensForTokens'
          
          const message = `${formatEther(
            parsedAmount
            )} ${fromTokenSymbol} to a minimum of ${formatEther(adjustedTargetAmount)} ${toTokenSymbol}`
          
          console.log(`Amount: ${amount}`)
          console.log(`Parsed Amount: ${parsedAmount}`)
          console.log(`Swap method: ${swapMethod}`)
          console.log(`Swapping ${message}`)
          console.log(`Output token address: ${toTokenContract.address}`)
          console.log(`Input token address: ${fromTokenContract.address}`)
          console.log(`Wallet address: ${wallet.address}`)
          console.log(`Destination address: ${destinationAddress}`)
          console.log(`Deadline (ms): ${deadline}`)
      
          if (!dryRun) {
            const tx = await routerContract[swapMethod](
              parsedAmount,
              adjustedTargetAmount,
              [fromTokenContract.address, toTokenContract.address],
              destinationAddress,
              deadline,
              {
                gasLimit: process.env.HMY_GAS_LIMIT
              }
            )
      
            const receipt = await tx.wait()
            const success = receipt && receipt.status === 1
            console.log(
              `Swapped ${message} - Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}\n`
            )
            return { trx: "swap", success: true, message: `Swapped ${message} - Transaction receipt - tx hash: ${receipt.transactionHash}, success: ${success}`}
            // return receipt.transactionHash
        } else {
          return { trx: "swap", success: true, message: 'Not swapping due to running in dry run mode', error_body: "Only possible values are 0 or 1"}
          // console.log('Not swapping due to running in dry run mode')
          }
        }
      } catch (e) {
        return { trx: "swap", success: false, error_message: e.message, error_body: e.response?.body}
        // console.error("Error: ", e.message, e);
      }
    } else {
      return { trx: "swap", success: false, error_message: `Couldn't swap fromToken ${fromToken} or toToken ${toToken}`, error_body: null}
      // console.log(`Couldn't find fromToken ${fromToken} or toToken ${toToken}`)
    }
  }


  
  