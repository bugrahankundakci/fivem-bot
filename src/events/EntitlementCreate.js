const { EmbedBuilder, Events } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.EntitlementCreate,
    async execute(entitlement) {
        const guild = entitlement.guild;
        const logChannel = guild.channels.cache.find(channel => channel.name === 'minik_log');
        if (!logChannel) {
            console.log('Log kanalı bulunamadı.');
            return;
        }
        const executorName = `<@${entitlement.user.id}>`;
        const embed = createEmbed(executorName, guild.iconURL());
        logChannel.send({ embeds: [embed] }).catch(console.error);
    },
};

function createEmbed(executor, iconURL) {
    const embed = new EmbedBuilder()
        .setColor('#fff700')
        .setTitle('Üyelik Hakları Oluşturuldu')
        .setDescription(`
            **Kim Tarafından:**
            ${executor}
        `)
        .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
        .setTimestamp();
    return embed;
}