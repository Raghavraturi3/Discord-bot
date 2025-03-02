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

// Collection for commands
client.commands = new Collection();

// Load commands dynamically
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(folder => {
    const folderPath = path.join(commandsPath, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
        fs.readdirSync(folderPath).forEach(file => {
            if (file.endsWith('.js')) {
                const command = require(path.join(folderPath, file));
                client.commands.set(command.name, command);
            }
        });
    }
});

console.log(`✅ Loaded ${client.commands.size} commands.`);

// Load event handlers dynamically
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(folder => {
    const folderPath = path.join(eventsPath, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
        fs.readdirSync(folderPath).forEach(file => {
            if (file.endsWith('.js')) {
                const event = require(path.join(folderPath, file));
                const eventName = file.split('.')[0];
                if (typeof event === 'function') {
                    client.on(eventName, event.bind(null, client));
                } else {
                    console.error(`❌ ${eventName} is not a function`);
                }
            }
        });
    }
});

console.log('✅ Event handlers loaded.');

// Slash command interaction handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('❌ Error executing command:', error);
        await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
});

// Handle bot login
client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
