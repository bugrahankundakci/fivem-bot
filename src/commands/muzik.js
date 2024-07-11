const ytdl = require('ytdl-core');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, CommandInteraction, Client } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { getVideoID } = require('ytdl-core');
const { YouTube } = require('youtube-sr');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('muzik')
        .setDescription('Müzik işlemleri.')
        .addStringOption(option =>
            option.setName('oynat')
                .setDescription('Oynatılacak müziğin adı')
                .setRequired(true)),
    async execute(interaction) {
        const songName = interaction.options.getString('oynat');
        let songInfo;
        try {
            const searchResults = await YouTube.search(songName, { limit: 1 });
            if (!searchResults[0]) {
                return interaction.reply({ content: 'Şarkı bulunamadı.', ephemeral: true });
            }
            songInfo = searchResults[0];
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Şarkı aranırken bir hata oluştu.', ephemeral: true });
        }
		
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply({ content: 'Önce bir ses kanalına katılmalısınız!', ephemeral: true });

        const player = createAudioPlayer();
        const stream = ytdl(songInfo.url, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
		
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        
		
        player.play(resource);
        connection.subscribe(player);

        const manseratinembedi = new EmbedBuilder()
        .setTitle('Müzik Bulundu!')
        .setDescription(`Kişi: \n > <@${interaction.user.id}>\n Aratılan: \n > ${songName} \n Bulunan: \n > ${songInfo.title}`)
        .setImage('https://media.discordapp.net/attachments/1218096753673375786/1251832212979056691/image.png?ex=66700319&is=666eb199&hm=9fa43303a952e6194662a262ab72d05cb46f58fdd5345a05554494daa3b9bf23&=&format=webp&quality=lossless&width=645&height=8')
        .setTimestamp();
        await interaction.reply({ embeds: [manseratinembedi] });
    
        const manseratinlogodasi = interaction.guild.channels.cache.find(channel => channel.name === 'test')
        const manseratinlogembedi = new EmbedBuilder()
        .setTitle('Müzik Bulundu!')
        .setDescription(`Kişi: \n > <@${interaction.user.id}>\n Aratılan: \n > ${songName} \n Bulunan: \n > ${songInfo.title}`)
        .setImage('https://media.discordapp.net/attachments/1218096753673375786/1251832212979056691/image.png?ex=66700319&is=666eb199&hm=9fa43303a952e6194662a262ab72d05cb46f58fdd5345a05554494daa3b9bf23&=&format=webp&quality=lossless&width=645&height=8')
        .setTimestamp();
        await manseratinlogodasi.send({ embeds: [manseratinlogembedi] });
    
    
    }
};
