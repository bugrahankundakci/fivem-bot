const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.GuildStickerUpdate,
    async execute(oldSticker, newSticker) {
        const guild = newSticker.guild;
        const logChannel = guild.channels.cache.find(channel => channel.name === 'sticker_log');

        if (!logChannel) {
            console.log('Log kanalı bulunamadı.');
            return;
        }

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.StickerUpdate
        });

        const stickerLog = fetchedLogs.entries.first();
        if (!stickerLog) return console.log('Sticker güncelleme logu bulunamadı.');

        const { executor } = stickerLog;

        const embed = new EmbedBuilder()
            .setColor('#ffff00')
            .setTitle('Sticker Güncellendi!')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setDescription(`
                **Kişi:**
                > <@${executor.id}> - ${executor.id}
                **Eski Sticker:**
                > ${oldSticker.name} - ID: ${oldSticker.id}
                **Yeni Sticker:**
                > ${newSticker.name} - ID: ${newSticker.id}
            `)
            .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(console.error);
    },
};
