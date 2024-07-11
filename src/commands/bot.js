const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription('Bot ile alakalı işlemler')
    .addStringOption(option =>
      option.setName('log_kurulum')
        .setDescription('Botun loglarını atması için log odalarını kurar.')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('log_temizle')
        .setDescription('Temizlemek istediğiniz log kategorisinin ismini belirtin.')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('renkmenu')
        .setDescription('Renk rol menüsünü gösterir.')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('renkrollerinikur')
        .setDescription('Belirtilen renklerde roller oluşturur.')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('burcmenu')
        .setDescription('Burç rol menüsünü gösterir.')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('burcrollerinikur')
        .setDescription('Belirtilen burçlarda roller oluşturur.')
        .setRequired(false)),

  async execute(interaction) {
    if (interaction.user.id !== minik.reklam.minikdcid) {
      return interaction.reply({
        content: ":x: Bu komutu kullanmaya izniniz yok.",
        ephemeral: true,
      });
    }

    const logChannels = [
      'channel_log',
      'test',
      'sticker_log',
      'emoji_log',
      'guard_log',
      'voice_log',
      'invite_log',
      'role_log',
      'message_log',
      'user_update_log',
      'ticket_log',
      'ban_log',
      'whitelist_log',
      'nick_log',
      'whitelist_log',
      'minik_log'
    ];

    if (interaction.options.getString('log_kurulum')) {
      await interaction.deferReply({ content: `Log odaları kuruluyor...`, ephemeral: true });
      try {
        const category = await interaction.guild.channels.create({
          name: 'minik',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [{
            id: interaction.guild.roles.everyone.id,
            deny: [
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.MuteMembers,
              PermissionFlagsBits.DeafenMembers,
              PermissionFlagsBits.Stream,
              PermissionFlagsBits.Speak,
            ]
          }]
        });

        for (const channelName of logChannels) {
          await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
          });
        }

        return interaction.followUp({ content: 'Log odaları başarıyla oluşturuldu.', ephemeral: true });
      } catch (error) {
        console.error('Log odaları oluşturulurken bir hata oluştu:', error);
        return interaction.followUp({ content: 'Log odaları oluşturulurken bir hata oluştu.', ephemeral: true });
      }
    }

    if (interaction.options.getString('log_temizle')) {
      const categoryName = interaction.options.getString('log_temizle');

      try {
        const category = interaction.guild.channels.cache.find(channel => channel.name === categoryName && channel.type === ChannelType.GuildCategory);
        if (category) {
          const childrenChannels = category.children.cache.filter(channel => logChannels.includes(channel.name));
          for (const channel of childrenChannels.values()) {
            await channel.delete();
          }
          await category.delete();
          return interaction.followUp({ content: 'Log odaları başarıyla temizlendi.', ephemeral: true });
        } else {
          return interaction.followUp({ content: 'Belirtilen kategori bulunamadı.', ephemeral: true });
        }
      } catch (error) {
        console.error('Log odaları temizlenirken bir hata oluştu:', error);
        return interaction.followUp({ content: 'Log odaları temizlenirken bir hata oluştu.', ephemeral: true });
      }
    }

    if (interaction.options.getString('burcmenu')) {
      const burcmenucontent = interaction.options.getString('burcmenu');
      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('burcMenu')
            .setPlaceholder('Bir Burç seçin...')
            .addOptions([
              {
                label: 'Koç',
                emoji: '♈',
                description: '21 Mart - 20 Nisan',
                value: 'koc',
              },
              {
                label: 'Boğa',
                description: '20 Nisan - 20 Mayıs',
                emoji: '♉',
                value: 'boga',
              },
              {
                label: 'Ikızler',
                emoji: '♊',
                description: '21 Mayıs - 21 Haziran',
                value: 'ikizler',
              },
              {
                label: 'Yengeç',
                emoji: '♋',
                description: '22 Haziran - 22 Temmuz',
                value: 'yengec',
              },
              {
                label: 'Aslan',
                emoji: '♌',
                description: '22 Temmuz - 23 Ağustos',
                value: 'aslan',
              },
              {
                label: 'Başak',
                emoji: '♍',
                description: '23 Ağustos - 23 Eylül',
                value: 'basak',
              },
              {
                label: 'Terazi',
                emoji: '♎',
                description: '23 Eylül - 22 Ekim',
                value: 'terazi',
              },
              {
                label: 'Akrep',
                emoji: '♏',
                description: '23 Ekim - 22 Kasım',
                value: 'akrep',
              },
              {
                label: 'Yay',
                emoji: '♐',
                description: '22 Kasım - 21 Aralık',
                value: 'yay',
              },
              {
                label: 'Oğlak',
                emoji: '♑',
                description: '22 Aralık - 20 Ocak',
                value: 'oglak',
              },
              {
                label: 'Kova',
                emoji: '♒',
                description: '21 Ocak - 19 Şubat',
                value: 'kova',
              },
              {
                label: 'Balık',
                emoji: '♓',
                description: '18 Şubat - 20 Mart',
                value: 'balik',
              },
              {
                label: 'Yılancı',
                emoji: '⛎',
                description: '29 Kasım - 17 Aralık',
                value: 'yilanci',
              },
            ]),
        );

      await interaction.reply({ content: 'Burç menüsü başarıyla gönderildi.', ephemeral: true });
      return interaction.channel.send({ content: `${burcmenucontent}`, components: [row] });
    }

    if (interaction.options.getString('burcrollerinikur')) {
      const burcRoller = [
        'Koç',
        'Boğa',
        'Ikizler',
        'Yengeç',
        'Aslan',
        'Başak',
        'Terazi',
        'Akrep',
        'Yay',
        'Oğlak',
        'Kova',
        'Balık',
        'Yılancı',
      ];

      try {
        for (const burc of burcRoller) {
          await interaction.guild.roles.create({
            name: burc,
          });
        }
        return interaction.reply({ content: 'Burç rolleri başarıyla oluşturuldu.', ephemeral: true });
      } catch (error) {
        console.error('Burç rolleri oluşturulurken bir hata oluştu:', error);
        return interaction.reply({ content: 'Burç rolleri oluşturulurken bir hata oluştu.', ephemeral: true });
      }
    }

    if (interaction.options.getString('renkmenu')) {
      const renkmenucontent = interaction.options.getString('renkmenu');
      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('renkMenu')
            .setPlaceholder('Bir renk seçin...')
            .addOptions([
              {
                label: 'Kırmızı',
                description: 'Kırmızı rengi seçin',
                value: 'red',
              },
              {
                label: 'Mavi',
                description: 'Mavi rengi seçin',
                value: 'blue',
              },
              {
                label: 'Yeşil',
                description: 'Yeşil rengi seçin',
                value: 'green',
              },
              {
                label: 'Beyaz',
                description: 'Beyaz rengi seçin',
                value: 'white',
              },
              {
                label: 'Siyah',
                description: 'Siyah rengi seçin',
                value: 'black',
              },
              {
                label: 'Sarı',
                description: 'Sarı rengi seçin',
                value: 'yellow',
              },
              {
                label: 'Pembe',
                description: 'Pembe rengi seçin',
                value: 'pink',
              },
              {
                label: 'Mor',
                description: 'Mor rengi seçin',
                value: 'purple',
              },
            ]),
        );

      await interaction.reply({ content: 'Renk menüsü başarıyla gönderildi.', ephemeral: true });
      return interaction.channel.send({ content: `${renkmenucontent}`, components: [row] });
    }

    if (interaction.options.getString('renkrollerinikur')) {
      const renkRoller = [
        { name: 'Kırmızı', color: '#FF0000' },
        { name: 'Mavi', color: '#0000FF' },
        { name: 'Yeşil', color: '#008000' },
        { name: 'Beyaz', color: '#FFFFFF' },
        { name: 'Siyah', color: '#000000' },
        { name: 'Sarı', color: '#FFFF00' },
        { name: 'Pembe', color: '#FFC0CB' },
        { name: 'Mor', color: '#800080' },
      ];

      try {
        for (const renk of renkRoller) {
          await interaction.guild.roles.create({
            name: renk.name,
            color: renk.color,
          });
        }
        return interaction.reply({ content: 'Renk rolleri başarıyla oluşturuldu.', ephemeral: true });
      } catch (error) {
        console.error('Renk rolleri oluşturulurken bir hata oluştu:', error);
        return interaction.reply({ content: 'Renk rolleri oluşturulurken bir hata oluştu.', ephemeral: true });
      }
    }

    return interaction.reply({ content: 'Bir seçenek belirtmediniz.', ephemeral: true });
  },
};
