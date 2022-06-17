'use strict';

//Config file
const config = require('./config');

// Node Core libs:
const os = require('os');
const networkInterfaces = os.networkInterfaces();

// NPM libs:
const Discord = require('discord.js');
const client = new Discord.Client();

// GPIO libs
const gpio = require('rpi-gpio');
const gpiop = gpio.promise;

//String commands/templates
const ipAddressV4 = networkInterfaces[config.dev][0]['address'];

function roomStatus() {
	return `Room is ${status ? 'open.' : 'closed.'}`;
}
function logNameID(msg) {
	return `id: ${msg.author.id} name: ${msg.author.username}`;
}
function sshcmd() {
	return `ssh -i ${config.sshkey} -p ${config.port} ${config.user}@${ipAddressV4}`;
}

var status = false;



//Light detection status change
gpio.on('change', function(channel, value) {
	if (value === !status) {
		status = value;
		console.log('pibot:', roomStatus());
		client.channels.get(config.channel).send(roomStatus());
	}
});


var setupGPIO = async () => {
	console.log('pibot:', 'Setting up GPIO');
	await gpiop.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);
	status = await gpiop.read(7);
}

setupGPIO().catch(console.error);



//Client event handling
client.on(
	'ready',
	() => {
		console.log('pibot:', 'Logged in as', client.user.tag);
	}
);

client.on(
	'message',
	msg => {
		if (msg.channel.type === 'dm' &&
			(msg.content === 'ip' ||
			 msg.content === 'iplong' ||
			 msg.content === 'ssh' ||
			 msg.content === 'status')
			) {
			if (config.admins.includes(msg.author.id)) {
				console.log('pibot:', msg.author.username, ':', msg.content);
				if (msg.content === 'ip') {
					msg.reply('`' + ipAddressV4 + '`').catch(console.error);
				}
				if (msg.content === 'iplong') {
					msg.reply('```' + JSON.stringify(networkInterfaces, null, '\t') + '```').catch(console.error);
				}
				if (msg.content === 'ssh') {
					msg.reply('`' + sshcmd() + '`').catch(console.error);
				}
				if (msg.content === 'status') {
					msg.reply(roomStatus()).catch(console.error);
				}
			} else {
				msg.reply('You are not authenticated');
				console.log('pibot:', logNameID(msg));
				client.fetchUser(config.owner)
					.then(
						owner => owner.send(logNameID(msg))
					).catch(console.error);
			}
		}
	}
);

client.login(config.discordAPIKey)
 .then(() => console.log('pibot:', 'Started'))
 .catch(() => console.error('pibot:', 'Failed to Start'));



process.on(
	'unhandledRejection',
	(reason, promise) => {
		console.error('pibot:', reason, 'Unhandled rejection at promise', promise);
		// process.emit('cleanStop');
	}
);
process.on(
	'uncaughtException',
	(err) => {
		console.error('pibot:', err, 'Uncaught exception');
		process.emit('cleanStop');
	}
);
process.on('SIGTERM', () => process.emit('cleanStop'));
process.on('SIGINT', () => process.emit('cleanStop'));
process.on('SIGUSR1', () => process.emit('cleanStop'));
process.on('SIGUSR2', () => process.emit('cleanStop'));

process.on('cleanStop', () => {
	gpio.destroy();
	console.log('pibot:', 'Terminated');
	process.exit(0);
});
