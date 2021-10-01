# Testing

[Kanga.finance](https://kanga.finance) can be tested on Harmony Testnet using 
[https://demo.kanga.finance](https://demo.kanga.finance)

Below is an overview of the tokens and liquidity pools that are available for testing.

If you wish to receive tokens for testing please reach out in the Harmony Hackathon discord channel.

## Harmony Testnet

- Tokens
    - A. Eth_BUSD=0xb0e18106520d05adA2C7fcB1a95f7db5e3f28345
    - B. HMY_eth_BUSD=0xc4860463c59d59a9afac9fde35dff9da363e8425
    - C. HMY_bsc_BUSD=0x6d307636323688cc3fe618ccba695efc7a94f813
    - D. BSC_BUSD=0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee
- Manager and Liquidity Pool Contracts
    - 1. ETH_HMY_BUSD_MANAGER_CONTRACT=0x89Cb9b988ECe933becbA1001aEd98BdAa660Ef29
    - 2. BUSD_bscBUSD_POOL_CONTRACT= 0x1c2b3042e7a54d20fbe7e8f12122985330ff9692
    - 3. HMY_BSC_BUSD_MANAGER_CONTRACT=0x87e91c87196de58f6dc413d81c699da8ef39e4b9
    - 4. BSC_HMY_BUSD_MANAGER_CONTRACT=0x792bec87eb65a59c5051ee76c19e80d444a3c8e1
    - 5. BUSD_bscBUSD_POOL_CONTRACT= 0x1c2b3042e7a54d20fbe7e8f12122985330ff9692
    - 6. HMY_ETH_BUSD_MANAGER_CONTRACT=0xdc7c9eac2065d683adbe286b54bab4a62baa2654
- Addresses
    - Account 1
        - 0x8875fc2A47E35ACD1784bB5f58f563dFE86A8451
        - one13p6lc2j8uddv69uyhd043atrml5x4pz360ekxr
- Links
    - [Harmony Faucet](https://faucet.pops.one/)
    - [Harmony Explorer](https://explorer.pops.one/)
    - [Harmony Bridge](https://testnet.bridge.hmny.io/erc20)
    - [Binance Faucet](https://testnet.binance.org/faucet-smart)
    - [BSC Node URLs](https://docs.binance.org/smart-chain/developer/rpc.html)
    - [BSC Explorer](https://testnet.bscscan.com/address/0x8875fc2A47E35ACD1784bB5f58f563dFE86A8451#tokentxns)
    - [Cross Chain Flow](https://miro.com/app/board/o9J_l1l6L0I=/)

## Harmony Testnet

### Contracts
```
FACTORY_ADDRESS = "0x8Fe6bbd2FB33223cCEd22edDbC712aE9E6a71e7c"
ROUTER_ADDRESS  = "0x6FaA859FebB3c5B2aF16c8c51E657fB710DF2750"
```

### Bridging Tokens (Limited Liquidity)
Bridging Tokens below have been removed from the default token list and may be added in manually. The pools currently have limited liquidity. 

As Kanga Deploys on bridged Chains such as Ethereum and Binance then a more robust testing environment will be set up.
```
bscBUSD_MANAGER_CONTRACT = "0x4c5e5b1a12312b0a9196feaa09b8715b0a6dac9a"
bscBUSD                  = "0x6d307636323688cc3fe618ccba695efc7a94f813"
BUSD                     = "0xc4860463c59d59a9afac9fde35dff9da363e8425"
```

### Tokens

* KANGA   = "0x688a7C94d7be50289FFDb648C8F9e38ac55970F7" // KANGA
* WONE    = "0x16c640660d25Ce3cEE50075995567dB74e380F96" // WONE 
* oneETH  = "0xbbd8d7b71170916a033E4d07F2A8932f5F3aa510" // 1WETH
* oneWBTC = "0x55Ac2c51252FEC72a04a575ace2b88D00d13Ab68" // 1WBTC
* oneUSDT = "0x8800a37FbEd8953A642c4B8186bC5780Cd253FEE" // 1USDT 
* oneUSDC = "0xC285b03fFdB3fb5C77e3BDD0A2206A69A3691f0E" // 1USDC 
* BUSD    = "0xB1Ce20837c7D9604046b18914Ac90dda3fF69d0e" // BUSD
* bscBUSD = "0x260af0515ee751Be4E3eC2F530E06c6B164D8864" // bscBUSD 
* UST     = "0x4d6260b2B337aAf34785db207226C65DAdC34D86" // UST


## Liquidity Pools

### Token Price
Sample as at 9/23/2021

* KANGA   = $0.03
* WONE    = $0.15
* 1ETH    = $3,000
* 1WBTC   = $45,000
* 1USDT   = $1
* 1USDC   = $1
* BUSD    = $1
* bscBUSD = $1
* UST     = $1

### Initial Pool Ratios approx $600k per pool
```
KANGA-WONE    = 10,000,000 / 2,000,000
KANGA-1ETH    = 10,000,000 / 100
KANGA-1WBTC   = 10,000,000 / 6.66666
KANGA-1USDT   = 10,000,000 / 300,000
KANGA-1USDC   = 10,000,000 / 300,000
KANGA-BUSD    = 10,000,000 / 300,000
KANGA-bscBUSD = 10,000,000 / 300,000
KANGA-UST     = 10,000,000 / 300,000

UST-WONE      = 300,000 / 2,000,000
UST-1ETH      = 300,000 / 100
UST-1WBTC     = 300,000 / 6.66666
UST-1USDT     = 300,000 / 300,000
UST-1USDC     = 300,000 / 300,000
UST-BUSD      = 300,000 / 300,000
UST-bscBUSD   = 300,000 / 300,000

1WBTC-1ETH   = 6.66666 / 100
1ETH-WONE    = 100     / 2,000,000
1WBTC-WONE   = 6.66666 / 2,000,000
1USDC-WONE   = 300,000 / 2,000,000
1USDT-1USDC  = 300,000 / 300,000
bscBUSD-BUSD = 300,000 / 300,000
```

### Liquidity Pool Addresses

```
KANGA-WONE    = "0x02872a6f81e98a5e23f6f49bb2e501ba08fbacfa" 
KANGA-1ETH    = "0x36351905539fb07a1149eaae9d0fa7437e7f0c21"
KANGA-1WBTC   = "0x9534e3486786cbac05bb8431bf57be05830cf301"
KANGA-1USDT   = "0x6797c5411f9703c24b8a62901ef7efbc16a86d63"
KANGA-1USDC   = "0x94a1da04d57a219fd96764ffc8b07ca97259931e"
KANGA-BUSD    = "0xa26d9d45e0cb6a13a539c8bac5b733eadc4a6773"
KANGA-bscBUSD = "0x01c750a8fa66ee852b5058102c0c66fc52b3c9ef"
KANGA-UST     = "0xc0f2cfabde04dbdcb715cd5173afceb2722f9496"

UST-WONE      = "0xde74e433e19bb218e9a4c977159d210eb8f51c70"
UST-1ETH      = "0x60cc6de2593bcddad076b5de4a681a20bef91f01"
UST-1WBTC     = "0x7f091ff3e6baf9b7a09422e1e020200407e5d835"
UST-1USDT     = "0x2390c7c0c8b6d01961a1b76aa904cec77695b6cf"
UST-1USDC     = "0x530b72b0395820acf8f10291a15ae286501f0fa7"
UST-BUSD      = "0x43f4cad619e8feef42dbe803aa2c40a255d371f9"
UST-bscBUSD   = "0xd098a7d8d428abbe58f28a54173f1e5711781656"


1WBTC-1ETH   = "0x42b0c6502902a47913744294f3b4676298bed585"
1ETH-WONE    = "0xd7f83264e07f8d40e3c51d4e57989f9f9053359a"
1WBTC-WONE   = "0x327143153b5a883beb2bfa3427d978788541d8dd"
1USDC-WONE   = "0xbd1f3b084f4a5cb26f4feeaeba3a9a86a0240659"
1USDT-1USDC  = "0x96324beaacd5de48eee379bea08522bc07dcf338"
bscBUSD-BUSD = "0x219282f26439144c3ca8306e690679e0ce368e07"


```

