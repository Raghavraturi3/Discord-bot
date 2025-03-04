const { SlashCommandBuilder, PermissionFlagsBits, TimeSpanFormat } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Temporarily mutes a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to timeout')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration in minutes')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for timeout')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Only users with timeout permission can use it

    async execute(interaction) {
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.editReply({ content: '❌ That user is not in this server.' });
        }

        if (interaction.member.id === targetMember.id) {
            return interaction.editReply({ content: '❌ You cannot timeout yourself.' });
        }

        if (interaction.member.roles.highest.comparePositionTo(targetMember.roles.highest) <= 0) {
            return interaction.editReply({ content: '❌ You cannot timeout this user because their role is equal or higher than yours.' });
        }

        if (!targetMember.moderatable) {
            return interaction.editReply({ content: '❌ I cannot timeout this user due to role hierarchy or permission issues.' });
        }

        try {
            await targetMember.timeout(duration * 60 * 1000, reason); // Convert minutes to milliseconds
            await interaction.editReply(`🔇 **${targetUser.tag}** has been timed out for **${duration} minutes**.\n**Reason:** ${reason}`);
        } catch (error) {
            console.error('Error timing out user:', error);
            await interaction.editReply({ content: '❌ An error occurred while trying to timeout that user.' });
        }
    },
};
