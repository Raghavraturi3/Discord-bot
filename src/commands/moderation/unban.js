const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('User ID of the user to unban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unbanning the user')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      // Defer reply to avoid timeout issues
      await interaction.deferReply({ ephemeral: true });
    } catch (err) {
      console.error('Error deferring reply:', err);
    }

    try {
      // Permission checks for the executor and the bot
      if (!interaction.member.permissions.has('BanMembers')) {
        return interaction.editReply({ content: '❌ You do not have permission to unban members.' });
      }
      if (!interaction.guild.members.me.permissions.has('BanMembers')) {
        return interaction.editReply({ content: '❌ I do not have permission to unban members.' });
      }

      const userId = interaction.options.getString('userid');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      console.log(`Unban command triggered for user ID: ${userId}`);

      // Fetch the list of banned users
      const bans = await interaction.guild.bans.fetch();
      console.log(`Fetched ${bans.size} bans`);

      const bannedUser = bans.get(userId);
      if (!bannedUser) {
        return interaction.editReply({ content: '❌ That user is not banned.' });
      }

      // Attempt to unban the user
      await interaction.guild.members.unban(userId, reason);
      return interaction.editReply({ content: `✅ Successfully unbanned user with ID ${userId}\n**Reason:** ${reason}` });
    } catch (error) {
      console.error('Error in unban command:', error);
      return interaction.editReply({ content: '❌ An error occurred while trying to unban that user.' });
    }
  },
};
