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

        // Eski ve yeni ses kanallarını al
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        // Ses kanalına girme ve çıkma durumu
        if (oldChannel !== newChannel) {
            if (!oldChannel && newChannel) {
                // Kanala katılma durumu
                const action = 'Kanala Katıldı';
                const embed = createEmbed(member, newChannel, action, guild.iconURL());
                logChannel.send({ embeds: [embed] }).catch(console.error);
            } else if (oldChannel && !newChannel) {
                // Kanaldan ayrılma durumu
                const action = 'Kanaldan Ayrıldı';
                const embed = createEmbed(member, oldChannel, action, guild.iconURL());
                logChannel.send({ embeds: [embed] }).catch(console.error);
            }
        }

        // Kamerası ve mikrofonu açıkken odadan çıktıysa
        if (oldState.selfVideo && oldState.streaming && !newChannel) {
            const action = 'Kamerası ve Mikrofonu Açıkken Odadan Çıktı';
            const embed = createEmbed(member, oldChannel, action, guild.iconURL());
            logChannel.send({ embeds: [embed] }).catch(console.error);
        }

        // Kamerası kapalı, mikrofonu açıkken odadan çıktıysa
        if (!oldState.selfVideo && oldState.streaming && !newChannel) {
            const action = 'Mikrofonu Açıkken Odadan Çıktı';
            const embed = createEmbed(member, oldChannel, action, guild.iconURL());
            logChannel.send({ embeds: [embed] }).catch(console.error);
        }

        // Mikrofonu kapalı, kamerası açıkken odadan çıktıysa
        if (oldState.selfVideo && !oldState.streaming && !newChannel) {
            const action = 'Kamerası Açıkken Odadan Çıktı';
            const embed = createEmbed(member, oldChannel, action, guild.iconURL());
            logChannel.send({ embeds: [embed] }).catch(console.error);
        }

        // Yayın durumu değişimi
        if (oldState.streaming !== newState.streaming) {
            const action = newState.streaming ? 'Yayını Açtı' : 'Yayını Kapattı';
            const embed = createEmbed(member, newChannel, action, guild.iconURL());
            logChannel.send({ embeds: [embed] }).catch(console.error);
        }
    },
};

function createEmbed(member, channel, action) {
    const embed = new EmbedBuilder()
        .setColor('#fff700')
        .setTitle(action)
        .setDescription(`
            **Kullanıcı:**
            <@${member.id}> - ${member.id}
            **Kanal:**
            > <#${channel ? `${channel.id}> (${channel.id})` : 'Bilinmiyor'}
            **Kanal Üyeleri:**
            ${getMemberList(channel)}
        `)
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