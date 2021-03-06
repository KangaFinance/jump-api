const ethers = require('ethers')
const FACTORY_ADDRESS = require('@kangafinance/sdk').FACTORY_ADDRESS
const ROUTER_ADDRESS = require('@kangafinance/sdk').ROUTER_ADDRESS
const MASTERCHEF_ADDRESS = require('@kangafinance/sdk').MASTERCHEF_ADDRESS
const FACTORY_ABI = require('@kangafinance/core/abi/IUniswapV2Factory.json')
const ROUTER_ABI = require('@kangafinance/core/abi/IUniswapV2Router02.json')
const IERC20_ABI = require('@kangafinance/core/abi/IUniswapV2ERC20.json')
const IUNISWAPV2PAIR_ABI = require('@kangafinance/core/abi/IUniswapV2Pair.json')
// const MASTERCHEF_ABI = require('@kangafinance/core/abi/MasterChef.json')
// const getTokenWithDefault = require('./tokens').getTokenWithDefault
// const isAddress = require('./addresses').isAddress
const ChainId = require('@kangafinance/sdk').ChainId

module.exports.getFactoryContract = function(
  chainId,
  walletOrProvider
) {
  console.log('chainId: ', chainId);
  //console.log('walletOrProvider: ',walletOrProvider)
  const factoryAddress = FACTORY_ADDRESS[chainId]
  console.log('factoryAddress: ',factoryAddress)
  //if (routerAddress && isAddress(routerAddress)) {
  if (factoryAddress) {
    return new ethers.Contract(factoryAddress, FACTORY_ABI, walletOrProvider)
  }

  return undefined
}

module.exports.getRouterContract = function(
    chainId,
    walletOrProvider
  ) {
    console.log('chainId: ', chainId);
    //console.log('walletOrProvider: ',walletOrProvider)
    const routerAddress = ROUTER_ADDRESS[chainId]
    console.log('routerAddress: ',routerAddress)
    //if (routerAddress && isAddress(routerAddress)) {
    if (routerAddress) {
      return new ethers.Contract(routerAddress, ROUTER_ABI, walletOrProvider)
    }
  
    return undefined
  }
  
  module.exports.getTokenContract = function(
    chainId,
    addressOrSymbol,
    walletOrProvider
  ) {

    // if (isAddress(addressOrSymbol)) {
    //   return new ethers.Contract(addressOrSymbol, IERC20_ABI, walletOrProvider)
    // }

    return new ethers.Contract(addressOrSymbol, IERC20_ABI, walletOrProvider)

    // const token = getTokenWithDefault(chainId, addressOrSymbol)
    // if (!token) return undefined
    // return new ethers.Contract(token.address, IERC20_ABI, walletOrProvider)
  }
  
  module.exports.getPairContract = function(
    pairAddress,
    walletOrProvider
  ) {
    //if (isAddress(pairAddress)) {
      return new ethers.Contract(pairAddress, IUNISWAPV2PAIR_ABI, walletOrProvider)
    //}
  
    //return undefined
  }
  
  module.exports.getMasterChefContract = function(
    chainId,
    walletOrProvider
  ) {
    const masterChefAddress = MASTERCHEF_ADDRESS[chainId]
    //if (masterChefAddress && isAddress(masterChefAddress)) {
      return new ethers.Contract(masterChefAddress, MASTERCHEF_ABI, walletOrProvider)
    //}
  
    //return undefined
  }
