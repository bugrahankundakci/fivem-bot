const { EmbedBuilder } = require('discord.js');
const minik = require('../../minik.json');

function useCmd(client, commandName, interaction) {
    const minikinlogu = client.channels.cache.get(minik.log.komut);
    const minikinembedi = new EmbedBuilder()
        .setColor('#00ff2f')
        .setTitle('Komut Kullanıldı')
        .setDescription(`Kişi: ${interaction.member.id}\nKomut adı: \`${commandName}\``);

    minikinlogu.send({ embeds: [minikinembedi] })
        .catch(err => console.error('Komut logu atılırken bir hata oluştu!', err));
}

module.exports = { useCmd };