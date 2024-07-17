const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder,TextInputStyle, OAuth2Scopes, Partials, resolveColor, Client, Collection, GatewayIntentBits,SelectMenuBuilder,ActivityType,ChannelType,PermissionFlagsBits } = require("discord.js");
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const minik = require('./minik.json');
const {JsonDatabase} = require("wio.db");
const { connect, mongoose } = require('mongoose');
const eventHandlers = require('./src/handlers/eventHandler');
const { commandMap } = require('./src/handlers/commandHandler');
const db = minik.db = new JsonDatabase({databasePath:"./minik_database.json"});

const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((Militan) => GatewayIntentBits[Militan]),
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

client.commands = new Discord.Collection();
client.interactions = new Discord.Collection();
client.selectMenus = new Discord.Collection();
client.modals = new Discord.Collection();
eventHandlers(client);

const rest = new REST({ version: '10' }).setToken(minik.botSettings.token);
(async () => {
    try {
        console.log('(/) komutları başlatıldı ve yenilendi!');

        await rest.put(
            Routes.applicationGuildCommands(minik.botSettings.clientID, minik.botSettings.ServerID),
            { body: commandMap.map(cmd => cmd.data.toJSON()) },
        );

        console.log('(/) komutları başarıyla yüklendi!');
    } catch (error) {
        console.error(error);
    }
})();

