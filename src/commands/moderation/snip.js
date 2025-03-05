const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../deleted.txt');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snip')
        .setDescription('Shows the last deleted or edited message'),
    async execute(interaction) {
        if (interaction.user.id !== process.env.USER_ID) {
            return interaction.reply({ content: '❌ You are not allowed to use this command.', ephemeral: true });
        }

        if (!fs.existsSync(logFilePath)) {
            return interaction.reply({ content: 'No deleted or edited messages found.', ephemeral: true });
        }

        const logs = fs.readFileSync(logFilePath, 'utf8').trim().split('\n');
        const lastDeleted = logs.reverse().find(line => line.startsWith('[DELETED]')) || 'No deleted messages found.';
        const lastEdited = logs.reverse().find(line => line.startsWith('[EDITED]')) || 'No edited messages found.';

        return interaction.reply({
            content: `📜 **Last Deleted Message:**\n${lastDeleted}\n\n✏️ **Last Edited Message:**\n${lastEdited}`
        });
    }
};
