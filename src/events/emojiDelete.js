const { EmbedBuilder, AuditLogEvent, Events } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.GuildEmojiDelete,
    async execute(emoji) {
        const guild = emoji.guild;
        const logChannel = guild.channels.cache.find(channel => channel.name === 'emoji_log');

        if (!logChannel) {
            console.log('Log kanalı bulunamadı.');
            return;
        }

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiDelete
        });

        const emojiLog = fetchedLogs.entries.first();

        const { executor } = emojiLog;

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Emoji Silindi!')
            .setThumbnail(emoji.guild.iconURL({ dynamic: true }))
            .setDescription(`Kişi: \n > <@${executor.id}> - ${executor.id} \n Emoji Bilgileri: \n > **${emoji.name}** - ${emoji.id}`)
            .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
            .setTimestamp();
        logChannel.send({ embeds: [embed] }).catch(console.error);
    },
};
