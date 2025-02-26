require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Create the client object
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// Path to the file where deleted messages will be stored
const deletedFilePath = path.join(__dirname, 'deleted.txt');

// Stores last deleted messages per channel
let lastDeletedMessage = {};
// Stores last edited messages per channel
let lastEditedMessage = {};

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log('The bot is ready.');

    // Delete the existing deleted.txt file when the bot starts, and create a fresh one
    fs.unlink(deletedFilePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.log('Error deleting old file:', err);
        }
        
        // Log the startup time to the deleted.txt file
        fs.appendFile(deletedFilePath, `--- Deleted and Edited Messages (Bot started at ${new Date().toISOString()}) ---\n`, (err) => {
            if (err) throw err;
        });
    });
});

// Function to get the current time in a readable format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString(); // Returns the date and time in a readable format
}

// Event listener for message deletions
client.on('messageDelete', async (message) => {
    if (!message.partial) {
        lastDeletedMessage[message.channel.id] = {
            content: message.content || "*[Message had no text]*",
            authorName: message.member?.nickname || message.author.username,
        };

        // Write the deleted message details into the file with timestamp
        const logMessage = `Deleted Message\n${lastDeletedMessage[message.channel.id].authorName}: ${lastDeletedMessage[message.channel.id].content}\nTime: ${getCurrentTime()}\n\n`;
        fs.appendFile(deletedFilePath, logMessage, (err) => {
            if (err) throw err;
        });
    }
});

// Event listener for message edits
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!oldMessage.partial && !newMessage.author.bot) {
        lastEditedMessage[newMessage.channel.id] = {
            oldContent: oldMessage.content || "*[Message had no text before edit]*",
            authorName: newMessage.member?.nickname || newMessage.author.username,
        };

        // Write the edited message details into the file with timestamp
        const logMessage = `Edited Message\n${lastEditedMessage[newMessage.channel.id].authorName}: ${lastEditedMessage[newMessage.channel.id].oldContent}\nTime: ${getCurrentTime()}\n\n`;
        fs.appendFile(deletedFilePath, logMessage, (err) => {
            if (err) throw err;
        });
    }
});

// Event listener for interaction commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    // Handle commands here (e.g., /best, /embed, /snip)
    if (interaction.commandName === 'best') {
        const first = interaction.options.getString('first');
        const second = interaction.options.getString('second');
        await interaction.reply(`${first} and ${second}, you both are great!`);
    }

    if (interaction.commandName.toLowerCase() === 'hey') {
        interaction.reply('hello');
    }

    if (interaction.commandName === 'snip') {
        const lastDel = lastDeletedMessage[interaction.channelId];
        const lastEdit = lastEditedMessage[interaction.channelId];

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle("Snip")
            .setDescription("Here's the last deleted and edited message in this channel:")
            .setTimestamp();

        if (lastDel) {
            embed.addFields({
                name: '🗑️ Last Deleted Message',
                value: `**${lastDel.authorName}**: ${lastDel.content}`,
                inline: false,
            });
        } else {
            embed.addFields({
                name: '🗑️ Last Deleted Message',
                value: '*No recent deleted messages found.*',
                inline: false,
            });
        }

        if (lastEdit) {
            embed.addFields({
                name: '✏️ Last Edited Message',
                value: `**${lastEdit.authorName}**: ${lastEdit.oldContent}`,
                inline: false,
            });
        } else {
            embed.addFields({
                name: '✏️ Last Edited Message',
                value: '*No recent edited messages found.*',
                inline: false,
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
});

// Event listener for guild member join
client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name.toLowerCase().includes('welcome'));

    if (!channel) return; // If no welcome channel is found, do nothing

    channel.send(`Welcome <@${member.id}> to ${member.guild.name}! 🎉`);
});

// Log in the bot using your token
client.login(process.env.TOKEN);
