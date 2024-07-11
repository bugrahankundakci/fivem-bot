const fs = require('fs');

module.exports = (client) => {
    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => {
                console.log(`Yüklendi: ${event.name}`);
                event.execute(...args, client);
            });
        } else {
            client.on(event.name, (...args) => {
                console.log(`Yüklendi: ${event.name}`);
                event.execute(...args, client);
            });
        }
    }
};
