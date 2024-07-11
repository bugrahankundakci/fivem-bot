const { EmbedBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isModalSubmit() && interaction.customId === 'myModal') {
            const name = interaction.fields.getTextInputValue('nameInput');
            const description = interaction.fields.getTextInputValue('descriptionInput');
            const minikinodasi = interaction.guild.channels.cache.find(channel => channel.name === 'test');
            const minikinembedi = new EmbedBuilder()
            .setColor('#000000')
            .setTitle(`${name}`)
            .setDescription(`${description}`)
            .setTimestamp(new Date())
            await minikinodasi.send( { content: `Yetkili Başvurusu geldi! ${minik.yetkili.kurucu}`, embeds: [minikinembedi]} );
            await interaction.reply({ content: `${name}\n${description}`, ephemeral: true });
        }
    },
};
