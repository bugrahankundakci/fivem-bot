const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const { catchError } = require('../functions/hatamesajı');
const minik = require('../../minik.json');

module.exports = {
    name: Events.InviteUpdate,
    async execute(oldInvite, newInvite, client) {
        const guild = newInvite.guild;
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.InviteUpdate,
        });

        const updateLog = fetchedLogs.entries.first();
        if (!updateLog) return;

        const { target, executor } = updateLog;

        const oldLink = oldInvite.url;
        const newLink = newInvite.url;
        const executorTag = executor ? executor.tag : 'Bilinmiyor';

        const channel = client.channels.cache.find(channel => channel.name === 'invite_log');
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Davet Güncellendi')
                .setDescription(`Eski Davet Linki: ${oldLink}\nYeni Davet Linki: ${newLink}\nGüncelleyen Kişi: ${executorTag}`)
                .setTimestamp();
            channel.send({ embeds: [embed] });
        } else {
            console.log('Log kanalı bulunamadı.');
            catchError(client, 'inviteUpdate.js', 'Log kanalı bulunamadı.');
        }
    },
};