client
    .login(minik.botSettings.token).then(() => {
    console.clear();
    console.log('[Minik API] ' + client.user.username + ' Giriş Yaptım.');
    mongoose.set('strictQuery', true);
    connect(minik.botSettings.mongo, {}).then(() => {
    console.log('[MongoDB API] ' + ' Bağlandık.')
    });
    }).catch((err) => console.log(err)
    );



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on('voiceStateUpdate', async (oldState, newState) => {////PAPAZ SAYGILAR DİLER SEVİYORUM SENİ MİLOM <3 ////PAPAZ SAYGILAR DİLER SEVİYORUM SENİ MİLOM <3 ////PAPAZ SAYGILAR DİLER SEVİYORUM SENİ MİLOM <3
    try {
        // Özel oda için kullanılacak butonlar oluşturuluyor
        const papazbutton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('user-ekle')
                    .setLabel(`User Ekle`)
                    .setStyle(Discord.ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('user-cıkar')
                    .setLabel(`User Çıkar`)
                    .setStyle(Discord.ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('oda-isim')
                    .setLabel(`Oda Adı Değiştir`)
                    .setStyle(Discord.ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('oda-sil')
                    .setLabel(`Özel Odanı Sil`)
                    .setStyle(Discord.ButtonStyle.Secondary)
            );

        const papazbutton2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('oda-kilit')
                    .setLabel(`Odayı Kilitle`)
                    .setStyle(Discord.ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setEmoji('👥')
                    .setCustomId('oda-limit')
                    .setLabel(`Oda Limiti Değiştir`)
                    .setStyle(Discord.ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('sesten-at')
                    .setLabel(`Sesten At`)
                    .setStyle(Discord.ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('oda-herkes')
                    .setLabel(`Odayı Herkese Aç`)
                    .setStyle(Discord.ButtonStyle.Secondary)
            );

        const papazbutton3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji('❓')
                    .setCustomId('oda-bilgi')
                    .setLabel(`Oda Bilgisi`)
                    .setStyle('Primary')
            );

        // Kullanıcının özel odasıyla ilgili veriler alınıyor
        let data = minik.db.get(`özeloda_${newState.member.id}`);

        // Kullanıcının belirli bir kanala katılması kontrol ediliyor
        if (newState.channelId === minik.kanal.ozeloda) {
            if (!data) {
                // Yeni kullanıcı için özel oda oluşturuluyor
                let odaisim = newState.member.displayName.length > 10 ? newState.member.displayName.substring(0, 10).trim() + ".." : newState.member.displayName;
                let papaz = await newState.guild.channels.create({
                    name: odaisim,
                    type: ChannelType.GuildVoice,
                    parent: minik.kanal.ozelodakategori,
                    userLimit: 1,
                    permissionOverwrites: [{
                        id: newState.member.id,
                        allow: [
                            PermissionFlagsBits.Connect,
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.MuteMembers,
                            PermissionFlagsBits.DeafenMembers,
                            PermissionFlagsBits.Stream,
                            PermissionFlagsBits.Speak
                        ],
                        deny: [PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: newState.guild.id,
                        deny: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.Connect,
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.MuteMembers,
                            PermissionFlagsBits.DeafenMembers,
                            PermissionFlagsBits.Stream,
                            PermissionFlagsBits.Speak
                        ]
                    }]
                });

                // Kullanıcıyı oluşturulan özel odaya taşı
                await newState.member.voice.setChannel(papaz.id);

                // Veritabanına özel oda bilgilerini kaydet
                await minik.db.set(`özeloda_${newState.member.id}`, papaz.id);
                await minik.db.set(`${papaz.id}`, `${newState.member.id}`);
                await minik.db.push(`members_${papaz.id}`, newState.member.id);

                // Kanal adıyla ilgili bilgi al
                const channelToSend = client.channels.cache.find(x => x.name === odaisim);
                if (channelToSend) {
                    await channelToSend.send({
                        content: `<@${newState.member.id}> Selam, özel odanı bu butonlardan yönetebilirsin.`,
                        components: [papazbutton, papazbutton2, papazbutton3]
                    });
                } else {
                    console.error(`Kanal bulunamadı: ${odaisim}`);
                }
            } else {
                // Kullanıcının zaten bir özel odası varsa, odaya katıl
                let channel = newState.guild.channels.cache.get(data);
                if (channel) {
                    await newState.member.voice.setChannel(channel.id);
                } else {
                    console.error(`Kayıtlı özel oda bulunamadı: ${data}`);
                }
            }
        }
    } catch (error) {
        console.error('voiceStateUpdate olayında bir hata oluştu:', error);
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on('interactionCreate', async (interaction) => {
   
let value = interaction.customId;
if(interaction.isButton()){

if(value == "oda-oluştur"){
   let data = minik.db.get(`özeloda_${interaction.member.id}`)
   if(data)return interaction.reply({content:`Zaten Odanız Bulunmakta!`,ephemeral:true})

   const papazModal = new ModalBuilder()
   .setCustomId('oda-create')
   .setTitle("Özel Oda Oluştur")

    let odaisim = new TextInputBuilder()
   .setCustomId('oda-adı')
   .setPlaceholder(`Minik Secret Room`)
   .setLabel("Odanızın Adı Ne Olsun?")
   .setStyle(TextInputStyle.Short)
   .setMinLength(2)
   .setMaxLength(10)
   .setRequired(true)
    let odalimit = new TextInputBuilder()
   .setCustomId('oda-limit')
   .setPlaceholder('(1 - 99)')
   .setLabel("Odanız Kaç Kişilik Olsun?")
   .setStyle(TextInputStyle.Short)
   .setMinLength(1)
   .setMaxLength(2)
   .setRequired(true)
    
   const name = new ActionRowBuilder().addComponents(odaisim);
   const limit = new ActionRowBuilder().addComponents(odalimit);
   papazModal.addComponents(name,limit);

await interaction.showModal(papazModal);

}else if(value == "user-ekle"){
let data = minik.db.get(`özeloda_${interaction.member.id}`)
if(!data)return interaction.reply({content:`Odanız bulunmamakta!`,ephemeral:true})

const papazModal = new ModalBuilder()
   .setCustomId('user-add')
   .setTitle("Özel Oda Sistemi")

    let kisi = new TextInputBuilder()
   .setCustomId('kisi')
   .setPlaceholder(`1143638421257072661`)
   .setLabel("Bir Kullanıcı ID'si Belirtin")
   .setStyle(TextInputStyle.Short)
   .setMinLength(5)
   .setMaxLength(25)
   .setRequired(true)
    
   const kisirow = new ActionRowBuilder().addComponents(kisi);
   papazModal.addComponents(kisirow);

await interaction.showModal(papazModal);

}else if(value == "user-cıkar"){
   let data = minik.db.get(`özeloda_${interaction.member.id}`)
   if(!data)return interaction.reply({content:`Odanız Bulunmamakta!`,ephemeral:true})
   
   const papazModal = new ModalBuilder()
       .setCustomId('user-substr')
       .setTitle("Özel Oda Sistemi")
   
        let kisi = new TextInputBuilder()
       .setCustomId('kisi')
       .setPlaceholder(`1143638421257072661`)
       .setLabel("Kullanıcı ID'si Belirtin")
       .setStyle(TextInputStyle.Short)
       .setMinLength(5)
       .setMaxLength(25)
       .setRequired(true)
        
       const kisirow = new ActionRowBuilder().addComponents(kisi);
       papazModal.addComponents(kisirow);
   
   await interaction.showModal(papazModal);
   
   }else if(value == "oda-bilgi"){
       let data = minik.db.get(`özeloda_${interaction.member.id}`)
       if(!data)return interaction.reply({content:`Odanız Bulunmamakta!`,ephemeral:true})
       
       let channel = interaction.guild.channels.cache.get(data)
       let users = minik.db.get(`members_${data}`)
          
interaction.reply({content:
`\`\`\`fix
${users ? users.map((papaz,n) => `${n+1}).${interaction.guild.members.cache.get(papaz).user.tag}`).join(", ") : "Bulunamadı"}
\`\`\``,ephemeral:true})
       }else if(value == "oda-isim"){
       let data = minik.db.get(`özeloda_${interaction.member.id}`)
       if(!data)return interaction.reply({content:`Odanız Bulunmamakta!`,ephemeral:true})
       
       const papazModal = new ModalBuilder()
       .setCustomId('oda-name')
       .setTitle("Özel Oda Sistemi")
   
        let odaisim = new TextInputBuilder()
       .setCustomId('oda-adı')
       .setPlaceholder(`Minik Secret Room`)
       .setLabel("Oda Adı Belirtin")
       .setStyle(TextInputStyle.Short)
       .setMinLength(2)
       .setMaxLength(10)
       .setRequired(true)

       const name = new ActionRowBuilder().addComponents(odaisim);
       papazModal.addComponents(name);
       await interaction.showModal(papazModal);

   }else if(value == "oda-sil"){
       let data = minik.db.get(`özeloda_${interaction.member.id}`)
       if(!data)return interaction.reply({content:`Bir Özel Odan Bulunmamakta!`,ephemeral:true})
       let channel = interaction.guild.channels.cache.get(data);
       interaction.reply({content:`Özel Odanız Siliniyor.`,ephemeral:true})
       channel.delete({reason:`Oda Sahibi Tarafından Silindi`})
       minik.db.delete(`members_${data}`)
       minik.db.delete(`${data}`)
       minik.db.delete(`özeloda_${interaction.member.id}`)
   }else if(value == "sesten-at"){
           let data = minik.db.get(`özeloda_${interaction.member.id}`)
           if(!data)return interaction.reply({content:`Odanız Bulunmamakta!`,ephemeral:true})

       const papazModal = new ModalBuilder()
       .setCustomId('user-dis')
       .setTitle("Özel Oda Sistemi")
   
        let kisi = new TextInputBuilder()
       .setCustomId('kisi')
       .setPlaceholder(`1143638421257072661`)
       .setLabel("Kullanıcı ID'si Belirtin")
       .setStyle(TextInputStyle.Short)
       .setMinLength(5)
       .setMaxLength(25)
       .setRequired(true)
        
       const kisirow = new ActionRowBuilder().addComponents(kisi);
       papazModal.addComponents(kisirow);
       await interaction.showModal(papazModal);
   }else if(value == "oda-kilit"){
           let data = minik.db.get(`özeloda_${interaction.member.id}`)
           if(!data)return interaction.reply({content:`Odanız Bulunmamakta!`,ephemeral:true})
           let channel = interaction.guild.channels.cache.get(data);
           channel.permissionOverwrites.edit(interaction.guild.roles.everyone,{
               Connect:false,
               SendMessages:false,
               ViewChannel:false,
               Stream:false,
               Speak:false
           });
           interaction.reply({content:`Odanız Başarıyla Herkese Kapatıldı!`,ephemeral:true})
       }else if(value == "oda-herkes"){
           let data = minik.db.get(`özeloda_${interaction.member.id}`)
           if(!data)return interaction.reply({content:`Odanız Bulunmamakta!`,ephemeral:true})
           let channel = interaction.guild.channels.cache.get(data);
           channel.permissionOverwrites.edit(interaction.guild.roles.everyone,{
               Connect:true,
               SendMessages:false,
               ViewChannel:true,
               Stream:true,
               Speak:true
           });
           interaction.reply({content:`Odanız Başarıyla Herkese Açıldı!`,ephemeral:true})
       }else if(value == "oda-limit"){
           let data = minik.db.get(`özeloda_${interaction.member.id}`)
           if(!data)return interaction.reply({content:`Odanız Bulunmamakta!`,ephemeral:true})

           const papazModal = new ModalBuilder()
           .setCustomId('oda-sayı')
           .setTitle("Özel Oda Sistemi")
       
            let kisi = new TextInputBuilder()
           .setCustomId('limit')
           .setPlaceholder(`Limiti Giriniz (1-99)`)
           .setLabel("Bir Oda Limiti Belirtin")
           .setStyle(TextInputStyle.Short)
           .setMinLength(1)
           .setMaxLength(2)
           .setRequired(true)
            
           const kisirow = new ActionRowBuilder().addComponents(kisi);
           papazModal.addComponents(kisirow);
           await interaction.showModal(papazModal);
       }

}



if(interaction.isModalSubmit()){

if(value == "oda-create"){
   const papazbutton  = new ActionRowBuilder()
   .addComponents(
   new ButtonBuilder()
   .setCustomId('user-ekle')
   .setLabel(`User Ekle`)
   .setStyle(Discord.ButtonStyle.Secondary),
   new ButtonBuilder()
   .setCustomId('user-cıkar')
   .setLabel(`User Çıkar`)
   .setStyle(Discord.ButtonStyle.Secondary),
   new ButtonBuilder()
   .setCustomId('oda-isim')
   .setLabel(`Oda Adı Değiştir`)
   .setStyle(Discord.ButtonStyle.Secondary),
   new ButtonBuilder()
   .setCustomId('oda-sil')
   .setLabel(`Özel Odanı Sil`)
   .setStyle(Discord.ButtonStyle.Secondary))

   const papazbutton2 = new ActionRowBuilder()
   .addComponents(
       new ButtonBuilder()
           .setCustomId('oda-kilit')
           .setLabel(`Odayı Kilitle`)
           .setStyle(Discord.ButtonStyle.Secondary),
           new ButtonBuilder()
           .setEmoji('👥')
           .setCustomId('oda-limit')
           .setLabel(`Oda Limiti Değiştir`)
           .setStyle(Discord.ButtonStyle.Secondary),
           new ButtonBuilder()
           .setCustomId('sesten-at')
           .setLabel(`Sesten At`)
           .setStyle(Discord.ButtonStyle.Secondary),
           new ButtonBuilder()
           .setCustomId('oda-herkes')
           .setLabel(`Odayı Herkese Aç`)
           .setStyle(Discord.ButtonStyle.Secondary))

           const papazbutton3 = new ActionRowBuilder()
           .addComponents(
               new ButtonBuilder()
                   .setEmoji('❓')
                   .setCustomId('oda-bilgi')
                   .setLabel(`Oda Üyeleri`)
                   .setStyle(Discord.ButtonStyle.Primary))
var name = interaction.fields.getTextInputValue('oda-adı');
var limit = interaction.fields.getTextInputValue('oda-limit');

if(isNaN(limit)) limit = 1;
if(limit < 0) limit = 0;
if(limit > 99) limit = 99;

interaction.guild.channels.create({
       name: `${name}`,
       type: ChannelType.GuildVoice,
       parent: minik.kanal.ozelodakategori,
       userLimit: limit,
       permissionOverwrites: [{id: interaction.member.id,
       allow: [PermissionFlagsBits.Connect,PermissionFlagsBits.ViewChannel, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers,PermissionFlagsBits.Stream,PermissionFlagsBits.Speak],
       deny: [PermissionFlagsBits.SendMessages]
       }, 
       {
       id: interaction.guild.id,
       deny: [PermissionFlagsBits.SendMessages,PermissionFlagsBits.Connect,PermissionFlagsBits.ViewChannel, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers,PermissionFlagsBits.Stream,PermissionFlagsBits.Speak]
       }]
   }).then(async (papaz) => {
       let invite = await papaz.createInvite({maxUses: 1});
       await interaction.reply({content:`Odanız Başarıyla Açıldı!`,ephemeral:true})
       await minik.db.set(`özeloda_${interaction.member.id}`,`${papaz.id}`)
       await minik.db.set(`${papaz.id}`,`${interaction.member.id}`)
       await minik.db.push(`members_${papaz.id}`,interaction.member.id)
       await minik.channels.cache.find(x => x.name == `${name}`).send({content:`<@${interaction.member.id}> Selam, özel odanı bu butonlardan yönetebilirsin.`,components:[papazbutton,papazbutton2,papazbutton3]})
       })

}else if(value == "user-add"){
   var userID = interaction.fields.getTextInputValue('kisi');
   let member = interaction.guild.members.cache.get(userID)
   if(!member)return interaction.reply({content:`> **Sunucuda Böyle Bir Kullanıcı Bulunmamakta!**`,ephemeral:true})
   let data = await minik.db.get(`özeloda_${interaction.member.id}`)
   let channel = interaction.guild.channels.cache.get(data);
   channel.permissionOverwrites.edit(member,{
       Connect:true,
       ViewChannel:true,
       Stream:true,
       Speak:true
   });
   let invite = channel.createInvite({maxUses: 1});
   member.user.send({content:`> **${interaction.user.username} Kullanıcısı Seni Özel Odasına Ekledi!**\n> **Odaya Katıl;** ${invite.code}`}).catch(e => { });
   client.db.push(`members_${data}`,member.id)
   interaction.reply({content:`> **${member} Kullanıcısı Kanala Başarıyla Eklendi!**`, ephemeral:true})

}else if(value == "user-substr"){
   var userID = interaction.fields.getTextInputValue('kisi');
   let member = interaction.guild.members.cache.get(userID)
   if(!member)return interaction.reply({content:`> **Sunucuda Böyle Bir Kullanıcı Bulunmamakta!**`,ephemeral:true})
   let data = await minik.db.get(`özeloda_${interaction.member.id}`)
   let channel = interaction.guild.channels.cache.get(data);
   channel.permissionOverwrites.edit(member,{
       Connect:false,
       ViewChannel:false,
       Stream:false,
       Speak:false
   });
   client.db.pull(`members_${data}`,(element, index, array) => element == member.id, true)
   interaction.reply({content:`> **${member} Kullanıcısı Kanaldan Başarıyla Çıkartıldı!**`,ephemeral:true})
}else if(value == "oda-name"){
   var isim = interaction.fields.getTextInputValue('oda-adı');
   let data = await minik.db.get(`özeloda_${interaction.member.id}`)
   interaction.guild.channels.edit(data,{name:`#${isim}`});
   interaction.reply({content:`> **Oda Adı Başarıyla \`${isim}\` Olarak Değiştirildi!**`,ephemeral:true})
}else if(value == "user-dis"){
   let data = minik.db.get(`özeloda_${interaction.member.id}`)
   var kisi = interaction.fields.getTextInputValue('kisi');
   let channel = interaction.guild.channels.cache.get(data);
   interaction.guild.members.fetch(kisi).then(papaz => {
   if (papaz.voice.channel.id !== channel.id) return interaction.reply({content:`> **Belirtilen Üye Özel Oda Kanalında Bulunmamakta!**`, ephemeral:true })
   interaction.reply({content:`> **${papaz} Ses Kanalından Başarıyla Atıldı!**`, ephemeral: true })
   papaz.voice.disconnect()
   }, err => { interaction.reply({content:`> **Böyle Bir Kullanıcı Bulunmamakta!**`,ephemeral:true})})
   }else if(value == "bit-hız"){
       let data = minik.db.get(`özeloda_${interaction.member.id}`)
       var bit = interaction.fields.getTextInputValue('bit');
       if(isNaN(bit))bit = 96;
       if(bit > 96) bit = 96;
       if(bit < 8) bit = 8;
       let channel = interaction.guild.channels.cache.get(data);
       channel.setBitrate(bit + `_000`)
       interaction.reply({content:`> **Özel Odanın Bit Hızı Başarıyla \`${bit}\` Olarak Ayarlandı!**`,ephemeral:true})
       }else if(value == "oda-sayı"){
           let data = minik.db.get(`özeloda_${interaction.member.id}`)
           var sayı = interaction.fields.getTextInputValue('limit');
           if(isNaN(sayı))sayı = 99;
           if(sayı > 99) sayı = 99;
           if(sayı < 0) sayı = 0;
           let channel = interaction.guild.channels.cache.get(data);
           channel.setUserLimit(sayı)
           interaction.reply({content:`> **Özel Odanın Kişi Sayısı Başarıyla \`${sayı == 0 ? "Sınırsız": sayı}\` Olarak Ayarlandı!**`,ephemeral:true})
           }}
  }
);

////PAPAZ SAYGILAR DİLER SEVİYORUM SENİ MİLOM <3

////PAPAZ SAYGILAR DİLER SEVİYORUM SENİ MİLOM <3

////PAPAZ SAYGILAR DİLER SEVİYORUM SENİ MİLOM <3


