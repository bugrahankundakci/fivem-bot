const { EmbedBuilder, AuditLogEvent, Events } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.GuildEmojiCreate,
    async execute(emoji) {
        const guild = emoji.guild;
        const logChannel = guild.channels.cache.find(channel => channel.name === 'emoji_log');

        if (!logChannel) {
            console.log('Log kanalı bulunamadı.');
            return;
        }

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiCreate
        });

        const emojiLog = fetchedLogs.entries.first();

        const { executor, target } = emojiLog;

        const embed = new EmbedBuilder()
            .setColor('#00ff1a')
            .setTitle('Emoji Oluşturuldu')
            .setThumbnail(emoji.guild.iconURL({ dynamic: true }))
            .setDescription(`Kişi: \n > <@${executor.id}> - ${executor.id} \n Emoji Bilgileri: \n > **${target.name}** - ${target.id}`)
            .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
            .setTimestamp();
        logChannel.send({ embeds: [embed] }).catch(console.error);
    },
};
