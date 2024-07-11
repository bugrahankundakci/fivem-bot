const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Collection, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('çekiliş')
        .setDescription('Yeni bir çekiliş başlatır.')
        .addStringOption(option =>
            option.setName('ödül')
                .setDescription('Çekiliş ödülü')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('kazanan_sayısı')
                .setDescription('Çekilişte kaç kazanan olacak?')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('süre')
                .setDescription('Çekilişin süresi (saniye olarak)')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.roles.cache.has(minik.yetkili.kurucu)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', ephemeral: true });
        }
        const ödül = interaction.options.getString('ödül');
        const kazananSayısı = interaction.options.getInteger('kazanan_sayısı');
        const süre = interaction.options.getInteger('süre');
        const guildOwner = await interaction.guild.fetchOwner();
        const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'test');

        const embed = new EmbedBuilder()
            .setTitle('Yeni Çekiliş!')
            .setDescription(`Ödül: **${ödül}**\nKazanan Sayısı: **${kazananSayısı}**\nSüre: **${süre} saniye**\nKatılmak için aşağıdaki butona tıklayın!`)
            .setColor('#00FF00')
            .setTimestamp(Date.now() + süre * 1000)
            .setFooter({ text: 'Çekiliş sona eriyor' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('çekiliş_katıl')
                    .setLabel('Katıl')
                    .setStyle(ButtonStyle.Primary)
            );

        const giveawayMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const filter = (buttonInteraction) => buttonInteraction.customId === 'çekiliş_katıl';
        const collector = giveawayMessage.createMessageComponentCollector({ filter, time: süre * 1000 });

        const participants = new Collection();

        collector.on('collect', (buttonInteraction) => {
            if (buttonInteraction.customId === 'çekiliş_katıl') {
                if (participants.has(buttonInteraction.user.id)) {
                    const minikinbuttonu = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                               .setCustomId('çekiliş_iptal')
                               .setLabel('Çekilişten Çık')
                               .setStyle(ButtonStyle.Danger)
                        );
                    return buttonInteraction.reply({ content: 'Zaten çekilişe katıldınız!', components: [minikinbuttonu], ephemeral: true });
                }
                participants.set(buttonInteraction.user.id, buttonInteraction.user);
                buttonInteraction.reply({ content: 'Çekilişe katıldınız!', ephemeral: true });
            } 
            else if (buttonInteraction.customId === 'çekiliş_iptal') {
                if (participants.has(buttonInteraction.user.id)) {
                    participants.delete(buttonInteraction.user.id);
                    buttonInteraction.reply({ content: 'Çekilişten çıktınız.', ephemeral: true });
                } else {
                    buttonInteraction.reply({ content: 'Zaten çekilişe katılmamışsınız!', ephemeral: true });
                }
            }
        });

        collector.on('end', async () => {
            if (participants.size < kazananSayısı) {
                await interaction.editReply({ content: 'Yeterli katılımcı yok, çekiliş iptal edildi.', embeds: [], components: [] });
                if (logChannel) {
                    logChannel.send(`Çekiliş iptal edildi. Yeterli katılımcı yok.\nÖdül: **${ödül}**\nBaşlatan: ${interaction.user.tag}`);
                }
                return;
            }
            const winners = [];
            for (let i = 0; i < kazananSayısı; i++) {
                const winnerIndex = Math.floor(Math.random() * participants.size);
                const winner = Array.from(participants.values())[winnerIndex];
                winners.push(winner);
                participants.delete(winner.id);
            }
            const winnerNames = winners.map(winner => winner.username).join(', ');
            const resultEmbed = new EmbedBuilder()
                .setTitle('Çekiliş Sona Erdi!')
                .setDescription(`Ödül: **${ödül}**\nKazananlar: **${winnerNames}**`)
                .setColor('#FFD700');

            await interaction.editReply({ content: 'Çekiliş sona erdi!', embeds: [resultEmbed], components: [] });
            for (const winner of winners) {
                try {
                    await winner.send(`Tebrikler! **${ödül}** ödüllü çekilişi kazandınız!`);
                } catch (error) {
                    console.error(`DM gönderilemedi ${winner.tag}`);
                }
            }
            const winnerDetails = winners.map(winner => `İsim: ${winner.tag}, ID: ${winner.id}`).join('\n');
            const ownerMessage = `Çekiliş Sonuçları:\n\nÖdül: ${ödül}\nKazananlar:\n${winnerDetails}`;
            try {
                await guildOwner.send(ownerMessage);
            } catch (error) {
                console.error('Sunucu kurucusuna mesaj gönderilemedi.');
            }
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('Çekiliş Log')
                    .setDescription(`Çekiliş sona erdi!\n\nÖdül: ${ödül}\nKazanan Sayısı: ${kazananSayısı}\nToplam Katılım: ${participants.size}\nBaşlatan: ${interaction.user.tag}\nKazananlar: ${winnerNames}`)
                    .setColor('#FFA500')
                    .setTimestamp();

                logChannel.send({ embeds: [logEmbed] });
            }
        });
    }
};