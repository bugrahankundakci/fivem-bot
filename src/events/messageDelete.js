const { EmbedBuilder, Events } = require('discord.js');
const { catchError } = require('../functions/hatamesajı');

module.exports = {
    name: Events.MessageDelete,
    async execute(message, client) {
        try {
            if (message.author.bot) return;
            if (message.channel.id) {
                const minikembed = new EmbedBuilder()
                 .setColor('#00ff00')
                 .setTitle('Mesaj Silindi')
                 .setDescription(`Mesaj: \n > \`\`\`${message.content}\`\`\` \n Kişi: \n > <@${message.author.id}> - (${message.author.id}) \n Mesaj id: ${message.id}`)
                 .addFields( 
                    { value: `Mesajı Silen: <@${message.author.id}>`, name: `Mesajı Silen: ${message.author.tag}`, inline: true},
                    { value: `kanal: ${message.channel}`, name: `kanal id: ${message.channel.id}`, inline: true }
                 )

                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setTimestamp()
                 const deletemesaj = client.channels.cache.find(channel => channel.name === 'message_log');
                 deletemesaj.send({ embeds: [minikembed]})
            }
        }
        catch (error) {
            catchError(client, 'messageDelete.js', error.message)
        }
    },
};
