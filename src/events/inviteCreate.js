const { EmbedBuilder, Events } = require('discord.js');
const { catchError } = require('../functions/hatamesajı');
const minik = require('../../minik.json');

module.exports = {
    name: Events.InviteCreate,
    async execute(invite, client) {
        async function getInviteLink(guild) {
            try {
                const invites = await guild.invites.fetch();
                const foundInvite = invites.find(inv => inv.code === invite.code);
                return foundInvite ? foundInvite.url : 'Davet bağlantısı bulunamadı.';
            } catch (error) {
                console.error('Davet bağlantısı alınamadı:', error);
                catchError(client, error.message)
                return 'Davet bağlantısı bulunamadı.';
            }
        }
        const channel = client.channels.cache.find(channel => channel.name === 'invite_log');
        const guild = invite.guild;
        const inviter = await client.users.fetch(invite.inviter.id);
        const inviteLink = await getInviteLink(guild);
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Yeni Davet Oluşturuldu')
                .setDescription(`**Kişi:** \n > <@${inviter.id}> -  (${inviter.id})\n **İnvite:**\n > ${inviteLink}`)
                .setThumbnail(channel.guild.iconURL({ dynamic: true }))
                .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                .setTimestamp();
            channel.send({ embeds: [embed] });
        } else {
            console.log('Log kanalı veya davet oluşturan bulunamadı.');
            catchError(client, 'inviteCreate.js', error.message);
        }
    },
};