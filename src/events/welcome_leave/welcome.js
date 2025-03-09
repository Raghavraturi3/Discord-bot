const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        const channel = member.guild.systemChannel; // Change if needed
        if (!channel) return;

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00ff00') // Green color
            .setTitle(`👋 Welcome to Endless Void!`)
            .setDescription(`Hey ${member}, welcome to **Endless Void**! 🎉\nMake sure to check out the rules and have a great time!`)
            .setThumbnail('https://i.imgur.com/VB6ETtM.png') // Change thumbnail if needed
            .setImage('https://i.imgur.com/dfHytFL.jpg') // Change or remove background image
            .setFooter({ text: 'Endless Void Community', iconURL: member.guild.iconURL() })
            .setTimestamp()
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) });

        channel.send({ embeds: [welcomeEmbed] });
    });
};
