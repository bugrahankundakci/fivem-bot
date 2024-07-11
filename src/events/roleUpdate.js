const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const minik = require('../../minik.json');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
    name: Events.GuildRoleUpdate,
    async execute(oldRole, newRole, client) {
        try {
            if (minik.log.rolguncelleme) {
                const minikinguncelrolu = client.channels.cache.find(channel => channel.name === 'role_log');
                oldRole.guild.fetchAuditLogs({ type: AuditLogEvent.RoleUpdate }).then(audit => {
                    const minikinallahiyok = audit.entries.first();
                    const minis = minikinallahiyok.executor;
                    if (oldRole.id === minikinallahiyok.target.id || newRole.id === minikinallahiyok.target.id) {
                        const minikinrolguncellemeembedi = new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('Rol Güncellendi')
                            .setDescription(`Eski Rol bilgileri: \n > **${oldRole.name}** - ${oldRole.id} - <@&${oldRole.id}> \nYeni rol bilgileri: \n >**${newRole.name}** - ${newRole.id} - <@&${newRole.id}> \n\n Kişi: ${minis.tag} - ${minis.id} - <@${minis.id}> `)
                            .setThumbnail(newRole.guild.iconURL({ dynamic: true}))
                            .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                            .setTimestamp();
                        if (minikinguncelrolu) {
                            minikinguncelrolu.send({ embeds: [minikinrolguncellemeembedi]});
                        }
                    }
                });
            }
        }
        catch (error) {
            catchError(client, 'roleUpdate.js', error.message);
        }
    }
};
