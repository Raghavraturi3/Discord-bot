const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to ban')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Check if the member has 'BanMembers' permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You don’t have permission to ban users!', ephemeral: true });
        }

        // Check if the bot has the 'BanMembers' permission
        if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'I don’t have permission to ban users!', ephemeral: true });
        }

        const target = interaction.options.getUser('target');

        // Check if the target is a bot
        if (target.bot) {
            return interaction.reply({ content: 'I cannot ban bots!', ephemeral: true });
        }

        // Fetch the member object for the target user
        const member = await interaction.guild.members.fetch(target.id);

        // Check if the member exists in the guild
        if (!member) {
            return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
        }

        // Check if the member is bannable
        if (!member.bannable) {
            return interaction.reply({ content: 'I cannot ban this user due to role hierarchy or other restrictions.', ephemeral: true });
        }

        try {
            await member.ban({ reason: 'Banned by command' });
            await interaction.reply({ content: `${target.username} has been banned.` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while banning the user.', ephemeral: true });
        }
    },
};
