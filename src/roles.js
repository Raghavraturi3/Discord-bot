require('dotenv').config();
const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const roles = [
    {
        id: '1250168937262481438', // Role ID for Male
        label: 'Male'
    },
    {
        id: '1250169167559266364', // Role ID for Female
        label: 'Female'
    }
];

client.on('ready', async () => {
    try {
        const channel = client.channels.cache.get('1249433715478757439'); // Replace with your channel ID
        if (!channel) return console.log('Channel not found!');

        // Creating buttons for each role
        const row = new ActionRowBuilder().addComponents(
            roles.map(role => 
                new ButtonBuilder()
                    .setCustomId(role.id)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Primary)
            )
        );

        await channel.send({
            content: 'Claim or remove your role.',
            components: [row]
        });

        console.log('Role selection message sent.');

        // Debugging Role Permissions
        roles.forEach(async role => {
            const roleData = channel.guild.roles.cache.get(role.id);
            if (roleData) {
                console.log(`Permissions for role ${role.label}:`, roleData.permissions.toArray());
            } else {
                console.log(`Role ${role.label} not found.`);
            }
        });

    } catch (error) {
        console.log(error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const role = roles.find(r => r.id === interaction.customId);
        
        if (!role) return;

        const hasRole = member.roles.cache.has(role.id);

        if (hasRole) {
            await member.roles.remove(role.id);
            await interaction.reply({ content: `Removed ${role.label} role.`,  flags: 64 });
        } else {
            await member.roles.add(role.id);
            await interaction.reply({ content: `Added ${role.label} role.`,  flags: 64 });
        }
    } catch (error) {
        console.log('Error handling interaction:', error);
        await interaction.reply({ content: `❌ An error occurred while assigning/removing the role.`,  flags: 64 });
    }
});

client.login(process.env.TOKEN);
