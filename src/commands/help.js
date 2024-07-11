const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('genel yetkili komutu işte ne bekliyorsun'),
    async execute(interaction) {
     const helpembed = new EmbedBuilder()
     .setColor('#00ff00')
     .setTitle(minik.server.serverismi)
     .addFields(
        { name: 'aktif', value: 'Server\'e **aktif** duyurusu geçer.', inline: false },
        { name: 'bakım', value: 'Server\'e **bakım** duyurusu geçer.', inline: false},
        { name: 'restart', value: 'Server\'e **restart** duyurusu geçer.', inline: false },
        { name: 'ip', value: 'Server ip bilgilerini alırsınız.', inline: false },
        { name: 'rol', value: 'User\'lara rol ver / al işlemlerini gerçekleştirirsiniz.', inline: false }, 
        { name: 'whitelist', value: 'Whitelist rolü ver / al işlemlerini gerçekleştirirsiniz.', inline: false}, 
        { name: 'yasaklama', value: 'Server içerisinden yasaklama işlemlerini gerçekleştirirsiniz', inline: false},
        { name: 'rolbilgi', value: 'Rolesahip olan kişileri görürsünüz.', inline: false },
        { name: 'isim', value: 'Kişinin ismini değiştirisiniz.', inline: false },
        { name: 'sil', value: 'Mesajları silersiniz eğer sayı belirtmezseniz random siler.', inline: false },
        { name: 'toplurol', value: 'Toplu bir şekilde rol verir.', inline: false },
        { name: 'whitelist', value: 'Tekli veya toplu whitelist verirsiniz.', inline: false },
        )
        .setImage(minik.reklam.embedphoto)
     .setTimestamp();
     await interaction.reply({ content: 'Server için kullanılabilir komutlar.', embeds: [helpembed], ephemeral: true});
       }, 
};