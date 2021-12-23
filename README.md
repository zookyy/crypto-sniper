<div align="center">
    <img src="https://i.imgur.com/mF3T0jn.png">
    <h3 align="center">Eryx - Crypto Sniper</h3>
    <p align="center">
        Simple yet fast and efficient sniper-bot running on the blockchain.
        <hr>
        <a href="#getting-started">⬇️ Download Lite Version</a>
        /
        <a href="https://github.com/zookyy/bsc-sniper/issues">🐞 Report a bug</a>
        /
        <a href="https://github.com/zookyy/bsc-sniper/issues">🆕 Request a feature</a>
	/
        <a href="https://eryx.io">🌐 Visit our website</a>
    </p>
</div>

## Table Of Contents

<ul>
    <li>
		<a href="#description">Description</a>
		<ul>
			<li><a href="#features">Features</a></li>
			<li><a href="#supported-chains">Supported chains</a></li>
			<li><a href="#supported-tokens">Supported tokens</a></li>
		</ul>
	</li>
    <li>
        <a href="#getting-started">Getting started</a>
        <ul>
            <li><a href="#requirements">Requirements</a></li>
            <li><a href="#installation">Installation</a></li>
            <li><a href="#configuration">Configuration</a></li>
        </ul>
    </li>
	<li><a href="#go-premium">Go Premium</a></li>
</ul>


## Description
![Alt Text](https://i.imgur.com/N2STawe.gif)

A fast and efficient bot written in NodeJS to automatically buy and sell tokens on the blockchain as soon as liquidity is added and trade is enabled.
<br><br>
The bot is extremely fast as long as you use a **good** node and not a public one. With a node from Quicknode you can expect a buy/sell transaction in less than 5 seconds.
<br><br>
The bot uploaded on github is the **lite** version of the real bot. 
You do **not** get all of the features from the premium version.

### Features

Current features supported by the **FREE** version:

- [x] Buying (BNB pairs only)
- [x] Gas estimation system
- [x] Regular liquidity sniper

Additional features supported by the **premium** version:
- [x] Block-offset system
- [x] Multi blockchain support.
- [x] Buy using any token. 
- [x] Mempool sniping.
- [x] Multi-buy mode (all transactions are in the same block). 
- [x] Wrapped mode for any ETH-like token (BNB, MATIC, etc..). 
- [x] Auto / manual selling
- [x] Sell using a delay
- [x] Tax checker (all pairs are supported)
- [x] Auto updates (updates are done automatically without the need of a re-download)
- [x] Support

Planned features for the **premium** version:
- [ ] Rug pull front-running.
- [ ] Trailing auto-sell.
- [ ] Other liquidity sniping methods.
- [ ] Contract analyzer.

### Supported chains
- Binance Smart Chain [tested]
- Avalanche [tested]
- Ethereum [not tested]
- Polygon [not tested]

If you wish to change the blockchain the bot will operate on, just change the WSS_NODE endpoint in config.ini to the right endpoint.

#### Public WSS Nodes
- Binance Smart Chain: wss://bsc-ws-node.nariox.org:443
- Ethereum: wss://main-light.eth.linkpool.io/ws
- Polygon: wss://rpc-mainnet.matic.network

### Supported tokens
The bot currently supports any token using the uniswap interface.

## Getting Started
### Requirements
<ul>
    <li>Windows 10 / Ubuntu / Mac OS</li>
	<li>Latest <a href="https://nodejs.org/en/download/">NodeJS</a> installed.</li>
	<li>Latest <a href="https://git-scm.com/downloads">Git</a> installed.</li>
	<li>A <b>decent</b> internet connection.</li>
	<li>
		A <b>decent</b> BSC node, preferably paid, but you may also use free ones.
		<ul>
			<li><a href="https://www.quicknode.com/">Quicknode (paid)</a></li>
			<li><a href="https://www.moralis.io/">Moralis (free)</a></li>
		</ul>
	</li>
	<li>A crypto wallet with a private key. (it is recommended to create a new wallet to use with this bot)</li>
</ul>

### Installation

1. Download and install NodeJS from <a href="https://nodejs.org/en/download/">here</a>.
2. Download and install Git from <a href="https://git-scm.com/downloads">here</a>.
3. Open a command prompt / terminal and clone the repository.
	```sh
	git clone https://github.com/zookyy/bsc-sniper.git && cd bsc-sniper
	```
4. In the same command prompt, install the NPM packages.
	```sh
	npm install
	```
5. That's it! Time for configuration. 🎉

### Configuration

```ini
[WALLET]
; This is your BSC wallet's private key.
SECRET_KEY=private_wallet_key

; The uptime of this node is pretty bad, you should consider using a private node.
WSS_NODE=wss://bsc-ws-node.nariox.org:443


[CONTRACTS]
; These variables support some pre-defined contracts (BNB, ETH, BUSD). 
; For other contracts you'll have to specify the contract address yourself.
INPUT=BNB
OUTPUT=BUSD


[TRANSACTION]

GAS_LIMIT=500000
GAS_PRICE=5

; This variable is the amount of crypto you wish to use with the input contract.
; If for example you use WBNB as input, you will have to use WBNB's format.
AMOUNT_IN=0.0033

BUY_SLIPPAGE=10
```

### Usage
To launch the bot use the command ```node index.js```

#### Premium parameters
<table>
  <tr>
    <th>Parameter</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>--block-offset</td>
    <td>Waits an x amount of blocks before buying a token.</td>
  </tr>
  <tr>
    <td>--input</td>
    <td>Overwrites the input parameter in the config.</td>
  </tr>
  <tr>
    <td>--output</td>
    <td>Overwrites the output parameter in the config.</td>
  </tr>
  <tr>
    <td>--wrapped</td>
    <td>Uses the wrapped version of the bnb/eth token. (available for all blockchains)</td>
  </tr>
  <tr>
    <td>--verify-tax</td>
    <td>Checks wether the taxes for buying / selling does not exceed the limits configured.</td>
  </tr>
</table>

## Go Premium

<p>
	You can see all of the features <a href="#features">here</a>.<br>
	If you wish to purchase the premium version of the bot, please contact me using the contact methods listed below.
</p>

### Contact
<ul>
	<li>Discord: Zooky.#1003</li>
	<li>Telegram: @zookyy</li>
</ul>
