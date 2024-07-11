const { SlashCommandBuilder } = require('@discordjs/builders');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sil')
        .setDescription('Belirli bir sayıda mesajı siler veya belirtilmezse rastgele bir sayıda siler.')
        .addIntegerOption(option =>
            option.setName('sayı')
                .setDescription('Kaç mesajın silineceğini belirtin. Belirtilmezse rastgele bir sayıda siler.')),
    async execute(interaction) {
        let amount = interaction.options.getInteger('sayı');
        const minikroller = interaction.member.roles.cache;
        const hasAllowedRole = minikroller.some(role => minik.yetkili.rol.includes(role.id));

        if (!hasAllowedRole) {
            return await interaction.reply({ content: 'Bu komutu kullanmaya yetkiniz yok!', ephemeral: true});
        }
        if (!amount) {
            amount = Math.floor(Math.random() * 99) + 10; 
        }
        if (amount <= 0) {
            return await interaction.reply('Silinecek mesaj sayısı pozitif olmalıdır!');
        } else if (amount > 100) {
            return await interaction.reply('Bir seferde en fazla 100 mesaj silebilirsiniz!');
        }

        try {
            const fetched = await interaction.channel.messages.fetch({ limit: amount });
            await interaction.channel.bulkDelete(fetched);
            await interaction.reply(`Başarıyla ${amount} mesaj silindi.`);
        } catch (error) {
            console.error(error);
            await interaction.reply('Mesajları silerken bir hata oluştu!');
        }
    },
};


