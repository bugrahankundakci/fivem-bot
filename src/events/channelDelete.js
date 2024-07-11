const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const minik = require('../../minik.json');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
   name: Events.ChannelDelete,
    async execute(channel, client) {
            if (client) {
            const minikinchannellogkanali = client.channels.cache.find(channel => channel.name === 'channel_log');
            if (!minikinchannellogkanali) {
                const minikinKullanici = await client.users.fetch(minik.reklam.minikdcid);
                if (minikinKullanici) {
                    minikinKullanici.send("Kanalı bulamadım.");
                }
                return;
            }
            channel.guild.fetchAuditLogs({type: AuditLogEvent.ChannelDelete }).then(audit => {
                const oc = audit.entries.first();
                const minikinchannellogembedi = new EmbedBuilder()
                .setColor('#00ff1a')
                .setTitle('Kanal Silindi!')
                .setDescription(`Kişi:\n > <@${oc.executor.id}> - (${oc.executor.id}) \n\n Kanal: \n > **${channel.name}** - ${channel.id} - <#${channel.id}>`) 
                .setThumbnail(channel.guild.iconURL({ dynamic: true }))
                .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                .setTimestamp();
                try {
                    if (minikinchannellogkanali) {
                        minikinchannellogkanali.send({ embeds: [minikinchannellogembedi] });
                    }
                }catch (error) {
                    catchError(client, 'channelDelete.js', error.message)
               }
           })
        }
    }
}
