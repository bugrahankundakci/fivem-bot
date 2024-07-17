const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ChannelType, ButtonInteraction, ButtonComponent } = require('discord.js');
const minik = require('../../minik');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'minikinhelpermodali') {
            
            const minikinhelpermodali = new ModalBuilder()
            .setCustomId('minikinhelpermodali')
            .setTitle('For Development');
            
            const minikinsordugusoru1 = new TextInputBuilder()
            .setCustomId('minikinsordugusoru1')
            .setLabel('Kendinizi Tanıtın')
            .setPlaceholder('isim - yaş - il - platform (pc - tel)')
            .setMinLength(10)
            .setStyle(TextInputStyle.Short);
            
            const minikinsordugusoru2 = new TextInputBuilder()
            .setCustomId('minikinsordugusoru2')
            .setLabel('Bize ne kadar zaman ayırabilirsiniz?')
            .setPlaceholder('Uzun süre afk kalmanızı gerektiricek bir durum var mı?')
            .setMinLength(10)
            .setStyle(TextInputStyle.Paragraph);

            const minikinsordugusoru3 = new TextInputBuilder()
            .setCustomId('minikinsordugusoru3')
            .setLabel('Daha önce hiç yetkililik yaptınız mı?')
            .setPlaceholder('Yaptıysanız hangi sunucuda yaptınız?')
            .setStyle(TextInputStyle.Paragraph);

            const minikinsordugusoru4 = new TextInputBuilder()
            .setCustomId('minikinsordugusoru4')
            .setLabel('Bizden beklentiniz nedir?')
            .setPlaceholder('??')
            .setStyle(TextInputStyle.Paragraph);

            const minikinsordugusoru5 = new TextInputBuilder()
            .setCustomId('minikinsordugusoru5')
            .setLabel('Sunucu üyeleriyle nasıl iletişim kurarsınız?')
            .setPlaceholder('??')
            .setStyle(TextInputStyle.Paragraph);

            const birincisoru = new ActionRowBuilder()
            .addComponents(minikinsordugusoru1);
            const ikincisoru = new ActionRowBuilder()
            .addComponents(minikinsordugusoru2);
            const ucuncusoru = new ActionRowBuilder()
            .addComponents(minikinsordugusoru3);
            const dorduncusoru = new ActionRowBuilder()
            .addComponents(minikinsordugusoru4);
            const besincisoru = new ActionRowBuilder()
            .addComponents(minikinsordugusoru5);

            minikinhelpermodali.addComponents(birincisoru, ikincisoru, ucuncusoru, dorduncusoru, besincisoru);
            await interaction.showModal(minikinhelpermodali);        
        } else if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'minikinhelpermodali') {
           
            const minikinsordugusoru1 = interaction.fields.getTextInputValue('minikinsordugusoru1');
            const minikinsordugusoru2 = interaction.fields.getTextInputValue('minikinsordugusoru2');
            const minikinsordugusoru3 = interaction.fields.getTextInputValue('minikinsordugusoru3');
            const minikinsordugusoru4 = interaction.fields.getTextInputValue('minikinsordugusoru4');
            const minikinsordugusoru5 = interaction.fields.getTextInputValue('minikinsordugusoru5');
       
            const minikinhelperembedi = new EmbedBuilder()
            .setTitle('Helper Başvuru Geldi!')
            .setDescription(` - Kişisel Bilgiler: \n > ${minikinsordugusoru1} \n\n - Bize ne kadar zaman ayırabilirsiniz?: \n > ${minikinsordugusoru2} \n\n - Daha önce hiç yetkililik yaptınız mı?: \n > ${minikinsordugusoru3} \n\n - Bizden beklentiniz nedir?: \n > ${minikinsordugusoru4} \n\n - Sunucu üyeleriyle nasıl iletişim kurarsınız?: \n > ${minikinsordugusoru5}`)
           // .setImage(minik.reklam.embedphoto)
            const minikinhelperactionu = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('minikinhelperkabulbutonu')
                .setLabel('Kabul Et')
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId('minikinhelperredbutonu')
                .setLabel('Red Et')
                .setStyle(ButtonStyle.Danger)
            );
            const minikinkanali = interaction.guild.channels.cache.find(channel => channel.name === 'minik_log');
            if (!minikinkanali || minikinkanalitype !== ChannelType.GuildText) {
                console.error('Kanal yarra yemiş kanka helper diye yazmışsın kodu al ananın amına sok')
                return;
            }
        
            const collector = minikinkanali.createMessageComponentCollector();
            const minikinyetkilirolu = minik.yetkili.kayit;
            const minikinhelperatanmali = interaction.member;
            const minikinlogodasi = interaction.guild.channels.cache.find(channel => channel.name === 'minik_log');



            collector.on('collect', async interaction => {
                if (interaction.customId === 'minikinhelperkabulbutonu') {
                    await interaction.update( {content: `Helper başvurusu <@${interaction.user.id}> - (${interaction.user.id}) tarafından kabul edildi. Yetkiler veriliyor...`, components: [] } )
                    minikinhelperatanmali.roles.add(minikinyetkilirolu);
                } else if (interaction.customId === 'minikinhelperredbutonu') {
                    await interaction.update( { content: `Helper başvurusu <@${interaction.user.id}> - (${interaction.user.id}) tarafından reddedildi.`, components: [] } )
                }

            }) 

            await minikinlogodasi.send({content: `<@&${minik.yetkili.kurucu}>, <@${interaction.member.id}> başvuru attı!`, embeds: [minikinhelperembedi], components: [minikinhelperactionu]})
            await interaction.reply( { content: `# BAŞVURUNUZ BAŞARIYLA GÖNDERİLDİ! \n\n  - Kişisel Bilgiler: \n > ${minikinsordugusoru1} \n\n - Bize ne kadar zaman ayırabilirsiniz?: \n > ${minikinsordugusoru2} \n\n - Daha önce hiç yetkililik yaptınız mı?: \n > ${minikinsordugusoru3} \n\n - Bizden beklentiniz nedir?: \n > ${minikinsordugusoru4} \n\n - Sunucu üyeleriyle nasıl iletişim kurarsınız?: \n > ${minikinsordugusoru5}`, components: [], ephemeral: true } )
        }
    }
}
