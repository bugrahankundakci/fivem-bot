const { EmbedBuilder, ButtonBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');
// { kayitsizrolu, klausname, cfxLink, klauslink, whitelist, serverdisplayname }
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Sunucu bilgilerini gönderir.'),
    async execute(interaction) {
        try {
            const channel = interaction.channel;
            if (channel) {
                const user = interaction.user;
                const klausyetkilirolidleri = minik.yetkili.aktifmaktif;
                const userAvatarURL = user.displayAvatarURL({ format: 'png', dynamic: true });
                if (interaction.member && interaction.member.roles.cache.some(role => klausyetkilirolidleri.includes(role.id))) {
                    const klausembed = new EmbedBuilder()
                        .setColor('#3498db') 
                        .setThumbnail(userAvatarURL)
                        .setTitle('Butonlara Tıklayarak Suncuya katılabilirsiniz')
                        .setFields(
                            { name: `${minik.server.serverismi}`, value: `**sunucusuna özel yapılmıştır.**`, inline: false}
                        )
                        .setTimestamp();
                    const klausbutton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('Sunucuya Katıl!')
                            .setStyle(ButtonStyle.Link)
                            .setURL(minik.server.cfxlink),
                     /*
                         new ButtonBuilder()
                            .setLabel('Ts\'ye katıl')
                            .setStyle(ButtonStyle.Success)
                            .setCustomId('tsye_katil'),
                     */
                        new ButtonBuilder()
                             .setLabel('Minik Development')
                             .setStyle(ButtonStyle.Link)
                             .setURL(minik.reklam.minikprofillink)
                    );

                    await interaction.reply({ content: '# SERVER BILGILERI', embeds: [klausembed], components: [klausbutton], ephemeral: true });
                    const filter = i => i.customId === 'tsye_katil' && i.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 2000 });

                    collector.on('collect', async i => {
                        await i.reply({ content: 'TS YOK Sunucumuz VoiceChat\'tir', ephemeral: true });
                    });

                    collector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.followUp({ content: 'TS YOK Sunucumuz VoiceChat\'tir', ephemeral: true });
                        }
                    });
                } else {
                    await interaction.reply({ content: `<@${minik.rol.kayıtsız}> rolü olanlar kullanamaz`, ephemeral: true });
                }
            }
        } catch (error) {
            console.error('Hata oluştu:', error);
        }
    },
};
