const { EmbedBuilder, Events } = require('discord.js');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage, client) {
        try {
            if (oldMessage.author.bot) return;
            if (oldMessage.content === newMessage.content) return;

            const minikembed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('Mesaj Düzenlendi')
                .setDescription(`Eski Mesaj: \n > \`\`\`${oldMessage.content}\`\`\` \n Yeni Mesaj: \n > \`\`\`${newMessage.content}\`\`\` \n Kişi: \n > <@${oldMessage.author.id}> - (${oldMessage.author.id}) \n Mesaj id: ${oldMessage.id}`)
                .addFields(
                    { name: `Mesajı Düzenleyen: ${oldMessage.author.tag}`, value: `<@${oldMessage.author.id}>`, inline: true },
                    { name: `Kanal: ${oldMessage.channel.name}`, value: `${oldMessage.channel}`, inline: true }
                )
                .setThumbnail(oldMessage.guild.iconURL({ dynamic: true }))
                .setTimestamp();

            const editMesajLog = client.channels.cache.find(channel => channel.name === 'message_log');
            if (editMesajLog) {
                editMesajLog.send({ embeds: [minikembed] });
            } else {
                console.error('Log kanalı bulunamadı!');
            }
        } catch (error) {
            catchError(client, 'messageUpdate.js', error.message);
        }
    },
};
