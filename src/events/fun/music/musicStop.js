const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and clears the queue'),

    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild);
        
        if (!queue) {
            return interaction.reply({ content: '❌ No music is currently playing.', ephemeral: true });
        }

        queue.stop();
        interaction.reply({ content: '🛑 Music has been stopped and the queue has been cleared.', ephemeral: false });
    },
};
