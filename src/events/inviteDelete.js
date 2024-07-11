const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const { catchError } = require('../functions/hatamesajı');
const minik = require('../../minik.json');

module.exports = {
    name: Events.InviteDelete,
    async execute(invite, client) {
        const guild = invite.guild;
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.InviteDelete
        });
        const deletionLog = fetchedLogs.entries.first();
        if (!deletionLog) return;
        const { target, executor } = deletionLog;
        const inviteLink = target ? target.url : 'Davet bağlantısı bulunamadı.';
        const executorTag = executor ? executor.tag : 'Bilinmiyor';

        const channel = client.channels.cache.find(channel => channel.name === 'invite_log');
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Davet Silindi')
                .setDescription(`Davet linki: ${inviteLink}\nSilinen kişi: ${executorTag}`)
                .setTimestamp();
            channel.send({ embeds: [embed] });
        } else {
            console.log('Log kanalı bulunamadı.');
            catchError(client, 'inviteDelete.js', 'Log kanalı bulunamadı.');
        }
    },
};
