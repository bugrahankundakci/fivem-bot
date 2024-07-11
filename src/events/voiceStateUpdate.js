const { EmbedBuilder, Events } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const member = newState.member;
        const guild = member.guild;
        const logChannel = guild.channels.cache.find(channel => channel.name === 'voice_log');

        if (!logChannel) {
            console.log('Log kanalı bulunamadı.');
            return;
        }

        // Sağırlaştırma durumu değişimi
        if (oldState.deaf !== newState.deaf) {
            const action = newState.deaf ? 'Sağıra Alındı' : 'Sağırdan Çıktı';
            const embed = createEmbed(member, newState.channel, action, guild.iconURL());
            logChannel.send({ embeds: [embed] }).catch(console.error);
        } else {
            // Sağırlaştırma durumu değişmediğinde susturma durumu değişimi
            if (oldState.mute !== newState.mute) {
                const action = newState.mute ? 'Susturuldu' : 'Susturulmayı Kaldırdı';
                const embed = createEmbed(member, newState.channel, action, guild.iconURL());
                logChannel.send({ embeds: [embed] }).catch(console.error);
            }
        }
    },
};

function createEmbed(member, channel, action, iconURL) {
    const embed = new EmbedBuilder()
        .setColor('#fff700')
        .setTitle(action)
        .setDescription(`
            **Kullanıcı:**
            <@${member.id}> - ${member.id}
            **Kanal:**
            > ${channel ? `${channel.name} (${channel.id})` : 'Bilinmiyor'}
            **Kanal Üyeleri:**
            ${getMemberList(channel)}
        `)
        .setThumbnail(iconURL)  // Sunucunun profil fotoğrafı
        .setFooter({ text: minik.reklam.minikisim, iconURL: minik.reklam.minikprofile })
        .setTimestamp();
    return embed;
}

function getMemberList(channel) {
    const members = channel ? channel.members : null;
    let memberList = '';
    if (members) {
        members.forEach(member => {
            memberList += `\n> <@${member.id}> - ${member.id}`;
        });
    }
    return memberList || 'Kanalda başka üye bulunmuyor.';
}


module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {
        const minikinwelcomesesi = "1204864294559420486"; // İzlenmek istenen kanalın ID'si
        const minikinyetkilichati = "1245864924572287057"; // Mesajın gönderileceği kanalın ID'si
        if (newState.channelId === minikinwelcomesesi && !oldState.channelId) {
            const destinationChannel = client.channels.cache.get(minikinyetkilichati);
            if (destinationChannel) {
                destinationChannel.send(`${newState.member} adlı kullanıcı ${newState.channel} Kanalına Katıldı!`);
            } else {
                console.error('Hedef kanal bulunamadı!');
            }
        }
    }
}