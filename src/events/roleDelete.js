const { EmbedBuilder, Events } = require('discord.js');
const minik = require('../../minik.json');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
    name: Events.GuildRoleDelete,
    async execute(role, client) {
        try {
            if (minik.log.rolsilme) {
                const minikinrolsilmelogodasi = client.channels.cache.find(channel => channel.name === 'role_log');
                role.guild.fetchAuditLogs({ type: 32 }).then(audit => {
                    const minikkkk = audit.entries.first();
                    const minis = minikkkk.executor;
                    const minikinrolsilmeembedi = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Rol Silindi')
                    .setDescription(`Rol: \n >**${role.name}** - ${role.id} \n\n Kişi: \n >${minis.tag} - ${minis.id} - <@${minis.id}>`)
                    .setThumbnail(role.guild.iconURL({ dynamic: true}))
                    .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                    .setTimestamp();
                    if (minikinrolsilmelogodasi) {
                    minikinrolsilmelogodasi.send({ embeds: [minikinrolsilmeembedi] })
                }
                })
            }
        }
        catch (error) {
            catchError(client, 'roleDelete.js', error.message)
        }
    }
}