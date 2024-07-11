const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('başvuru-oluştur')
    .setDescription('Başvuru göndermeleri için buton oluşturursunuz.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Başvuru embedi hangi odaya atılacak?')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Embedin içindeki en üste yazılacak olan mesaj.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('Choose a description for the ticket embed.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('image')
        .setDescription('Embed içerisine atılacak olan image.')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('content')
        .setDescription('Embed Üstüne ne yazalım?')
        .setRequired(false)
    )

    .addStringOption(option =>
      option
        .setName('yetkilibutonu')
        .setDescription('Yetkili butonunda ne yazacak?')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('helperbutonu')
        .setDescription('Helper butonunda ne yazacak?')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('color')
        .setDescription('Embed hangi renk olacak?')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('yetkiliemoji')
        .setDescription('Butonun emojisi ne olacak?')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('helperemoji')
        .setDescription('Butonun emojisi ne olacak?')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('footer')
        .setDescription('Butonun footer\'ı ne olacak?')
        .setRequired(false)
    ),
  async execute(interaction) {
    const { guild, options } = interaction;
    try {
      const channel = options.getChannel('channel');
      const title = options.getString('title');
      const description = options.getString('description');
      const image = options.getString('image');
      const color = options.getString('color') || '#FFFFFF';
      const yetkilibutonu = options.getString('yetkilibutonu');
      const helperbutonu = options.getString('helperbutonu');
      const yetkiliemoji = options.getString('yetkiliemoji');
      const helperemoji = options.getString('helperemoji');
      const embedfooter = options.getString('footer');
      const content = options.getString('content');

      const embed = new EmbedBuilder()
        .setDescription(description)
        .setImage(image)
        .setTitle(title)
        .setColor(color)
        .setFooter({ text: embedfooter })
        .setTimestamp();

      const components = [];
      if (yetkilibutonu) {
        const minikinyetkilibutonu = new ButtonBuilder()
          .setCustomId('minikinmodali')
          .setLabel(yetkilibutonu)
          .setStyle(ButtonStyle.Primary);
          if (yetkiliemoji) minikinyetkilibutonu.setEmoji(yetkiliemoji);
          components.push(minikinyetkilibutonu);
      }

      if (helperbutonu) {
        const minikinhelperbutonu = new ButtonBuilder()
          .setCustomId('minikinhelpermodali')
          .setLabel(helperbutonu)
          .setStyle(ButtonStyle.Primary);
          if (helperemoji) minikinhelperbutonu.setEmoji(helperemoji);
          components.push(minikinhelperbutonu);
      }

      const actionRow = components.length ? new ActionRowBuilder().addComponents(components) : null;

      await guild.channels.cache.get(channel.id).send({
        content: `${content}.`,
        embeds: [embed],
        components: actionRow ? [actionRow] : [],
      });

      await interaction.reply({
        content: 'Başvuru başarıyla oluşturuldu!',
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.',
        ephemeral: true
      });
    }
  },
};
