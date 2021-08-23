const ChainId = require('@kangafinance/sdk').ChainId
const ethers = require('ethers')
const FACTORY_ADDRESS = require('@kangafinance/sdk').FACTORY_ADDRESS
const ROUTER_ADDRESS = require('@kangafinance/sdk').ROUTER_ADDRESS

const math = require('mathjs')
var contracts = require('./contracts.js')

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

  /*

  Create Pair

  let pair = factory.getpair(token0, token1)
  if !pair then factory.createpair(token0, token1)
  return pair address

  Add Liquidity

  tokenA = 
  
  Withdraw Liquidity

  Swap
  */
