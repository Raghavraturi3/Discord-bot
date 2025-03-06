const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const deletedLogFile = path.join(__dirname, '../../deleted.txt');
const editedLogFile = path.join(__dirname, '../../edit.txt');

module.exports = [
    {
        name: Events.MessageDelete,
        async execute(message) {
            if (!message.content || message.author.bot) return;

            const logMessage = `[${new Date().toLocaleString()}] ${message.author.tag}: "${message.content}"\n`;
            fs.appendFileSync(deletedLogFile, logMessage);
            console.log(`🗑️ Deleted message logged: ${message.content}`);
        },
    },
    {
        name: Events.MessageUpdate,
        async execute(oldMessage, newMessage) {
            if (!oldMessage.content || oldMessage.author.bot || oldMessage.content === newMessage.content) return;

            const logMessage = `[${new Date().toLocaleString()}] ${oldMessage.author.tag}: "${oldMessage.content}" → "${newMessage.content}"\n`;
            fs.appendFileSync(editedLogFile, logMessage);
            console.log(`✏️ Edited message logged: ${oldMessage.content} → ${newMessage.content}`);
        },
    }
];
