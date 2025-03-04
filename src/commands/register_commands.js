const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'best',
        description: 'Tells who is the best',
        options: [
            {
                name: 'first',
                description: 'First person?',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'second',
                description: 'Second person?',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    {
        name: 'embed',
        description: 'Sends an embed message!',
    },
    {
        name: 'snip',
        description: 'Shows the last deleted message from this channel',
    },
    {
        name: 'ban',
        description: 'Bans a user from the server',
        options: [
            {
                name: 'target',
                description: 'User to ban',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'reason',
                description: 'Reason for banning the user',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ],
    },
    {
        name: 'unban',
        description: 'Unbans a user from the server',
        options: [
            {
                name: 'userid',
                description: 'User ID of the user to unban',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'reason',
                description: 'Reason for unbanning the user',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ],
    },
    {
        name: 'echo',
        description: 'Repeats your message',
        options: [
            {
                name: 'message',
                description: 'The message to repeat',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Removing old guild commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] }
        );
        console.log('✅ Old guild commands removed.');

        console.log('⏳ Registering new slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Failed to register commands:', error);
    }
})();
