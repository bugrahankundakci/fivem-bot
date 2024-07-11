const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.GuildStickerCreate,
    async execute(sticker) {
        const guild = sticker.guild;
        const logChannel = guild.channels.cache.find(channel => channel.name === 'sticker_log');

        if (!logChannel) {
            console.log('Log kanalı bulunamadı.');
            return;
        }

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.StickerCreate
        });

        const stickerLog = fetchedLogs.entries.first();
        if (!stickerLog) return console.log('Sticker oluşturma logu bulunamadı.');

        const { executor } = stickerLog;

        const embed = new EmbedBuilder()
            .setColor('#00ff1a')
            .setTitle('Sticker Oluşturuldu!')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setDescription(`
                **Oluşturan Kişi:**
                <@${executor.id}> - ${executor.id}
                **Oluşturulan Sticker:**
                > ${sticker.name} - ID: ${sticker.id}
            `)
            .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(console.error);
    },
};
