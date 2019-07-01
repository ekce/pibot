'use strict';

//Config file
const config = require('./config');

// Node Core libs:
const os = require('os');
const networkInterfaces = os.networkInterfaces();

// NPM libs:
const Discord = require('discord.js');
const client = new Discord.Client();


const gpio = require('rpi-gpio');
const gpiop = gpio.promise;
const wait = require('util').promisify(setTimeout);

var status = false;
gpio.on('change', function(channel, value) {
	//status change 
	if (value === !status) {
		status = value;
		console.log(`Room is ${status ? 'open.' : 'closed.'}`);
		//382333745769873421 - sum general
		//475141498778943489 - is the room open
		client.channels.get('475141498778943489').send(`Room is ${status ? 'open.' : 'closed.'}`);
	}
});


var ltest = async () => {
	console.log('start');
	await gpiop.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);
	status = await gpiop.read(7);
}

ltest();



//String commands/templates
function logNameID(msg) {
	return `id: ${msg.author.id} name: ${msg.author.username}`;
}
function sshcmd() {
	return `ssh -i ${config.sshkey} -p ${config.port} ${config.user}@${networkInterfaces[config.dev][0]['address']}`;
}


client.on(
	'ready',
	() => {
		console.log(`pibot: Logged in as ${client.user.tag}!`);
		// console.log(client.channels)
		// console.log(client.guilds)
		// client.channels.get(config.channel).send('henlo meatbags');
	}
);

client.on(
	'message',
	msg => {
		// if (msg.content === 'ping') {
		// 	msg.reply('Pong!');
		// }

		// if (msg.content === 'bark') {
		// 	msg.reply(
		// 		'BARK BARK BARK BARK BARK BARK BARK BARK BARK ' +
		// 		'BARK BARK BARK BARK BARK BARK BARK BARK BARK ' +
		// 		'BARK BARK BARK BARK BARK BARK BARK BARK BARK '
		// 		);
		// }

		if (msg.channel.type === 'dm' &&
			(msg.content === 'ip' ||
			 msg.content === 'iplong' ||
			 msg.content === 'ssh')
			) {
			if (config.admins.includes(msg.author.id)) {
				console.log(`pibot: ${msg.author.username}(${msg.content})`);
				if (msg.content === 'ip') {
					msg.reply(networkInterfaces[config.dev][0]['address']);
				}
				if (msg.content === 'iplong') {
					msg.reply(JSON.stringify(networkInterfaces));
				}
				if (msg.content === 'ssh') {
					msg.reply(sshcmd());
				}
			} else {
				msg.reply('You are not authenticated.');
				console.log(`pibot: ${logNameID(msg)}`);
				client.fetchUser(config.owner)
					.then(
						user => user.send(logNameID(msg))
					).catch(console.error);
			}
		}
	}
);

client.login(config.discordAPIKey)
 .then(() => console.log('pibot: Started.'))
 .catch(() => console.error('pibot: Crashed.'));


process.on('SIGTERM', () => process.emit('cleanStop'));
process.on('SIGINT', () => process.emit('cleanStop'));
process.on('uncaughtException', () => process.emit('cleanStop'));
process.on('SIGUSR1', () => process.emit('cleanStop'));
process.on('SIGUSR2', () => process.emit('cleanStop'));

process.on('cleanStop', () => {
	gpio.destroy();
	console.log('terminated');
	process.exit(0);
});
