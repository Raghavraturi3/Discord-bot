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

        // Check if file exists
        if (!file) {
            return interaction.reply({ content: '❌ Please attach a file!', ephemeral: true });
        }

        const attachment = new AttachmentBuilder(file.url);

        // If message ID is provided, reply to that message
        if (messageId) {
            try {
                const targetMessage = await interaction.channel.messages.fetch(messageId);
                
                // Check if the interaction has already replied
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ content: '✅ File sent as a reply!', ephemeral: true });
                } else {
                    await interaction.reply({ content: '✅ File sent as a reply!', ephemeral: true });
                }

                await targetMessage.reply({ files: [attachment] });
            } catch (error) {
                return interaction.reply({ content: '❌ Invalid message ID or message not found.', ephemeral: true });
            }
        } else {
            // If no message ID, send the file normally
            await interaction.reply({ files: [attachment] });
        }
    }
};
