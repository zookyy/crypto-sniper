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

let originalLog = console.log;

console.log = function(msg) {
	return originalLog(`[${getFormattedDate()}] ${msg}`);
}

function getFormattedDate() {
    let date = new Date();

    let minutes = "", seconds = "";

    if(date.getMinutes() < 10)
        minutes = "0" + date.getMinutes();
    else 
        minutes = date.getMinutes();

    if(date.getSeconds() < 10)
        seconds = "0" + date.getSeconds();
    else 
        seconds = date.getSeconds();

    let str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + minutes + ":" + seconds;

    return str;
}

class Msg {

	error(msg) { console.log(chalk.hex('#F62020')(msg)); }
	success(msg) { console.log(chalk.hex('#669EE8')(msg)); }
	primary(msg) { console.log(chalk.hex('#EBF0FA')(msg)); }
	warning(msg) { console.log(chalk.hex('#E8BF66')(msg)); }

}

module.exports = new Msg();