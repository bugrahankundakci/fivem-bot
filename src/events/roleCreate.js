const { EmbedBuilder, Events } = require('discord.js');
const minik = require('../../minik.json');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
   name: Events.GuildRoleCreate,
    async execute(role, client) {
    try {
        if (minik.log.rolguncelleme) {
            const minikinrollogu = client.channels.cache.find(channel => channel.name === 'role_log');
            role.guild.fetchAuditLogs({ type: 30 }).then(audit => {
                 const minikkk = audit.entries.first();
                 const oc = minikkk.executor;
                 const roleCreateEmbed = new EmbedBuilder()
                .setColor('#00ff1a')
                .setTitle('Rol Oluşturuldu!')
                .setDescription(`Rol: \n >**${role.name}** - ${role.id} - <@&${role.id}> \n\n Kişi: \n >${oc.tag} - ${oc.id} - <@${oc.id}> `)
                .setThumbnail(role.guild.iconURL({ dynamic: true}))
                .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                .setTimestamp();
            if (minikinrollogu) {
                minikinrollogu.send({ embeds: [roleCreateEmbed] });
                    } else {
                             console.log('Role log kanalı bulunamadı.');
                      }
                  });
                }
                } 
           catch (error) {
              catchError(client,'roleCreate.js', error.message)
         }
     },
};
