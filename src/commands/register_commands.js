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
        default_member_permissions: Number(PermissionFlagsBits.BanMembers),
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
        default_member_permissions: Number(PermissionFlagsBits.BanMembers),
    },
    {
        name: 'timeout',
        description: 'Temporarily mutes a user',
        options: [
            {
                name: 'target',
                description: 'User to timeout',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'duration',
                description: 'Duration in minutes',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
            {
                name: 'reason',
                description: 'Reason for timeout',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ],
        default_member_permissions: Number(PermissionFlagsBits.ModerateMembers),
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
    {
        name: 'echofile',
        description: 'Echoes an attached file and optionally replies to a message',
        options: [
            {
                name: 'file',
                description: 'The file to send',
                type: ApplicationCommandOptionType.Attachment,
                required: true,
            },
            {
                name: 'message_id',
                description: 'The message ID to reply to (optional)',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ],
    },
    {
        name: 'music',
        description: 'Play music in a voice channel',
        options: [
            {
                name: 'song',
                description: 'The song name or URL to play',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Fetching current guild commands...');

        // Fetch current guild commands so we don't overwrite old ones
        const currentCommands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
        );

        console.log('✅ Fetched current guild commands.');

        // Delete AI-related commands (if needed)
        const aiCommands = ['ai-command1', 'ai-command2']; // List the AI-related commands here
        const commandsToDelete = currentCommands.filter(command => aiCommands.includes(command.name));

        for (const command of commandsToDelete) {
            console.log(`⏳ Deleting AI-related command: ${command.name}...`);
            await rest.delete(
                Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, command.id)
            );
            console.log(`✅ Deleted AI-related command: ${command.name}`);
        }

        // Register the new commands
        console.log('⏳ Registering all slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: newCommands }
        );
        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Failed to register commands:', error);
    }
})();
