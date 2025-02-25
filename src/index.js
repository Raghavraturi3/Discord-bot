require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log('The bot is ready.');
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName.toLowerCase() === 'hey') {
        interaction.reply('hello');
    }
});

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    const content = message.content.toLowerCase();

    if (content === 'dead chat') {
        message.reply('Bro, your personality is the only thing deader than this chat');
    }
    if (content === 'hello blank') {
        message.reply(`hello <@${message.author.id}>, how can I help you?`);
    }
});

client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name.toLowerCase().includes('welcome'));

    if (!channel) return; // If no welcome channel is found, do nothing

    channel.send(`Welcome <@${member.id}> to ${member.guild.name}! 🎉`);
});

client.login(process.env.TOKEN);
