const { EmbedBuilder } = require('@discordjs/builders');
const minik = require('../../minik.json');

function catchError(client, commandName, errorMessage) {
    const log = client.channels.cache.get(minik.kanal.hatakanali);
    if (!log) {
        console.error('Hata kanalı bulunamadı');
        return;
    }

    const allahembed = new EmbedBuilder()
        .setTitle('Hata Bulundu!')
        .setDescription(`Dosya Adı: **${commandName}**\nHata Mesajı: \`\`\`${errorMessage}\`\`\``);

    log.send({ embeds: [allahembed] })
        .catch((err) => console.error('Hata mesajı gönderirken bir hata meydana geldi', err));
}

module.exports = { catchError };