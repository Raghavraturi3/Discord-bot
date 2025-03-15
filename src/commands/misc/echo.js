const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Echoes the message you type')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to echo')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const message = interaction.options.getString('message');

            // Send message to the channel
            await interaction.channel.send({ content: message });

            // Send ephemeral confirmation message
            await interaction.reply({ content: 'Message echoed!', ephemeral: true });

        } catch (error) {
            console.error('Error handling /echo command:', error);

            // Inform the user of the issue without crashing the bot
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Failed to echo message. Please try again.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Failed to echo message. Please try again.', ephemeral: true });
            }
        }
    },
};
