const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ChannelType, ButtonInteraction, ButtonComponent } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'minikinmodali') {
            const minikinyetkilimodali = new ModalBuilder()
                .setCustomId('minikinmodali')
                .setTitle('For Development');

            const minikinsordugusorular1 = new TextInputBuilder()
                .setCustomId('minikinsordugusorular1')
                .setLabel('Kendinizi tanıtın')
                .setPlaceholder('isim - yaş - il')
                .setMinLength(10)
                .setStyle(TextInputStyle.Short);

            const minikinsordugusorular2 = new TextInputBuilder()
                .setCustomId('minikinsordugusorular2')
                .setLabel('Discordu hangi platformdan giriyorsunuz?')
                .setPlaceholder('pc - telefon vb.')
                .setStyle(TextInputStyle.Short);

            const minikinsordugusorular3 = new TextInputBuilder()
                .setCustomId('minikinsordugusorular3')
                .setLabel('Hangi Yazılım Dillerini biliyorsunuz? ')
                .setPlaceholder('Teste tabi tutulucaksınız. Düz yetkili için boş bırakın.')
                .setMinLength(5)
                .setRequired(false)
                .setStyle(TextInputStyle.Short);

            const minikinsordugusorular4 = new TextInputBuilder()
                .setCustomId('minikinsordugusorular4')
                .setLabel('Bize ne katabilirsiniz??')
                .setMinLength(35)
                .setStyle(TextInputStyle.Paragraph);
                
            const minikinsordugusorular5 = new TextInputBuilder()
            .setCustomId('minikinsordugusorular5')
            .setLabel('Bizden beklentiniz nedir?')
            .setPlaceholder('ve Hangi Yazılım Dillerini biliyorsunuz?')
            .setMinLength(35)
            .setPlaceholder('??')
            .setStyle(TextInputStyle.Paragraph);

            const birincisoru = new ActionRowBuilder().addComponents(minikinsordugusorular1);
            const ikincisoru = new ActionRowBuilder().addComponents(minikinsordugusorular2);
            const ucuncusoru = new ActionRowBuilder().addComponents(minikinsordugusorular3);
            const dorduncusoru = new ActionRowBuilder().addComponents(minikinsordugusorular4);
            const besincisoru = new ActionRowBuilder().addComponents(minikinsordugusorular5);

            minikinyetkilimodali.addComponents(birincisoru, ikincisoru, ucuncusoru, dorduncusoru, besincisoru);
            await interaction.showModal(minikinyetkilimodali);
 } else if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'minikinmodali') {
            const minikinsordugusorular1 = interaction.fields.getTextInputValue('minikinsordugusorular1');
            const minikinsordugusorular2 = interaction.fields.getTextInputValue('minikinsordugusorular2');
            const minikinsordugusorular3 = interaction.fields.getTextInputValue('minikinsordugusorular3');
            const minikinsordugusorular4 = interaction.fields.getTextInputValue('minikinsordugusorular4');
            const minikinsordugusorular5 = interaction.fields.getTextInputValue('minikinsordugusorular5');
            const minikinyetkililogodasi = interaction.guild.channels.cache.find(channel => channel.name === 'minik_log');
            const minikinyetkiliembedi = new EmbedBuilder()
            .setTitle(`Başvuru Geldi!`)
            .setDescription(`Kişisel Bilgiler: \n > ${minikinsordugusorular1}  \n\n Platform: \n > ${minikinsordugusorular2} \n\n Diller: \n > ${minikinsordugusorular3} \n\n Bize ne katabilirsiniz?: \n > ${minikinsordugusorular4} \n\n Bizden beklentiniz nedir? ve Hangi Yazılım Dillerini biliyorsunuz? \n > ${minikinsordugusorular5}`)
            .setImage(minik.reklam.embedphoto);
            const minikinyetkilikabulactionu = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('minikinyetkilikabulbuttonu')
                    .setLabel('Kabul Et')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('minikinyetkiliredbutonu')
                    .setLabel('Reddet')
                    .setStyle(ButtonStyle.Danger)
            );
            const channel = interaction.guild.channels.cache.find(channel => channel.name === 'minik_log');
            if (!channel || channel.type !== ChannelType.GuildText) {
                console.error('Kanal bulunamadı veya geçersiz kanal tipi.');
                return;
            }

            const collector = minikinyetkililogodasi.createMessageComponentCollector(); //{ time: 150000 }
            const minikinyetkilirolleri = minik.yetkili.kayit;
            const minikinyetkikbasvurusuatanmali = interaction.member;
            const minikinyetkiliolayloglari = interaction.guild.channels.cache.find(channel => channel.name === 'minik_log');
            collector.on('collect', async interaction => {
                if (interaction.customId === 'minikinyetkilikabulbuttonu') {
                    await interaction.update({ content: `Yetkili başvurusu <@${interaction.user.id}> - (${interaction.user.id}) tarafından kabul edildi. Yetkiler veriliyor...`, components: [] });
                    minikinyetkikbasvurusuatanmali.roles.add(minikinyetkilirolleri);
                    await minikinyetkiliolayloglari.send(`<@${interaction.member.id}> - (${interaction.member.id}) Tarafından gönderilen Yetkili Başvurusu <@${interaction.user.id}> - (${interaction.user.id}) Tarafından Kabul Edildi.`)
                } else if (interaction.customId === 'minikinyetkiliredbutonu') {
                    await interaction.update({ content: `Yetkili başvurusu <@${interaction.user.id}> - (${interaction.user.id}) tarafından reddedildi.`, components: [] });
                    await minikinyetkiliolayloglari.send(`<@${interaction.member.id}> - (${interaction.member.id}) Tarafından gönderilen Yetkili Başvurusu <@${interaction.user.id}> - (${interaction.user.id}) Tarafından reddedildi.`)
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    minikinyetkililogodasi.edit({ content: 'Başvuru zaman aşımına uğradı.', components: [] });
                }
            });
            
            await minikinyetkililogodasi.send( { content: `<@&${minik.yetkili.kurucu}>, <@${interaction.member.id}> başvuru attı!`, embeds: [minikinyetkiliembedi], components: [minikinyetkilikabulactionu]} )
            await interaction.reply({ content: `# BAŞVURUNUZ BAŞARIYLA GÖNDERİLDİ! \n\n Kişisel Bilgiler: \n > ${minikinsordugusorular1}  \n\n Platform: \n > ${minikinsordugusorular2} \n\n Diller: \n > ${minikinsordugusorular3} \n\n Bize ne katabilirsiniz?: \n > ${minikinsordugusorular4} \n\n Hangi Yazılım Dillerini biliyorsunuz? \n > ${minikinsordugusorular5}`, ephemeral: true });
        }
    }
};
