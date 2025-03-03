const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

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
        ),
    async execute(interaction) {
        // Defer reply to avoid timeouts (ephemeral so only you see errors)
        await interaction.deferReply({ ephemeral: true });
        
        // Check if the command user has the "BanMembers" permission
        if (!interaction.member.permissions.has('BanMembers')) {
            return interaction.editReply({ content: '❌ You do not have permission to ban members.' });
        }
        
        // Check if the bot itself has the "BanMembers" permission
        if (!interaction.guild.members.me.permissions.has('BanMembers')) {
            return interaction.editReply({ content: '❌ I do not have permission to ban members.' });
        }
        
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Fetch the member object for the target user
        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
        if (!targetMember) {
            return interaction.editReply({ content: '❌ That user is not in this server.' });
        }
        
        // Prevent banning yourself
        if (interaction.member.id === targetMember.id) {
            return interaction.editReply({ content: '❌ You cannot ban yourself.' });
        }
        
        // Ensure the command user's highest role is higher than the target's highest role
        if (interaction.member.roles.highest.comparePositionTo(targetMember.roles.highest) <= 0) {
            return interaction.editReply({ content: '❌ You cannot ban this user because their role is equal or higher than yours.' });
        }
        
        // Check if the target is bannable by the bot
        if (!targetMember.bannable) {
            return interaction.editReply({ content: '❌ I cannot ban this user due to role hierarchy or permission issues.' });
        }
        
        try {
            await targetMember.ban({ reason });
            await interaction.editReply({ content: `✅ Successfully banned **${targetUser.tag}**\n**Reason:** ${reason}` });
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.editReply({ content: '❌ An error occurred while trying to ban that user.' });
        }
    },
};
