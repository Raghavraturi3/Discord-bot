const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../deleted.txt');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (!message.content || message.author.bot) return;

        const logMessage = `[${new Date().toLocaleString()}] [DELETED] ${message.author.tag}: "${message.content}"\n`;
        fs.appendFileSync(logFilePath, logMessage);

        // Save the last deleted message in memory
        global.lastDeletedMessage = {
            author: message.author.tag,
            content: message.content,
            timestamp: new Date().toLocaleString(),
        };
    },
};
