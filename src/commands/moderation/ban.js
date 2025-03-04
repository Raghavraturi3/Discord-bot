const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning the user')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Ensures only users with ban permission can use it

    async execute(interaction) {
        await interaction.deferReply(); // Remove { ephemeral: true } to make it public

        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.editReply({ content: '❌ That user is not in this server.' });
        }

        if (interaction.member.id === targetMember.id) {
            return interaction.editReply({ content: '❌ You cannot ban yourself.' });
        }

        if (interaction.member.roles.highest.comparePositionTo(targetMember.roles.highest) <= 0) {
            return interaction.editReply({ content: '❌ You cannot ban this user because their role is equal or higher than yours.' });
        }

        if (!targetMember.bannable) {
            return interaction.editReply({ content: '❌ I cannot ban this user due to role hierarchy or permission issues.' });
        }

        try {
            await targetMember.ban({ reason });

            // Send a public message in the same channel
            await interaction.editReply(`🚨 **${targetUser.tag}** has been banned!\n**Reason:** ${reason}`);
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.editReply({ content: '❌ An error occurred while trying to ban that user.' });
        }
    },
};
