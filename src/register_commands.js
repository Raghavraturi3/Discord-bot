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
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Removing old global commands...');
        // This line removes all global commands
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });

        console.log('✅ Global commands removed.');

        console.log('⏳ Removing old guild commands...');
        // Remove guild-specific commands before re-registering
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] });

        console.log('✅ Old guild commands removed.');

        console.log('⏳ Registering slash commands...');
        // Registering commands only for the specific guild
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Failed to register commands:', error);
    }
})();
