/*=================================================*/
/*                                                 */
/*              Written By Zooky.                  */
/*                                                 */
/*             Discord: Zooky.#1003                */
/*              Telegram: @zookyy                  */
/*                                                 */
/*          Website: https://www.eryx.io           */
/*                                                 */
/*  If you wish to purchase the premium version    */
/*       please visit the github link above.       */
/*                                                 */
/*=================================================*/

const chalk = require('chalk');
const ethers = require('ethers');

const msg = require('./msg.js');
const config = require('./config.js');
const cache = require('./cache.js');
const args = require('minimist')(process.argv.slice(2));

require('./init.js');

class Network {

	async load() {

		try {

			// initialize stuff
			if(config.cfg.wallet.wss_node.startsWith('http')) {
				this.node = new ethers.providers.JsonRpcProvider(config.cfg.wallet.wss_node);
			} else {
				this.node = new ethers.providers.WebSocketProvider(config.cfg.wallet.wss_node);
			}

			// initialize account
			this.wallet = new ethers.Wallet(config.cfg.wallet.secret_key);
			this.account = this.wallet.connect(this.node);

			// get network id for later use
			this.network = await this.node.getNetwork();

			// supported chains
			this.chains = {

				// ETH Mainnet
				'1': {
					'name': 'Ethereum',
					'symbol': 'ETH',
					'wrapped': 'WETH',
					'token': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					'router': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
					'factory': '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
					'page': 'https://etherscan.io'
				},

				// BSC Mainnet
				'56': {
					'name': 'Binance Smart Chain',
					'symbol': 'BNB',
					'wrapped': 'WBNB',
					'token': '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
					'router': '0x10ED43C718714eb63d5aA57B78B54704E256024E',
					'factory': '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
					'page': 'https://bscscan.com'
				},

			};

			// pcs stuff for later use
			this.factory = new ethers.Contract(
			    this.chains[this.network.chainId].factory,
			    [
			        'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
			        'function getPair(address tokenA, address tokenB) external view returns (address pair)'
			    ],
			    this.account // pass connected account to pcs factory
			);

			this.router = new ethers.Contract(
			    this.chains[this.network.chainId].router,
			    [
			        'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
			        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
			        'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
			        'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
			        'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
			        'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external  payable returns (uint[] memory amounts)'
			    ],
			    this.account // pass connected account to pcs router
			);

			this.contract_in = new ethers.Contract(
			    config.cfg.contracts.input,
			    [
				    { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" },
				    { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "approved", "type": "bool" }], "payable": false, "type": "function" },
				    { "constant": true, "inputs": [{ "name": "sender", "type": "address" }, { "name": "guy", "type": "address" }], "name": "allowance", "outputs": [{ "name": "allowed", "type": "uint256" }], "payable": false, "type": "function" },
				    { "constant": true, "inputs":[],"name":"symbol","outputs":[{"name":"outname","type":"string"}], "payable": false, "type":"function"},
				    {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
				    {"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
				],
			    this.account // pass connected account to bnb smart contract
			);

			this.contract_out = new ethers.Contract(
			    config.cfg.contracts.output,
			    [
				    { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" },
				    { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "approved", "type": "bool" }], "payable": false, "type": "function" },
				    { "constant": true, "inputs": [{ "name": "sender", "type": "address" }, { "name": "guy", "type": "address" }], "name": "allowance", "outputs": [{ "name": "allowed", "type": "uint256" }], "payable": false, "type": "function" },
				    { "constant": true, "inputs":[],"name":"symbol","outputs":[{"name":"outname","type":"string"}], "payable": false, "type":"function"},
				    {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
				    {"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
				],
			    this.account // pass connected account to bnb smart contract
			);

			// load user balances (for later use)
			this.bnb_balance = parseInt(await this.account.getBalance());

			this.input_balance = parseInt((this.isETH(config.cfg.contracts.input) ? this.bnb_balance : await this.contract_in.balanceOf(this.account.address)));		
			this.output_balance = parseInt((this.isETH(config.cfg.contracts.output) ? this.bnb_balance : await this.contract_out.balanceOf(this.account.address)));	

			// load some more variables
			this.base_nonce = parseInt(await this.node.getTransactionCount(this.account.address));

			this.nonce_offset = 0;
			this.first_block = -1;

		} catch(e) {

			msg.error(`[error] ${e}`);

			process.exit();

		}

	}

	async prepare() {

		msg.primary(`Preparing network..`);

		// format maxInt.
    	const maxInt = (ethers.BigNumber.from("2").pow(ethers.BigNumber.from("256").sub(ethers.BigNumber.from("1")))).toString();

		// cache & prepare contracts
	    if(!cache.isAddressCached(config.cfg.contracts.input)) {

	    	cache.createAddress(config.cfg.contracts.input);
	    	cache.setAddressArtifacts(config.cfg.contracts.input, (await this.contract_in.decimals()), await this.contract_in.symbol());

	       	await cache.save();
	    }

	    if(!cache.isAddressCached(config.cfg.contracts.output)) {

	    	cache.createAddress(config.cfg.contracts.output);
	    	cache.setAddressArtifacts(config.cfg.contracts.output, (await this.contract_out.decimals()), await this.contract_out.symbol());

	        await cache.save();
	    }

	    // now that the cache is done, restructure variables
	    config.cfg.transaction.amount_in_formatted = ethers.utils.parseUnits(`${config.cfg.transaction.amount_in}`, cache.data.addresses[config.cfg.contracts.input].decimals);
	}

	// wrapper function for swapping
	async swapFromTokenToToken(amountIn, amountOutMin, contracts) {

	    try {

	    	return this.router.swapExactETHForTokensSupportingFeeOnTransferTokens(
                amountOutMin,
                contracts,
                this.account.address,
                (Date.now() + 1000 * 60 * 10),
                {
                	'value': amountIn,
                    'gasLimit': config.cfg.transaction.gas_limit,
                    'gasPrice': config.cfg.transaction.gas_price,
                    'nonce': (this.getNonce())
                }
            );

	    } catch(e) {

	        console.log(`[error] ${e.error}`);
	        process.exit();

	    }
	}

	async estimateTransaction(amountIn, amountOutMin, contracts) {

	    try {

	    	let gas = await this.router.estimateGas.swapExactETHForTokensSupportingFeeOnTransferTokens(
                amountOutMin,
                contracts,
                this.account.address,
                (Date.now() + 1000 * 60 * 10),
                {
                	'value': amountIn,
                    'gasLimit': config.cfg.transaction.gas_limit,
                    'gasPrice': config.cfg.transaction.gas_price
                }
            );

	        // check if is using enough gas.
	        if(gas > parseInt(config.cfg.transaction.gas_limit) || gas > parseInt(config.cfg.transaction.gas_limit)) {
	            msg.error(`[error] The transaction requires at least ${gas} gas, your limit is ${config.cfg.transaction.gas_limit}.`);
	            process.exit();
	        }

	        return true;

	    } catch(e) {

	        console.log(`[error] ${e.error}`);
	        return this.estimateTransaction(amountIn, amountOutMin, contracts);

	    }
	}

	async transactToken(from, to) {

	    try {

	        let inputTokenAmount = config.cfg.transaction.amount_in_formatted;

	        // get output amounts
	        let amounts = await this.router.getAmountsOut(inputTokenAmount, [from, to]);

	         // calculate min output with current slippage in bnb
	        let amountOutMin = amounts[1].sub(amounts[1].div(100).mul(config.cfg.transaction.buy_slippage));

	      	// simulate transaction to verify outputs.
	        let estimationPassed = await this.estimateTransaction(inputTokenAmount, amountOutMin, [from, to]);

	        // if simulation passed, notify, else, exit
	        if(estimationPassed) {
	            msg.success(`Estimation passed successfully. proceeding with transaction.`);
	        } else {
	            msg.error(`[error] Estimation did not pass checks. exiting..`);
	            process.exit();
	        }

	        let tx = await this.swapFromTokenToToken(
	            inputTokenAmount, 
	            amountOutMin,
	            [from, to]
	        );

	        msg.success(`TX has been submitted. Waiting for response..\n`);

	        let receipt = await tx.wait();

	        // get current ballance from output contract.
            let currentOutBalance = await this.contract_out.balanceOf(this.account.address);

            this.amount_bought_unformatted = ethers.utils.formatUnits(`${(currentOutBalance - this.output_balance)}`, cache.data.addresses[config.cfg.contracts.output].decimals);

	        return receipt;

	    } catch(err) {

	        if(err.error && err.error.message){
	            msg.error(`[error] ${err.error.message}`);
	        }
	        else
	            console.log(err);

	        return this.transactToken(from, to);
	    }

	    return null;
	}

	isETH(token) {
		return (token.toLowerCase() == this.chains[this.network.chainId].token.toLowerCase())
	}

	async getLiquidity(pair) {

	    const bnbValue = await this.contract_in.balanceOf(pair);
	    const formattedbnbValue = await ethers.utils.formatEther(bnbValue);

	    // testing
	    if (formattedbnbValue < 1) {
	        msg.warning("There is not enough liquidity yet.");
	        return this.getLiquidity(pair);
	    }

	    return formattedbnbValue;
	}

	async getPair(contract_in, contract_out) {

	    // get pair address
	    let pairAddress = await this.factory.getPair(contract_in, contract_out);

	    // no pair found, re-launch
	    if (!pairAddress || (pairAddress.toString().indexOf('0x0000000000000') > -1)) {
	        msg.warning("Could not find pair for specified contracts. retrying..");
	        return this.getPair(contract_in, contract_out);
	    }

	    return pairAddress;
	}

	getNonce() {

		let nonce = (this.base_nonce + this.nonce_offset);

		this.nonce_offset ++;

		return nonce;

	}

}

module.exports = new Network();