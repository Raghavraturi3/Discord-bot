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
    { id: '1250168937262481438', label: 'Male' },
    { id: '1250169167559266364', label: 'Female' }
];

client.once('ready', async () => {
    console.log(`${client.user.tag} is online!`);

    try {
        const channel = await client.channels.fetch('1249433715478757439'); // Replace with your channel ID
        if (!channel) return console.log('Channel not found!');

        const row = new ActionRowBuilder().addComponents(
            roles.map(role => 
                new ButtonBuilder()
                    .setCustomId(role.id)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Primary)
            )
        );

        await channel.send({
            content: 'Click a button to claim or remove your role!',
            components: [row]
        });

        console.log('Role selection message sent.');
    } catch (error) {
        console.log('Error sending role message:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (!member) return interaction.reply({ content: '❌ Member not found!', ephemeral: true });

        const role = roles.find(r => r.id === interaction.customId);

        if (!role) return;

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role.id);
            await interaction.reply({ content: `✅ Removed **${role.label}** role.`, ephemeral: true });
        } else {
            await member.roles.add(role.id);
            await interaction.reply({ content: `✅ Added **${role.label}** role.`, ephemeral: true });
        }
    } catch (error) {
        console.error('Error handling role assignment:', error);
        await interaction.reply({ content: '❌ An error occurred while assigning/removing the role.', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
