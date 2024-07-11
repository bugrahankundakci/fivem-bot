const { EmbedBuilder, Events } = require('discord.js');
const minik = require('../../minik.json');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client) {
        if (minik.rol.kayıtsız) {
            try {
                const role = member.guild.roles.cache.get(minik.rol.kayıtsız);
                if (role) {
                    await member.roles.add(role);
                }
                const otorolchannel = client.channels.cache.find(channel => channel.name === 'role_log');
                const otorolembed = new EmbedBuilder()
                    .setColor('#00ff1a')
                    .setTitle('Otorol İşlemi')
                    .addFields(
                        { name: 'Rolü veren ', value: `${client.user}`, inline: true },
                        { name: 'Kullanıcı', value: `${member}`, inline: true},
                        { name: 'Rol', value: `<@&${minik.rol.kayıtsız}>`, inline: true}
                 )
                 .setThumbnail(member.guild.iconURL({ dynamic: true }))
                 .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                 .setTimestamp();

                 const minikingelengideni = client.channels.cache.find(channel => channel.name === 'invite_log');
                 const minikingelengidenembedi = new EmbedBuilder()
                 .setColor('#07ff73')
                 .setTitle(`Sunucuya Üye Katıldı!`)
                 .setDescription(`Kişi: \n > ${member.user.username} \n > <@${member.user.id}> - (${member.user.id}) `)
                 .setThumbnail(member.guild.iconURL({ dynamic: true }))
                 .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                 .setTimestamp();
                 if (minikingelengideni) {
                     minikingelengideni.send({ embeds: [minikingelengidenembedi] });
                 }
                 else {
                     console.log('Yarragım guildMemberAdd\'da sıkıntı var');
                 }


                 const minikinduyurukanali = client.channels.cache.get(minik.kanal.duyurular);
                 const minikinruleskanali = client.channels.cache.get(minik.kanal.kurallar);
                 if (minikinduyurukanali) {
                     const message = await minikinduyurukanali.send({ content: `${member}` });
                     setTimeout(() => {
                         message.delete();
                     }, 2000);
                 }
                 if (minikinruleskanali) {
                     const message = await minikinruleskanali.send({ content: `${member}` });
                     setTimeout(() => {
                         message.delete();
                     }, 2000);
                 } else {
                     console.log('guildMemberAdd\'da bir sorun oluştu.');
                 }
                 














                if (otorolchannel) {
                    otorolchannel.send({ embeds: [otorolembed] });
                }
                else {
                    console.log('Oto rol bulunamadı.');
                }
            } catch (error) {
                catchError(client, error.message)
            }
        }
    },
};
