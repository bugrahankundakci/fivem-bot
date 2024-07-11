const { ActionRowBuilder, UserSelectMenuBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const minik = require('../../minik.json');
//const { catchError } = require('../functions/hatamesajı');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toplurolver')
        .setDescription('Belirli bir role sahip kullanıcılara toplu olarak rol verir.')
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Verilecek rolü seçin.')
                .setRequired(true)),
    async execute(interaction) {
        const minikinyetkilisi = interaction.member.roles.cache;
        const minisinyetkilisi = minik.yetkili.rol.some(roleID => minikinyetkilisi.has(roleID));
        if (!minisinyetkilisi) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz bulunmamaktadır.', ephemeral: true });
        }

        const minikinsecilmisrolidsi = interaction.options.getRole('rol').id;
      //  const userAvatarURL = user.displayAvatarURL({ format: 'png', dynamic: true });
        const minikinuserleri = new UserSelectMenuBuilder()
            .setCustomId('users')
            .setPlaceholder('Kullanıcıları seçin.')
            .setMinValues(1)
            .setMaxValues(15);

        const minikinstunu = new ActionRowBuilder()
            .addComponents(minikinuserleri);

        await interaction.deferReply({ ephemeral: false });

        const message = await interaction.followUp({
            content: 'Kullanıcıları seçin:',
            components: [minikinstunu],
        });

        const minikinsectikleri = [];
        const collector = interaction.channel.createMessageComponentCollector({ time: 10000 });
        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return;
            const users = i.values;
            minikinsectikleri.push(...users);
            const selectedRole = interaction.guild.roles.cache.get(minikinsecilmisrolidsi);
            for (const userId of users) {
                const member = interaction.guild.members.cache.get(userId);
                await member.roles.add(selectedRole);
            }
            const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'role_log');
    if (logChannel) {
        const minikintoplurolembedi = new EmbedBuilder()
        .setColor(selectedRole.hexColor)
        .setTitle('Toplu Rol Verildi!')
        .setDescription(`> Yetkili: \n<@${interaction.user.id}> - (${interaction.user.tag}) - ${interaction.user.id} \n > Rol: \n<@&${selectedRole.id}>  (${selectedRole.id}) - ${selectedRole.hexColor} \n > Roldeki kişi sayısı: **${selectedRole.members.size}** \n > Kişiler: \n\n ${minikinsectikleri.map(userId => `<@${userId}> - (${userId})`).join('\n')}`)
        .setThumbnail(interaction.channel.guild.iconURL({ dynamic: true }))
        .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
        .setTimestamp();
        logChannel.send({embeds: [minikintoplurolembedi]});
    } else {
        console.error('Rol log kanalı bulunamadı!');
    }

            await interaction.editReply({ content: `Seçilen kullanıcılara **${selectedRole.name}** rolü verildi: ${minikinsectikleri.map(userId => `<@${userId}>`).join(', ')}` });
            collector.stop();
            await message.edit({ components: [] });
        });

        collector.on('end', async collected => {
            await interaction.editReply({ content: 'Rol verme işlemi tamamlandı.' });
            await message.edit({ components: [] });
        });
    },
};
