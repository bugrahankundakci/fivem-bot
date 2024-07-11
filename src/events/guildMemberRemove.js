const { EmbedBuilder, Events } = require('discord.js');
const minik = require('../../minik.json');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member, client) {
    try {
        {
            const minikingelengideni = client.channels.cache.find(channel => channel.name === 'invite_log');
            const minikingelengidenembedi = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(`Sunucudan Üye Çıktı!`)
            .setDescription(`Kişi: \n > ${member.user.username} \n > <@${member.user.id}> - (${member.user.id}) `)
            .setThumbnail(member.guild.iconURL({ dynamic: true }))
            .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
            .setTimestamp();
            if (minikingelengideni) {
                minikingelengideni.send({ embeds: [minikingelengidenembedi] });
            }
            else {
                console.log('Yarragım guildMemberRemove\'da sıkıntı var');
            }
         }
    } catch (error) {
        catchError(error,'guildMemberRemove', client);
    }
    },
};

/*
        const invites = await member.guild.invites.fetch();
        const inviter = invites.find(invite => invite && invite.inviter && invite.inviter.id === member.id);

        if (inviter) {
            const inviterMember = member.guild.members.cache.get(inviter.inviter.id);

            const quitEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle(`Sunucumuzdan Çıktı, ${member.user.username}!`)
                .setTimestamp()
                .addFields( 
                    { name: member.user, value: member.user.id, inline: true},
                    { name: inviterMember.user.id, value: 'tarafından davet edildi', inline: true}
                )
                .setDescription();
            const channel = client.channels.cache.get(minik.log.invite);
            if (channel) { 
                channel.send({embeds: [quitEmbed] });
            } else {
                console.error(`Quit mesajları için belirtilen kanal bulunamadı: ${minik.log.invite}`);
            }
        } else {
            console.error('Davetçi bulunamadı.');
        }

        try {
            const inviteLogChannel = member.guild.channels.cache.get(minik.log.invite);
            if (!inviteLogChannel) { 
                console.error('Log kanalı bulunamadı veya bir metin kanalı değil.');
                return;
            } 
            if (inviteLogChannel) {
                // Davet log kanalı ile ilgili işlemler buraya gelebilir.
            } else {
                console.error('Davet log kanalı bulunamadı.');
            }
        } catch (error) {
            catchError(client, error.message);
        }
*/
