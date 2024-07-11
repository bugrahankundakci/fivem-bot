const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');
const { catchError } = require('../functions/hatamesajı');
const minik = require('../../minik.json');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember, client) {
        try {
            {
                oldMember.guild.fetchAuditLogs({ type: AuditLogEvent.GuildMemberUpdate }).then(audit => {
                    const minikkk = audit.entries.first();
                    const guild = newMember.guild;
                    const yetkili = minikkk.executor;
                    const eski = oldMember.user;
                    const eskiRoller = oldMember.roles.cache;
                    const yeniRoller = newMember.roles.cache;
                    const eklenenRoller = yeniRoller.filter(role => !eskiRoller.has(role.id));
                    const cikarilanRoller = eskiRoller.filter(role => !yeniRoller.has(role.id));
                    const minikinembedodasi = client.channels.cache.find(channel => channel.name === 'user_update_log');
                    let baslik = '';
                    let aciklama = '';

                    if (oldMember.nickname !== newMember.nickname) {
                        baslik = 'Üye Güncellendi!';
                        aciklama = `**Üyenin eski ismi:** ${oldMember.nickname}\n**Üyenin yeni ismi:** ${newMember.nickname}`;
                    } else if (eklenenRoller.size > 0 || cikarilanRoller.size > 0) {
                        baslik = 'Üye Rolü Güncellendi!';
                        aciklama = `\n ${eklenenRoller.size > 0 ? '**Rol Bilgileri:**\n' + eklenenRoller.map(role => ` <@&${role.id}> (${role.id}) \n Renk: ${role.color ? role.hexColor : 'Belirtilmedi'} | Roldeki Kişi Sayısı: ${role.members.size}`).join('\n') : ''}\n${cikarilanRoller.size > 0 ? '**Rol Bilgileri:**\n' + cikarilanRoller.map(role => ` <@&${role.id}> (ID: ${role.id}) \n Renk: ${role.color ? role.hexColor : 'Belirtilmedi'} | Roldeki Kişi Sayısı: ${role.members.size} \n`).join('\n') : ''}`;
                    }
                    const minikinuyeguncellemeembedi = new EmbedBuilder()
                        .setColor('#2d5eff')
                       // .setTitle('Üye Güncellendi')
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .setDescription(`**Üyenin bilgileri:** \n ${oldMember} - (${eski.id})\n ${aciklama}\n> Yetkili: <@${yetkili.id}> - ${yetkili.id}`)
                        .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                        .setTimestamp();
                    if (minikinembedodasi) {
                        minikinembedodasi.send({ content: `${baslik}.`, embeds: [minikinuyeguncellemeembedi] });
                    }
                })
            }
        } catch (error) {
            catchError(client, 'guildmemberupdate.js', error.message)
        }
    },
};
