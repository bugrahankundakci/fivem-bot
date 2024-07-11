const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const minik = require('../../minik.json');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
   name: Events.ChannelCreate,
    async execute(channel, client){
        {
           const minikinchannellogkanali = client.channels.cache.find(channel => channel.name === 'channel_log');
            channel.guild.fetchAuditLogs({type: AuditLogEvent.ChannelCreate}).then(audit => {
                const oc = audit.entries.first();
                const minikinchannellogembedi = new EmbedBuilder()
                    .setColor('#00ff1a')
                    .setTitle('Kanal Oluşturuldu!')
                    .setDescription(`Kişi:\n > <@${oc.executor.id}> - (${oc.executor.id})\n Kanal: \n > **${channel.name}** - ${channel.id} - <#${channel.id}>`)
                    .setThumbnail(channel.guild.iconURL({ dynamic: true }))
                    .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                    .setTimestamp();
                if (minikinchannellogkanali) {
                    minikinchannellogkanali.send({ embeds: [minikinchannellogembedi] });
                }
                else {
                    console.log('Channel log kanalı bulunamadı.');
                }
            });
        }
    },
};


/*

client.on("messageCreate", async (message) => {
  if (!message.guild) {
    console.log(`Bana birisi DM gönderdi => ${message.content}`);
    // Burada 1258527868636495912 ID'li sunucunuzdaki kişilere mesaj gönderme kodunu ekleyebilirsiniz.
  }
});

*/