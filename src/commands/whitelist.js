const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('whitelist verirsiniz.'),
    async execute(interaction) {

        const memberRoles = interaction.member.roles.cache;
        const minikinyetkilisi = minik.yetkili.kayit.some(roleID => memberRoles.has(roleID));
        if (!minikinyetkilisi) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz bulunmamaktadır.', ephemeral: true });
        }

        const members = await interaction.guild.members.fetch();
        const userOptions = members.map(member => ({
            label: member.user.tag,
            value: member.id
        })).slice(0, 25);

        const userSelect = new StringSelectMenuBuilder()
            .setCustomId('users')
            .setPlaceholder('Kullanıcıları seçin.')
            .setMinValues(1)
            .setMaxValues(Math.min(25, members.size))
            .addOptions(userOptions);

        const row1 = new ActionRowBuilder()
            .addComponents(userSelect);

        await interaction.deferReply({ ephemeral: true });

        const message = await interaction.followUp({
            content: 'Kullanıcıları seçin:',
            components: [row1],
        });

        const collector = message.createMessageComponentCollector({ time: 20000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return;

            const selectedUsers = i.values;
            for (const userId of selectedUsers) {
                const member = interaction.guild.members.cache.get(userId);
                await member.roles.add(minik.rol.whitelist);
                await member.roles.remove(minik.rol.kayıtsız);
                await member.setNickname("IC ISIM / OOC ISIM");
            }

            const minikinlogodasi = interaction.guild.channels.cache.find(channel => channel.name === 'whitelist_log');
            if (minikinlogodasi) {
                const minikinwhitelistembedi = new EmbedBuilder()
                    .setTitle('Whitelist Verildi!')
                    .setDescription(`Yetkili bilgileri:  \n > <@${interaction.user.id}> - (${interaction.user.id}) \n\n Whitelist Verilenler: \n > ${selectedUsers.map(userId => `<@${userId}> - (${userId})`).join('\n')}`)
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
                    .setTimestamp();
                minikinlogodasi.send({ embeds: [minikinwhitelistembedi] });
            } else {
                console.error('Rol log kanalı bulunamadı!');
            }

            await interaction.editReply({ content: `Seçilen kullanıcılara **<@&${minik.rol.whitelist}>** rolü verildi: ${selectedUsers.map(userId => `<@${userId}>`).join(', ')}`, components: [] });
            collector.stop();
        });

        collector.on('end', async collected => {
            if (!collected.size) {
                try {
                    await interaction.editReply({ content: 'Zaman aşımına uğradı. Herhangi bir kullanıcı seçilmedi.', components: [] });
                } catch (error) {
                    if (error.code !== 10008) { // Sadece 10008 hatası değilse logla
                        console.error('Zaman aşımı mesajı düzenlenirken bir hata oluştu:', error);
                    }
                }
            }
        });
    },
};
