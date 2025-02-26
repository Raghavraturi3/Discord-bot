require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

let lastDeletedMessage = {}; // Store last deleted messages per channel

client.on('ready', () => {
    console.log('The bot is ready.');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'best') {
        const first = interaction.options.getString('first');
        const second = interaction.options.getString('second');
        await interaction.reply(`${first} and ${second}, you both are great!`);
    }

    if (interaction.commandName.toLowerCase() === 'hey') {
        interaction.reply('hello');
    }

    if (interaction.commandName === 'snip') {
        const lastMessage = lastDeletedMessage[interaction.channelId];
        if (lastMessage) {
            await interaction.reply(`**${lastMessage.author}**: ${lastMessage.content}`);
        } else {
            await interaction.reply('No recent deleted messages found.');
        }
    }
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    if (content === 'dead chat') {
        message.reply('updating');
    }
    if (content === 'hello blank') {
        message.reply(`updating`);
    }
    if (content === 'no fight') {
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle("Boss")
            .setDescription("Don't Fight (I'm reading all of your chats)")
            .setThumbnail('https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE?format=jpg&name=small')
            .addFields({ 
                name: 'Testing Field',
                value: 'some Random value',
                inline: true,
            })
            .setImage('https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE?format=jpg&name=small')
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
});

client.on('messageDelete', (message) => {
    if (!message.partial) {
        lastDeletedMessage[message.channel.id] = {
            content: message.content,
            author: message.author.tag
        };
    }
});

client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name.toLowerCase().includes('welcome'));

    if (!channel) return; // If no welcome channel is found, do nothing

    channel.send(`Welcome <@${member.id}> to ${member.guild.name}! 🎉`);
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'embed') {
        const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Boss")
        .setDescription("Don't Fight")
        .setThumbnail('https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE?format=jpg&name=small')
        .addFields({ name: 'Testing Field',
            value: 'some Random value',
            inline: true,
         })
         .setImage('https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE?format=jpg&name=small')
         .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
