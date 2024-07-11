const { ActivityType, Events, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, InteractionType } = require("discord.js");
const minik = require('../../minik.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} aktif!`);
        setPresence(client);
    },
};


function setPresence(client) {
    client.user.setPresence({
        activities: [
            {
                name: minik.botSettings.oynuyor,
                type: ActivityType.Competing,
            },
        ],
        status: minik.botSettings.durum,
    });
}
