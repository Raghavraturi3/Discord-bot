require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const deletedFilePath = path.join(__dirname, 'deleted.txt');
let lastDeletedMessage = {};
let lastEditedMessage = {};


let status = [
    {
        name: 'Help',
        type: ActivityType.Streaming,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
        name: 'wait',
        type: ActivityType.Watching,
    },
    {
        name: 'WHAT!',
        type: ActivityType.Listening,
    },
];

client.on('ready', () => {
    console.log('The bot is ready.');

    setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        let currentStatus = status[random];

        client.user.setActivity(currentStatus.name, {
            type: currentStatus.type,
            url: currentStatus.type === ActivityType.Streaming ? currentStatus.url : undefined,
        });

        // Logging bot activity changes
        fs.unlink(deletedFilePath, (err) => {
            if (err && err.code !== 'ENOENT') console.log('Error deleting old file:', err);
            fs.appendFile(deletedFilePath, `--- Bot updated status at ${new Date().toISOString()} ---\n`, (err) => {
                if (err) console.log('Error writing to file:', err);
            });
        });

    }, 10000);
});

function getCurrentTime() {
    return new Date().toLocaleString();
}

client.on('messageDelete', async (message) => {
    if (!message.partial) {
        lastDeletedMessage[message.channel.id] = {
            content: message.content || "*[Message had no text]*",
            authorName: message.member?.nickname || message.author.username,
        };

        const logMessage = `Deleted Message\n${lastDeletedMessage[message.channel.id].authorName}: ${lastDeletedMessage[message.channel.id].content}\nTime: ${getCurrentTime()}\n\n`;
        fs.appendFile(deletedFilePath, logMessage, (err) => {
            if (err) throw err;
        });
    }
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!oldMessage.partial && !newMessage.author.bot) {
        lastEditedMessage[newMessage.channel.id] = {
            oldContent: oldMessage.content || "*[Message had no text before edit]*",
            authorName: newMessage.member?.nickname || newMessage.author.username,
        };

        const logMessage = `Edited Message\n${lastEditedMessage[newMessage.channel.id].authorName}: ${lastEditedMessage[newMessage.channel.id].oldContent}\nTime: ${getCurrentTime()}\n\n`;
        fs.appendFile(deletedFilePath, logMessage, (err) => {
            if (err) throw err;
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'best') {
            const first = interaction.options.getString('first');
            const second = interaction.options.getString('second');
            await interaction.reply(`${first} and ${second}, you both are great!`);
        }

        if (interaction.commandName.toLowerCase() === 'hey') {
            await interaction.reply('hello');
        }

        const ALLOWED_USER_ID = process.env.USER_ID;

        if (interaction.commandName === 'snip') {
            if (interaction.user.id !== ALLOWED_USER_ID) {
                return interaction.reply("You don't have permission to use this command. Ask Blank00200 to use it.");
            }

            const lastDel = lastDeletedMessage[interaction.channelId];
            const lastEdit = lastEditedMessage[interaction.channelId];

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle("Snip")
                .setDescription("Here's the last deleted and edited message in this channel:")
                .setTimestamp();

            embed.addFields({
                name: '🗑️ Last Deleted Message',
                value: lastDel ? `**${lastDel.authorName}**: ${lastDel.content}` : '*No recent deleted messages found.*',
                inline: false,
            });

            embed.addFields({
                name: '✏️ Last Edited Message',
                value: lastEdit ? `**${lastEdit.authorName}**: ${lastEdit.oldContent}` : '*No recent edited messages found.*',
                inline: false,
            });

            await interaction.reply({ embeds: [embed] });
        }
    }

    // Button Role Assignment
    if (interaction.isButton()) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const role = interaction.guild.roles.cache.get(interaction.customId);
            if (!role) {
                await interaction.editReply("Can't find that role.");
                return;
            }

            if (interaction.member.roles.cache.has(role.id)) {
                await interaction.member.roles.remove(role);
                await interaction.editReply(`❌ The role **${role.name}** has been removed.`);
            } else {
                await interaction.member.roles.add(role);
                await interaction.editReply(`✅ The role **${role.name}** has been added.`);
            }
        } catch (error) {
            console.error(error);
        }
    }
});

client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name.toLowerCase().includes('welcome'));
    if (!channel) return;
    channel.send(`Welcome <@${member.id}> to ${member.guild.name}! 🎉`);
});

client.login(process.env.TOKEN);
