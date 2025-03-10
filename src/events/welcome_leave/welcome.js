const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        const channel = member.guild.systemChannel; // Change this if needed
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🎉 Welcome to Endless Void!')
            .setDescription(`Hey ${member}, welcome to **Endless Void**! 🎊\nHope you have a great time here!`)
            .setThumbnail('https://i.imgur.com/Fn4RjYw.png') // Change this URL for a custom thumbnail
            .setImage('https://i.imgur.com/zM1l4j5.gif') // Optional banner image
            .setFooter({ text: `Member #${member.guild.memberCount}`, iconURL: member.user.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    });
};
