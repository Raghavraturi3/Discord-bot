const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echofile')
        .setDescription('Echoes an attached file and optionally replies to a message')
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('The file to send')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The message ID to reply to (optional)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const file = interaction.options.getAttachment('file');
        const messageId = interaction.options.getString('message_id');

        if (!file) {
            return interaction.reply({ content: '❌ Please attach a file!', ephemeral: true });
        }

        const attachment = new AttachmentBuilder(file.url);

        // If message ID is provided, reply to that message
        if (messageId) {
            try {
                const targetMessage = await interaction.channel.messages.fetch(messageId);
                await targetMessage.reply({ files: [attachment] });
                return interaction.reply({ content: '✅ File sent as a reply!', ephemeral: true });
            } catch (error) {
                return interaction.reply({ content: '❌ Invalid message ID or message not found.', ephemeral: true });
            }
        }

        // If no message ID, just send the file normally
        await interaction.reply({ files: [attachment] });
    }
};
