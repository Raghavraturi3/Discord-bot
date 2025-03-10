const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberRemove', async (member) => {
        const channel = member.guild.systemChannel; // Change this if needed
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('😢 Goodbye!')
            .setDescription(`**${member.user.tag}** has left **Endless Void**. We'll miss you! 💔`)
            .setThumbnail('https://i.imgur.com/Fn4RjYw.png') // Change this URL for a custom thumbnail
            .setFooter({ text: `We now have ${member.guild.memberCount} members.`, iconURL: member.user.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    });
};
