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
    if (content === 'hello boss') {
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle("Boss")
            .setDescription("Don't Fight")
            .setThumbnail('https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE?format=jpg&name=small')
            .addFields({ 
                name: 'Testing Field',
                value: 'some Random value',
                inline: true,
            })
            .setImage('https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE?format=jpg&name=small')
            .setTimestamp();

        message.reply({ embeds: [embed] });
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
})

client.login(process.env.TOKEN);
