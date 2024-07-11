const { EmbedBuilder, Events } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    nam: Events.PresenceUpdate,
    async execute(oldPresence, newPresence) {
        if (oldPresence && newPresence && oldPresence.status !== newPresence.status) {
            const embed = new EmbedBuilder()
                .setTitle('Durum Güncellemesi')
                .setDescription(`${newPresence.member.displayName} kullanıcısının durumu güncellendi: ${oldPresence.status} -> ${newPresence.status}`)
                .setColor('#ff0000')
                .setThumbnail(newPresence.member.guild.iconURL({ dynamic: true}))
                .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                .setTimestamp();
            const logChannel = newPresence.guild.channels.cache.find(channel => channel.name === 'minik');
            if (logChannel) {
                logChannel.send({ embeds: [embed] });
            } else {
                console.error('Log kanalı bulunamadı!');
            }
        }
    }
}
