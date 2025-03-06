const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../edit.txt');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (!oldMessage.content || oldMessage.author.bot || oldMessage.content === newMessage.content) return;

        const logMessage = `[${new Date().toLocaleString()}] [EDITED] ${oldMessage.author.tag}: "${oldMessage.content}" → "${newMessage.content}"\n`;
        fs.appendFileSync(logFilePath, logMessage);

        // Save the last edited message in memory
        global.lastEditedMessage = {
            author: oldMessage.author.tag,
            oldContent: oldMessage.content,
            newContent: newMessage.content,
            timestamp: new Date().toLocaleString(),
        };
    },
};
