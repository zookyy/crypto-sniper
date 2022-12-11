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
const fs = require('fs').promises;
const args = require('minimist')(process.argv.slice(2));

let ConsoleLog = console.log;

// main classes
const { msg, config, cache, network } = require('./classes/main.js');

console.clear();

msg.primary('Loading..');

// error handler
process.on('uncaughtException', (err, origin) => {

	msg.error(`[error] Exception: ${err}`);
	process.exit();

});

// main
(async () => {

	// load cache
	await cache.load('cache.json');

	// load config using our loaded cache
	await config.load('config.ini');

	// initialize our network using a config.
	await network.load();

    // prepare network for transactions
    await network.prepare();

    if(!network.isETH(config.cfg.contracts.input)) {
        msg.error(`[error] The free version of the bot can only use the BNB pair.`);
        process.exit();
    }

    // print debug info
    console.clear();

    ConsoleLog(`/*=================================================*/
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
/*=================================================*/\n\n`);

    msg.primary('Eryx Lite has been started.');

	// balance check
    if(network.bnb_balance == 0) {
    	msg.error(`[error] You don't have any BNB in your account. (used for gas fee)`);
        process.exit();
    }

    // check if has enough input balance
    if((network.input_balance < config.cfg.transaction.amount_in_formatted)) {
        msg.error(`[error] You don't have enough input balance for this transaction.`);
        process.exit();
    }

    // fetch pair
    let pair = await network.getPair(config.cfg.contracts.input, config.cfg.contracts.output);

    msg.primary("Pair address: " + JSON.stringify(pair) + ".");

    // get liquidity
    let liquidity = await network.getLiquidity(pair);

    msg.primary(`Liquidity found: ${liquidity} ${cache.data.addresses[config.cfg.contracts.input].symbol}.\n`);

    // get starting tick
    let startingTick = Math.floor(new Date().getTime() / 1000);
    
    //purchase token [bnb -> token (through bnb)]
    let receipt = await network.transactToken(
        config.cfg.contracts.input, 
        config.cfg.contracts.output
    );

    if(receipt == null) {
        msg.error('[error] Could not retrieve receipt from buy tx.');
        process.exit();
    }

    console.log(chalk.hex('#2091F6').inverse('==================== [TX COMPLETED] ===================='));
    console.log(chalk.hex('#2091F6')('• ') + chalk.hex('#EBF0FA')(`From ${cache.data.addresses[config.cfg.contracts.input].symbol} (${config.cfg.transaction.amount_in} ${cache.data.addresses[config.cfg.contracts.input].symbol}) -> ${cache.data.addresses[config.cfg.contracts.output].symbol} (minimum ${network.amount_bought_unformatted} ${cache.data.addresses[config.cfg.contracts.output].symbol})`));
    console.log(chalk.hex('#2091F6')('• ') + chalk.hex('#EBF0FA')(`${network.chains[network.network.chainId].page}/tx/${receipt.logs[1].transactionHash}`));
    console.log(chalk.hex('#2091F6').inverse('========================================================\n'));

    // save cache just to be sure
    await cache.save();

    msg.success(`Finished in ${((Math.floor(new Date().getTime() / 1000)) - startingTick)} seconds.`);

    process.exit();

})();

setInterval(() => {}, 1 << 30);