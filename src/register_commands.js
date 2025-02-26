require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'best',
        description: 'Tells who is the best',
        options: [
            {
                name: 'first',
                description: 'First person?',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'second',
                description: 'Second person?',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'embed',
        description: 'Sends an embed!',
    },
    {
        name: 'snip',
        description: 'Shows the last deleted message from this channel',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('Registered commands successfully');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();
