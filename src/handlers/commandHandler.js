const { Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs'); 
const { useCmd } = require('../functions/usecmd');
const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));
const commandMap = new Collection();

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    if (command.data) {
        commandMap.set(command.data.name, command);
        console.log(`Yüklendi: ${command.data.name}`);
    } else {
        console.log(`Hata: ${file} dosyasında komut bilgileri eksik.`);
    }
    //console.log(`Toplamda ${commandFiles.length} komut yüklendi.`);
}



module.exports = {
    commandMap: commandMap,
    handleCommand: async (interaction) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        const command = commandMap.get(commandName);
        try {
            if (command) {
                await command.execute(interaction);
            } else {
                await interaction.reply({ content: 'Unknown command!', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
