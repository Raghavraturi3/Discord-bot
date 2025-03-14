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
        const message = interaction.options.getString('message');
        
        // Send the echoed message without revealing the user who sent it
        await interaction.channel.send({ content: message });
        
        // Acknowledge the command was used without revealing the user
        await interaction.reply({ content: 'Message echoed!', ephemeral: true });
    },
};
