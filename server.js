#!/usr/bin/env node

'use strict';

//Config file
const config = require('./config');

// Node Core libs:
const os = require('os');
const networkInterfaces = os.networkInterfaces();

// NPM libs:
const Discord = require('discord.js');
const client = new Discord.Client();


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
		if (msg.content === 'ping') {
			msg.reply('Pong!');
		}

		if (msg.content === 'bark') {
			msg.reply(
				'BARK BARK BARK BARK BARK BARK BARK BARK BARK ' +
				'BARK BARK BARK BARK BARK BARK BARK BARK BARK ' +
				'BARK BARK BARK BARK BARK BARK BARK BARK BARK '
				);
		}

		if (msg.channel.type === 'dm' &&
			(msg.content === 'ip' ||
			 msg.content === 'iplong' ||
			 msg.content === 'ssh')
			) {
			// msg.reply(networkInterfaces["wlp3s0"][0]['address'])
			if (config.admins.includes(msg.author.id)) { //change to admins
				console.log(`pibot: ${msg.author.username}(${msg.content})`);
				if (msg.content === 'ip') {
					msg.reply(JSON.stringify(networkInterfaces));
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
