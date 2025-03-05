const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../deleted.txt');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (!message.content || message.author.bot) return;

        const logMessage = `[DELETED] ${message.author.tag}: ${message.content}\n`;
        fs.appendFileSync(logFilePath, logMessage);
    },
};

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (!oldMessage.content || oldMessage.author.bot || oldMessage.content === newMessage.content) return;

        const logMessage = `[EDITED] ${oldMessage.author.tag}: ${oldMessage.content} -> ${newMessage.content}\n`;
        fs.appendFileSync(logFilePath, logMessage);
    },
};
