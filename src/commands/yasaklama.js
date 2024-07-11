const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kickban')
        .setDescription('Kullanıcıyı sunucudan atar veya yasaklar.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Atılacak veya yasaklanacak kullanıcı.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('İşlem sebebi.')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('ban')
                .setDescription('Kullanıcıyı yasaklamak istiyor musunuz?')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const minikinyetkilirolleri = interaction.member.roles.cache.some(r => minik.yetkili.yasaklama.includes(r.id));
            if (!minikinyetkilirolleri) {
                return await interaction.reply({ content: `Bu komutu kullanmak için ${minik.yetkili.yasaklama} rollerinden birine sahip olmanız gerekiyor.`, ephemeral: true});
            }
            const user = interaction.options.getUser('kullanıcı');
            const reason = interaction.options.getString('sebep');
            const banOption = interaction.options.getBoolean('ban');
            if (banOption) {
                await interaction.guild.members.ban(user, { reason: reason });
                const minikinlogodasi = client.channels.cache.find(channel => channel.name === 'ban_log');
                const minikinembedi = new EmbedBuilder()
                .setColor('#000000')
                .setAuthor('Kullanıcı Banlandı!')
                .setDescription(`Yetkili: \n > <@${interaction.member.id}> - (<@${interaction.member.id}>) \n kişi: \n > ${user.username} - ${user.id} \n Olay: \n > kullanıcısı sunucudan yasaklandı. \n Sebep: \n > ${reason}`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                .setTimestamp();
                if (minikinlogodasi) {
                  await minikinlogodasi.send({ embeds: [minikinembedi]});
                }
                await interaction.reply({ content: `Yetkili: \n > <@${interaction.member.id}> - (<@${interaction.member.id}>) \n kişi: \n > ${user.username} - ${user.id} \n Olay: \n > kullanıcısı sunucudan yasaklandı. \n Sebep: \n > ${reason}`, ephemeral: true });
            } else {
                await interaction.guild.members.kick(user, { reason: reason });
                const minikinlogodasi = client.channels.cache.find(channel => channel.name === 'ban_log');
                const minikinembedi = new EmbedBuilder()
                .setColor('#000000')
                .setAuthor('Kullanıcı Atıldı!')
                .setDescription(`Yetkili: \n > <@${interaction.member.id}> - (<@${interaction.member.id}>) \n kişi: \n > ${user.username} - ${user.id} \n Olay: \n > kullanıcısı sunucudan yasaklandı. \n Sebep: \n > ${reason}`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                .setTimestamp();
                if (minikinlogodasi) {
                  await minikinlogodasi.send({ embeds: [minikinembedi]});
                }
                await interaction.reply({ content: `${user.username} kullanıcısı sunucudan atıldı. Sebep: ${reason}`, ephemeral: true });
            }
        } catch (error) {
            console.error('Hata oluştu:', error);
            await interaction.reply({ content: 'Komut gerçekleştirilirken bir hata oluştu.' });
        }
    },
};