const { Permissions } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isSelectMenu() || interaction.customId !== 'renkMenu') return;

        const renkRolleri = {
            red: 'Kırmızı',
            blue: 'Mavi',
            green: 'Yeşil',
            white: 'Beyaz',
            black: 'Siyah',
            yellow: 'Sarı',
            pink: 'Pembe',
            purple: 'Mor',
        };

        const secilenRolIsmi = renkRolleri[interaction.values[0]];

        if (!secilenRolIsmi) {
            return interaction.reply({ content: 'Geçersiz rol seçimi.', ephemeral: true });
        }

        try {
            const member = interaction.member;
            const guildRoles = interaction.guild.roles.cache;
            const existingRoles = member.roles.cache;
            const secilenRenkRol = guildRoles.find(role => role.name === secilenRolIsmi);

            if (!secilenRenkRol) {
                return interaction.reply({ content: 'Bu rol bulunamadı.', ephemeral: true });
            }

            const rolesToRemove = existingRoles.filter(role => Object.values(renkRolleri).includes(role.name) && role.name !== secilenRolIsmi);
            await member.roles.remove(rolesToRemove);
            await member.roles.add(secilenRenkRol);

            return interaction.reply({ content: `${secilenRenkRol.name} rolü verildi!`, ephemeral: true });
        } catch (error) {
            console.error('Rol değiştirme hatası:', error);

            if (!interaction.deferred && !interaction.replied) {
                return interaction.reply({ content: 'Rol değiştirilirken bir hata oluştu.', ephemeral: true });
            }
        }
    },
};
