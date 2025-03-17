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
        // Acknowledge the interaction with an ephemeral reply to confirm the action
        await interaction.deferReply({ ephemeral: true });

        // Retrieve the message from the command options
        const message = interaction.options.getString('message');
        
        // Send the message to the channel without revealing who used the command
        await interaction.channel.send({ content: message });
        
        // Edit the ephemeral reply to indicate the action has been completed
        await interaction.editReply({ content: 'Message echoed in the channel!' });
    },
};
