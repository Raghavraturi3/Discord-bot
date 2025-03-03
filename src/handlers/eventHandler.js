const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const eventFolders = fs.readdirSync(path.join(__dirname, '../events'));

    for (const folder of eventFolders) {
        const eventFiles = fs.readdirSync(path.join(__dirname, `../events/${folder}`)).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            if (event.name && typeof event.execute === 'function') {
                client.on(event.name, (...args) => event.execute(...args, client));
            } else {
                console.error(`❌ Skipping invalid event file: ${file}`);
            }
        }
    }
};
