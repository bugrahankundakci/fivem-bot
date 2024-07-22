const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Sunucu durumunu günceller.')
        .addStringOption(option => 
            option.setName('durum')
                .setDescription('Sunucu durumu')
                .setRequired(true)
                .addChoices(
                    { name: 'Aktif', value: 'aktif' },
                    { name: 'Bakım', value: 'bakım' },
                    { name: 'Restart', value: 'restart' }
                )),
    async execute(interaction) {
        const status = interaction.options.getString('durum');
        const channel = interaction.channel;
        const user = interaction.user;
        const userAvatarURL = user.displayAvatarURL({ format: 'png', dynamic: true });
        const allowedRoleIDs = minik.yetkili.aktifmaktif;
        const hasAllowedRole = interaction.member.roles.cache.some(role => allowedRoleIDs.includes(role.id));

        if (!hasAllowedRole) {
            return interaction.reply({ content: 'Yetkiniz yok.', ephemeral: true });
        }

        let embed, components;
        switch (status) {
            case 'aktif':
                embed = new EmbedBuilder()
                    .setColor('#10ff00')
                    .setTitle(minik.server.serverismi)
                    .addFields(
                        { name: 'Sunucu aktif!', value: 'Giriş sağlayabilirsiniz.', inline: false },
                        { name: 'Server IP', value: minik.server.ip, inline: true },
                        { name: 'Teamspeak IP', value: minik.server.tsip, inline: true }
                    )
                    .setThumbnail(userAvatarURL)
                    .setImage(minik.server.aktiftasarim)
                    .setTimestamp();
                components = [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('Sunucuya Katıl!')
                            .setStyle(ButtonStyle.Link)
                            .setURL(minik.server.cfxlink)
                    ),
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel(minik.server.tsip)
                            .setStyle(ButtonStyle.Success)
                            .setCustomId('tsye_katil')
                    ),
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('For Development')
                            .setStyle(ButtonStyle.Link)
                            .setURL(minik.reklam.minikprofillink)
                    )
                ];
                break;
            case 'bakım':
                embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(minik.server.serverismi)
                    .addFields(
                        { name: '**SUNUCU BAKIMDA!**', value: 'Cache\'i temizleyip fps\'inizi düzenliyoruz.', inline: false },
                        { name: 'Optimizazsyon ve Yenilikler', value: `<@${minik.reklam.minikdcid}> tarafından yapılıyor!`, inline: false },
                        { name: 'Bu süre içerisinde sıkılmamak için', value: `<#${minik.kanal.chat}> kullanarak sohbet edebilirsin!`, inline: false }
                    )
                    .setThumbnail(userAvatarURL)
                    .setImage(minik.server.bakimtasarim)
                    .setTimestamp();
                components = [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('For Development')
                            .setStyle(ButtonStyle.Link)
                            .setURL(minik.reklam.minikprofillink)
                    )
                ];
                break;
            case 'restart':
                embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(minik.server.serverismi)
                    .addFields(
                        { name: 'Restart Geliyor!', value: 'Cache\'i temizleyip fps\'inizi düzenliyoruz.', inline: false },
                        { name: 'Restart!', value: 'Optimize Ediliyor...', inline: true },
                        { name: 'Geliyor!', value: 'Cache siliniyor...', inline: true }
                    )
                    .setThumbnail(userAvatarURL)
                    .setImage(minik.server.restarttasarim)
                    .setTimestamp();
                components = [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('For Development')
                            .setStyle(ButtonStyle.Link)
                            .setURL(minik.reklam.minikprofillink)
                    )
                ];
                break;
            default:
                return interaction.reply({ content: 'Geçersiz durum.', ephemeral: true });
        }

        await interaction.reply({ content: 'Durum güncellendi.', ephemeral: true });
        await channel.send({ content: '||@everyone|| & ||@here||', embeds: [embed], components });
    },
};
