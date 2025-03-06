require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
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
fs.readdirSync(eventsPath).forEach(folder => {
    const folderPath = path.join(eventsPath, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
        fs.readdirSync(folderPath).forEach(file => {
            if (file.endsWith('.js')) {
                const event = require(path.join(folderPath, file));
                if (event.name && typeof event.execute === 'function') {
                    client.on(event.name, (...args) => event.execute(...args, client));
                } else {
                    console.error(`❌ Invalid event file: ${file}`);
                }
            }
        });
    }
});

console.log('✅ Event handlers loaded.');

// Log messages to files
function logToFile(filename, content) {
    const filePath = path.join(__dirname, filename); // FIXED PATH

    // Ensure the file exists
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

client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
