const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolbilgi')
        .setDescription('Belirtilen rol hakkında bilgi alın.')
        .addRoleOption(option => 
            option.setName('rol')
            .setDescription('Bilgisi Alınıcak Rolü Seçin.')
            .setRequired(true)),
    async execute(interaction) {
        const minikinyetkilirolleri = interaction.member.roles.cache.some(r => minik.yetkili.rol.includes(r.id));
        if (!minikinyetkilirolleri) {
            return await interaction.reply({ content: `Bu komutu kullanmak için ${minik.yetkili.rol} rollerinden birine sahip olmanız gerekiyor.`, ephemeral: true});
        }
        const minikinrolü = interaction.options.getRole('rol');
        if (!minikinrolü) {
            return await interaction.reply({ content: `Bir rol seçmelisiniz.`, ephemeral: true});
        }

        const minikinrolündekiler = minikinrolü.members.map(member => {
            return `**${member.nickname} - ${member.user.tag}** - <@${member.id}>`;
        }).join('\n');

        const minikinrolbilgiembedi = new EmbedBuilder()
            .setColor(minikinrolü.hexColor)
            .setTitle(`Rol Bilgisi: ${minikinrolü.name}`)
            .setDescription(`Rol ID'si: ${minikinrolü.id}\nRol Rengi: ${minikinrolü.hexColor}\n Roldeki Kişi Sayısı: ${minikinrolü.members.size}\n\n${minikinrolündekiler}`);

        await interaction.reply({ embeds: [minikinrolbilgiembedi] });
    },
};
