const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../deleted.txt');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (!message.content || message.author.bot) return;

        const logMessage = `[DELETED] ${message.author.tag}: ${message.content}\n`;

        // Store only if running with nodemon
        if (process.env.npm_lifecycle_event === 'nodemon') {
            fs.appendFileSync(logFilePath, logMessage);
        }

        // Save the last deleted message in memory
        global.lastDeletedMessage = message;
    },
};
