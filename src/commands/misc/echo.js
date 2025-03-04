const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repeats your message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to repeat')
                .setRequired(true)
        ),

    async execute(interaction) {
        const message = interaction.options.getString('message');

        // Defer the reply to prevent "used /echo" message
        await interaction.deferReply({ ephemeral: true });
        
        // Send the echo message without mentioning who sent it
        await interaction.channel.send(message);

        // Delete the original interaction response (so it doesn’t show "used /echo")
        await interaction.deleteReply();
    },
};
