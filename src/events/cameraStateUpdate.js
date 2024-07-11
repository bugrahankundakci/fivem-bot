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
        if (oldState.selfVideo !== newState.selfVideo) {
            const action = newState.selfVideo ? 'Kamerasını Açtı' : 'Kamerasını Kapattı';
            const embed = createEmbed(member, newState.channel, action);
            logChannel.send({ embeds: [embed] }).catch(console.error);
        }
    },
};

function createEmbed(member, channel, action) {
    const embed = new EmbedBuilder()
        .setColor('#00ffff')
        .setTitle(action)
        .setDescription(`
            **Kullanıcı:**
            <@${member.id}> - ${member.id}
            **Kanal:**
            > ${channel ? `${channel.name} (${channel.id})` : 'Bilinmiyor'}
            **Kanalda Bulunan kişiler:**
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