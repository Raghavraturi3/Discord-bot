require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates, // REQUIRED for voice channel access
        GatewayIntentBits.MessageContent,
    ],
});

// Initialize DisTube for music playback
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [new SpotifyPlugin()]
});

// Initialize the commands collection
client.commands = new Collection();

// Load commands from the "commands" folder
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(folder => {
    const folderPath = path.join(commandsPath, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
        fs.readdirSync(folderPath).forEach(file => {
            if (file.endsWith('.js')) {
                const command = require(path.join(folderPath, file));
                if (command.data && command.execute) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.error(`❌ Command in ${file} is missing data or execute function.`);
                }
            }
        });
    }
});

console.log(`✅ Loaded ${client.commands.size} commands.`);

// Load event handlers from the "events" folder
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(eventsPath, file))(client);
    }
});

console.log('✅ Event handlers loaded.');

// Log messages to files
function logToFile(filename, content) {
    const filePath = path.join(__dirname, filename);
    fs.appendFile(filePath, content + '\n', (err) => {
        if (err) console.error(`❌ Error writing to ${filename}:`, err);
    });
}

// Track deleted messages
client.on('messageDelete', async (message) => {
    if (!message.author?.bot && message.content) {
        const logEntry = `[${new Date().toLocaleString()}] ${message.author.tag}: ${message.content}`;
    }
});

// Track edited messages
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!oldMessage.author?.bot && oldMessage.content !== newMessage.content) {
        const logEntry = `[${new Date().toLocaleString()}] ${oldMessage.author.tag}: "${oldMessage.content}" → "${newMessage.content}"`;
    }
});

// DisTube Events
client.distube
    .on('playSong', (queue, song) => {
        queue.textChannel.send(`🎶 Now playing: **${song.name}**`);
    })
    .on('error', (channel, error) => {
        console.error(`❌ DisTube Error: ${error}`);
        channel.send('❌ An error occurred while trying to play music.');
    });

client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
