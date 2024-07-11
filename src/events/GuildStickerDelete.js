const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.GuildStickerDelete,
    async execute(sticker) {
        const guild = sticker.guild;
        const logChannel = guild.channels.cache.find(channel => channel.name === 'sticker_log');

        if (!logChannel) {
            console.log('Log kanalı bulunamadı.');
            return;
        }

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.StickerDelete
        });

        const stickerLog = fetchedLogs.entries.first();
        if (!stickerLog) return console.log('Sticker silme logu bulunamadı.');

        const { executor } = stickerLog;

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Sticker Silindi!')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setDescription(`
                **Silen Kişi:**
                <@${executor.id}> - ${executor.id}
                **Silinen Sticker:**
                > ${sticker.name} - ID: ${sticker.id}
            `)
            .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(console.error);
    },
};
