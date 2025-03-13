// leaving message
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    execute(member) {
        const leaveChannelId = '1249435867001520198'; // 🔹 Set your Leave Channel ID here

        const channel = member.guild.channels.cache.get(leaveChannelId);
        if (!channel) return console.error('⚠️ Leave channel not found.');

        const leaveEmbed = new EmbedBuilder()
            .setColor('#ff0000') // Red color
            .setTitle('👋 Member Left...')
            .setDescription(`**${member.user.username}** has left **Endless Void**. 😢\nWe'll miss you!`)
            .setThumbnail('https://example.com/leave-thumbnail.png') // 🔹 Set your thumbnail image
            .setFooter({ text: `We now have ${member.guild.memberCount} members left.` })
            .setTimestamp()
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) });

        channel.send({ embeds: [leaveEmbed] });
    }
};
