const { Permissions } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isSelectMenu() || interaction.customId !== 'burcMenu') return;

        const burcRolleri = {
            koc: 'Koç',
            boga: 'Boğa',
            ikizler: 'Ikizler',
            yengec: 'Yengeç',
            aslan: 'Aslan',
            basak: 'Başak',
            terazi: 'Terazi',
            akrep: 'Akrep',
            yay: 'Yay',
            oglak: 'Oğlak',
            kova: 'Kova',
            balik: 'Balık',
            yilanci: 'Yılancı',
        };

        const secilenRolIsmi = burcRolleri[interaction.values[0]];

        if (!secilenRolIsmi) {
            return interaction.reply({ content: 'Geçersiz rol seçimi.', ephemeral: true });
        }

        try {
            const member = interaction.member;
            const guildRoles = interaction.guild.roles.cache;
            const existingRoles = member.roles.cache;
            const secilenBurcRol = guildRoles.find(role => role.name === secilenRolIsmi);

            if (!secilenBurcRol) {
                return interaction.reply({ content: 'Bu rol bulunamadı.', ephemeral: true });
            }

            const rolesToRemove = existingRoles.filter(role => Object.values(burcRolleri).includes(role.name) && role.name !== secilenRolIsmi);
            await member.roles.remove(rolesToRemove);
            await member.roles.add(secilenBurcRol);

            return interaction.reply({ content: `${secilenBurcRol.name} rolü verildi!`, ephemeral: true });
        } catch (error) {
            console.error('Rol değiştirme hatası:', error);

            if (!interaction.deferred && !interaction.replied) {
                return interaction.reply({ content: 'Rol değiştirilirken bir hata oluştu.', ephemeral: true });
            }
        }
    },
};
