const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('isim')
        .setDescription('Belirttiğiniz kullanıcının ismini değiştirir.')
        .addUserOption(option => 
            option.setName('kullanici')
            .setDescription('İsmi değiştirilecek kullanıcıyı seçin')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('isim')
            .setDescription('Kişinin ismi ne olacak?')
            .setRequired(true)),
    async execute(interaction) {
        const minikinkullanicisi = interaction.options.getMember('kullanici');
        const minikinismi = interaction.options.getString('isim');
        if (!minikinkullanicisi || !minikinismi) {
            return await interaction.reply({ content: `Bir kullanıcı ve isim seçmelisiniz.`, ephemeral: true});
        }
        try {
            await minikinkullanicisi.setNickname(minikinismi)
            await interaction.reply({ content: `${minikinkullanicisi.user.tag} isimli kullanıcının ismi ${minikinismi} olarak değiştirildi.`, ephemeral: true });
            const minikinlogu = interaction.client.channels.cache.find(channel => channel.name === 'nick_log');
            const minikinisimdeistirmeembedi = new EmbedBuilder()
                .setColor('#000000')
                .setTitle(`İsim Değiştirildi!`)
                .setDescription(`Yetkili: \n > <@${interaction.user.id}> - (${interaction.user.id})\n Kişi: \n > <@${minikinkullanicisi.user.id}> - (${minikinkullanicisi.user.id})\n Olay: \n > kullanıcısının ismini **${minikinismi}** olarak değiştirdi.`);
            await minikinlogu.send({ content: `İsim değiştirildi!`, embeds: [minikinisimdeistirmeembedi]});
        }
        catch (error) {
            console.error('İsim değiştirme işlemi sırasında bir hata oluştu:', error);
            await interaction.followUp({ content: `İsim değiştirme işlemi sırasında bir hata oluştu.`, ephemeral: true});
        }
    },
};