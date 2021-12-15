/*=================================================*/
/*                                                 */
/*              Written By Zooky.                  */
/*                                                 */
/*             Discord: Zooky.#1003                */
/*              Telegram: @zookyy                  */
/*                                                 */
/*  Github: https://github.com/zookyy/bsc-sniper   */
/*                                                 */
/*  If you wish to purchase the premium version    */
/*  please visit the github link above.            */
/*                                                 */
/*=================================================*/

const ethers = require('ethers');
const fs = require('fs');
const cache = require('./cache.js');
const args = require('minimist')(process.argv.slice(2));
const msg = require('./msg.js');

class Config {

	async load(_name) {

        if(!(fs.existsSync(_name))) {
            await fs.writeFileSync(_name, '');
        }

        this.cfg = this.parseConfig((await fs.readFileSync(_name)).toString());

        // redefine inputs to real address instead of name.
        this.cfg.contracts.input = this.getContractAddressByName(this.cfg.contracts.input);
        this.cfg.contracts.output = this.getContractAddressByName(this.cfg.contracts.output);

        this.cfg.transaction.gas_price = ethers.utils.parseUnits(`${this.cfg.transaction.gas_price}`, 'gwei');
    }

	parseConfig(str){
	    let object = {};
	    let lines = str.split('\n');
	    let group;
	    let match;

	    let REG_GROUP = /^\s*\[(.+?)\]\s*$/;
	    let REG_PROP = /^\s*([^#].*?)\s*=\s*(.*?)\s*$/;

	    for(let i = 0, len = lines.length; i !== len; i++){
	        if(match = lines[i].match(REG_GROUP)) {
	            object[match[1].toLowerCase()] = group = object[match[1].toLowerCase()] || {};
	        }   
	        else if(group && (match = lines[i].match(REG_PROP))) {
	            group[match[1].toLowerCase()] = match[2].toLowerCase();
	        }
	    }

	    return object;
	}

	getContractAddressByName(_name) {

	    // pre-defined contracts
	    if(_name.toLowerCase() == 'bnb') {
	        return '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
	    } else if(_name.toLowerCase() == 'eth') {
	    	return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
	    } else if(_name.toLowerCase() == 'matic') {
	    	return '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
	    } else if(_name.toLowerCase() == 'busd') {
	        return '0xe9e7cea3dedca5984780bafc599bd69add087d56';
	    } else if(_name.toLowerCase() == 'sfm') {
	    	return '0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3';
	    }

	    // no address specified, fail with error
	    if(!_name.startsWith('0x')) {
	    	msg.error(`[error::config] Contract "${_name}" does not exist, please use an address instead.`);
	    	process.exit();
	    }

	    return _name;
	}
}

module.exports = new Config();