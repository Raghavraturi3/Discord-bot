const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const welcomeChannelId = '1249435427077881906'; // 🔹 Set your Welcome Channel ID here

        const channel = member.guild.channels.cache.get(welcomeChannelId);
        if (!channel) return console.error('⚠️ Welcome channel not found.');

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00ff00') // Green color
            .setTitle('🎉 Welcome to Endless Void!')
            .setDescription(`Hey <@${member.id}>, welcome to **Endless Void**! 🎊\nHope you have a great time here!`)
            .setThumbnail('https://example.com/welcome-thumbnail.png') // 🔹 Set your thumbnail image
            .setImage('https://example.com/welcome-banner.png') // 🔹 Optional banner image
            .setFooter({ text: `We now have ${member.guild.memberCount} members!` })
            .setTimestamp()
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) });

        channel.send({ embeds: [welcomeEmbed] });
    }
};
