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

const fs = require('fs');

class Cache {

	async load(_name) {

		// load from cached file
		this._name = _name;

		if(!(fs.existsSync(_name))) {
			await fs.writeFileSync(_name, '{}');
		}

	    this.data = JSON.parse(await fs.readFileSync(_name));

	    if(!this.data.addresses) {
	        this.data.addresses = {};
	    }

	}

	async save() {
		await fs.writeFileSync(this._name, JSON.stringify(this.data));
	}

	isAddressCached(_address) {

		if(!this.data.addresses[_address])
			return false;

		return this.data.addresses[_address];

	}

	setAddressArtifacts(_address, _decimals, _symbol) {

		if(!this.isAddressCached(_address))
			this.createAddress(_address);

		
		this.data.addresses[_address].decimals = _decimals;
		this.data.addresses[_address].symbol = _symbol;
	}

	setAddressBalance(_address, _balance) {

		if(!this.isAddressCached(_address))
			this.createAddress(_address);

		this.data.addresses[_address].balance = _balance;
	}

	createAddress(_address) {
		
		this.data.addresses[_address] = {};

		return this.data.addresses[_address];
	}

}

module.exports = new Cache();