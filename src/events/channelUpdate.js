const { EmbedBuilder, Events, AuditLogEvent} = require('discord.js');
const minik = require('../../minik.json');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel, client) {
    try {
        const minikinupdatelogu = client.channels.cache.find(channel => channel.name === 'channel_log');
    newChannel.guild.fetchAuditLogs( { type: AuditLogEvent.ChannelUpdate }).then(audit => {
    const minikoc = audit.entries.first();
    const minikinupdateembedi = new EmbedBuilder()
    .setColor('#000000')
    .setTitle('Kanal Güncellendi!')
    .setDescription(`kişi: \n <@${minikoc.executor.id}> - (${minikoc.executor.id})\n Eski Kanal: \n > <#${oldChannel.id}> - ${oldChannel.name} \n Yeni Kanal: \n > <#${newChannel.id}> - ${newChannel.name} `)
    .setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
    .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
    .setTimestamp();
    if (minikinupdatelogu) {
        minikinupdatelogu.send({ embeds: [minikinupdateembedi] });
    }
    });
    }catch (error) {
        catchError(client, 'channelUpdate.js', error.message)
    }
    }
}