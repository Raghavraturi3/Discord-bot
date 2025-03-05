const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snip')
        .setDescription('Shows the last deleted and edited message from this channel'),
    async execute(interaction) {
        let deletedMessage = global.lastDeletedMessage
            ? `**Last Deleted Message:**\n**${global.lastDeletedMessage.author.tag}**: ${global.lastDeletedMessage.content}`
            : 'No deleted messages found.';

        let editedMessage = global.lastEditedMessage
            ? `**Last Edited Message:**\n**${global.lastEditedMessage.author}**: ${global.lastEditedMessage.oldContent} → ${global.lastEditedMessage.newContent}`
            : 'No edited messages found.';

        await interaction.reply({ content: `${deletedMessage}\n\n${editedMessage}`, ephemeral: false });
    },
};
