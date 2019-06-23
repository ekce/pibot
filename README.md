Just a simple discord bot.

In order to run it you will need to provide a configuration file.
`config.js`:
```
var config = {
	//Port number for ssh connection.
	port: <PORT NUMBER>,
	//User name for ssh connection.
	user: '<USER NAME>',
	//Path for ssh key.
	sshkey: '~/.ssh/<KEY>',
	//Network device.
	dev: 'wlp3s0',
	//Owner gets notifications from the bot.
	owner: <OWNER SNOWFLAKE>,
	//Admins can query the bot for ip address.
	admins: [<ADMIN SNOWFLAKE>, <ADMIN SNOWFLAKE>, <ADMIN SNOWFLAKE>],
	//Channel it announces on when it's live.
	channel: <CHANNEL SNOWFLAKE>,
	//Discord API key.
	discordAPIKey: <DISCORD API KEY>
};
module.exports = config;
```

Here is a sample systemd unit file that can be used to start the bot (using NVM).
`pibot.service`:
```
[Unit]
Description=A simple discord bot
After=network.target

[Service]
Type=idle
Environment=NODE_VERSION=12
ExecStart=/home/alarm/.nvm/nvm-exec node ./server.js
WorkingDirectory=/home/alarm/pibot
Restart=always
RestartSec=5
StartLimitInterval=0
User=alarm

[Install]
WantedBy=multi-user.target
```

You can view logs with `journalctl -u pibot`.
