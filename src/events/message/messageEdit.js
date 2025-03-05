const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../deleted.txt');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (!oldMessage.content || oldMessage.author.bot || oldMessage.content === newMessage.content) return;

        const logMessage = `[EDITED] ${oldMessage.author.tag}: ${oldMessage.content} -> ${newMessage.content}\n`;

        // Store only if running with nodemon
        if (process.env.npm_lifecycle_event === 'nodemon') {
            fs.appendFileSync(logFilePath, logMessage);
        }

        // Save the last edited message in memory
        global.lastEditedMessage = { oldContent: oldMessage.content, newContent: newMessage.content, author: oldMessage.author.tag };
    },
};
