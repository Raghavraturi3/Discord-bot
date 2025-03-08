const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Plays a song from a given URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL of the song to play')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        await interaction.deferReply(); // Prevents timeout

        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.editReply({ content: '❌ You need to be in a voice channel to play music.' });
        }

        try {
            // Join the voice channel before playing
            const queue = client.distube.getQueue(interaction.guildId);
            if (!queue) {
                await client.distube.voices.join(voiceChannel);
            }

            // Play the music
            await client.distube.play(voiceChannel, url, { textChannel: interaction.channel, member: interaction.member });

            interaction.editReply({ content: `🎶 Now playing: ${url}` });
        } catch (error) {
            console.error('Error playing music:', error);
            interaction.editReply({ content: '❌ There was an error playing the music. Check console for details.' });
        }
    },
};
