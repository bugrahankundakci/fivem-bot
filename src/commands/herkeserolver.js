const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('herkeserolver')
    .setDescription('Sunucudaki herkese rol vermeniz için gereken bir menüyü gönderir.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option => option
        .setName('rol')
        .setDescription('rol seçiniz.')
    ),

    async execute(interaction) {
        try { 

            interaction.reply('rol dağıtımı başladı.')
            const sunucu = interaction.guild;
            const rol = interaction.options.getRole('rol')
            if (!rol) {
                console.log('Belirtilen rol bulunamadı')
                interaction.reply('Belirtilen rol bulunamadı.')
            }
            sunucu.members.cache.forEach((member) => {
                member.roles.add(rol).catch((err) => {
                    console.error(`Rol verme hatası : ${err}`);
                });
            });
            interaction.channel.send(`tüm üyelere rol verildi.`)
        } catch(error) {
            console.log('kanka herkese rol ver komutunda hata var.')
            interaction.reply('komutta hata var.')
        }
    }
}

