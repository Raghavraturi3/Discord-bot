const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberRemove', async (member) => {
        const channel = member.guild.systemChannel; // Change if needed
        if (!channel) return;

        const leaveEmbed = new EmbedBuilder()
            .setColor('#ff0000') // Red color
            .setTitle(`💔 Goodbye from Endless Void`)
            .setDescription(`Sad to see you go, **${member.user.username}**. Hope to see you again!`)
            .setThumbnail('https://i.imgur.com/9MkM6Kq.png') // Change thumbnail if needed
            .setFooter({ text: 'Endless Void Community', iconURL: member.guild.iconURL() })
            .setTimestamp()
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) });

        channel.send({ embeds: [leaveEmbed] });
    });
};
