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
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

// Initialize DisTube
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [new SpotifyPlugin()]
});

// Initialize commands
client.commands = new Collection();
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

// Load event handlers
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
        logToFile('deleted_messages.log', logEntry);
    }
});

// Track edited messages
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!oldMessage.author?.bot && oldMessage.content !== newMessage.content) {
        const logEntry = `[${new Date().toLocaleString()}] ${oldMessage.author.tag}: "${oldMessage.content}" → "${newMessage.content}"`;
        logToFile('edited_messages.log', logEntry);
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

// Handle Slash Commands with Rate Limit Handling
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to prevent rate limits
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error executing command ${interaction.commandName}:`, error);
        if (error.status === 429) {
            console.warn('⚠️ Rate limited! Retrying after delay...');
            await new Promise((resolve) => setTimeout(resolve, error.retry_after * 1000));
            await interaction.reply({ content: 'Retrying due to rate limit...', ephemeral: true });
        } else {
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    }
});

// Echo Command
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'echo') {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Rate limit handling
            await interaction.reply({ content: interaction.options.getString('message'), ephemeral: false });
        } catch (error) {
            console.error('❌ Echo Command Error:', error);
        }
    }
});

client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Error Handling for Unexpected Crashes
client.on('error', (error) => console.error('❌ Client Error:', error));
process.on('unhandledRejection', (error) => console.error('❌ Unhandled Rejection:', error));

client.login(process.env.TOKEN);
