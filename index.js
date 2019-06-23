#!/usr/bin/env node

'use strict';

//Config file
const config = require('./config');

// Node Core libs:
var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( );

// NPM libs:
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
	// console.log(client.channels)
	// console.log(client.guilds)
	client.channels.get(config.channel).send('henlo meatbags');
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

	if (msg.content === 'bark') {
		msg.reply('BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK BARK');
	}

	if (msg.channel.type === 'dm' && msg.content === 'ip') {
		// msg.reply(networkInterfaces["wlp3s0"][0]["address"])
		if (msg.author.id === config.owner) {
			msg.reply(JSON.stringify(networkInterfaces));
		} else {
			msg.reply('You are not authenticated.');
			console.log('id: ' + msg.author.id  + '\n name: ' + msg.author.username);
			client.fetchUser(config.owner).then(user => user.send('id: ' + msg.author.id + '\n name: ' + msg.author.username)).catch(console.error);
		}
		// console.log(msg.author.id === "138259699068829696");
	}
});

client.login(config.discordAPIKey);



// console.log( networkInterfaces["wlp3s0"][0]["address"] );
