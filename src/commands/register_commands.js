const { REST, Routes, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const newCommands = [
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
        name: 'echo',
        description: 'Echoes the message you type',
        options: [
            {
                name: 'message',
                description: 'The message to echo',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    // Add other commands here...
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Registering all slash commands...');

        // Register the new commands
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: newCommands }
        );
        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Failed to register commands:', error);
    }
})();
