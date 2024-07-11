const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const minik = require('../../minik.json')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rol')
        .setDescription('Belirtilen kullanıcıya belirli bir rolü verir veya alır.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('İşlem yapılacak kullanıcıyı seçin.')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Kullanıcıya verilecek veya alınacak rolü seçin.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('aksiyon')
                .setDescription('Rol ekleme veya çıkarma işlemini belirtin.')
                .setRequired(true)
                .setChoices(
                            { name: 'ver', value: 'ver',},
                            { name: 'al', value: 'al',})),
    async execute(interaction) {
        const member = interaction.options.getMember('kullanıcı');
        const role = interaction.options.getRole('rol');
        const action = interaction.options.getString('aksiyon');

        if (!member || !role) {
            return await interaction.reply({ content: 'Kullanıcı veya rol bulunamadı.', ephemeral: true });
        }

        const userHasAllowedRole = interaction.member.roles.cache.some(r => minik.yetkili.rol.includes(r.id));
        if (!userHasAllowedRole) {
            return await interaction.reply({ content: 'Bu komutu kullanmak için gerekli yetkiye sahip değilsiniz.', ephemeral: true });
        }
        try {
            if (action === 'ver') {
                await member.roles.add(role);
                await interaction.reply({ content: `Başarıyla **${role.name}** - <@&${role.id}> rolü <@${member.id}> - ${member.user.tag} (${member.displayName})'a eklendi.`, ephemeral: true });
            } else if (action === 'al') {
                await member.roles.remove(role);
                await interaction.reply({ content: `Başarıyla **${role.name}** - <@&${role.id}> rolü <@${member.id}> - ${member.user.tag} (${member.displayName})'dan alındı.`, ephemeral: true });
            } else {
                await interaction.reply({ content: 'Geçersiz işlem seçimi. Lütfen "ver" veya "al" seçeneklerinden birini belirtin.', ephemeral: true });
            }
            const minikinlogkanali = interaction.guild.channels.cache.get(minik.log.rolguncelleme);
            if (minikinlogkanali) {
                const minikallahinrolembedi = new EmbedBuilder()
                .setColor('#ee00ff')
                .setTitle(minik.server.serverismi)
                .addFields(
                    { name: `Rol`, value: `Bilgileri`, inline: true },           
                    { name: `${role.name}`, value: `${role.id}`, inline: true },
                    { name: `\u200b`, value: `\u200b`, inline: false },
                    { name: `Kişi bilgileri`, value: `Profil bilgileri`, inline: true },
                    { name: `${member.displayName} - ${member.id}`, value: `${member.user.tag} - <@${member.id}>`, inline: true }
                )
                await minikinlogkanali.send({ content: `**Rol ${action === 'ver' ? 'eklendi' : 'alındı'}**`, embeds: [minikallahinrolembedi]});
            } else {
                console.error('Log kanalı bulunamadı.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `Rol ${action === 'ver' ? 'eklenirken' : 'çıkarılırken'} bir hata oluştu.`, ephemeral: true });
        }
    },
};