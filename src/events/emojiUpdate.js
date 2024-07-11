const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.GuildEmojiUpdate,
    async execute(oldEmoji, newEmoji) {
        const guild = newEmoji.guild;
        const logChannel = guild.channels.cache.find(channel => channel.name === 'emoji_log');

        if (!logChannel) {
            console.log('Log kanalı bulunamadı.');
            return;
        }

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiUpdate
        });

        const emojiLog = fetchedLogs.entries.first();
        const { executor } = emojiLog;

        const minikemojiupdate = new EmbedBuilder()
            .setColor('#ffff00')
            .setTitle('Emoji Güncellendi!')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setDescription(`
                **Yetkili:**
                <@${executor.id}> - ${executor.id}

                **Emoji:**
                <:${oldEmoji.name}:${oldEmoji.id}>

                **Eski Isım:**
                > ${oldEmoji.name} - (${oldEmoji.id})
                **Yeni Isım**
                > ${newEmoji.name} - (${newEmoji.id})
            `)
            .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
            .setTimestamp();
        logChannel.send({ embeds: [minikemojiupdate] }).catch(console.error);
    },
};