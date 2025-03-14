module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        console.log(`🔹 Event triggered: interactionCreate`);

        if (!interaction.isCommand()) return;
        console.log(`🔹 Command received: ${interaction.commandName}`);

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`❌ Command not found: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction, client);
            console.log(`✅ Successfully executed: ${interaction.commandName}`);
        } catch (error) {
            console.error(`❌ Error executing "${interaction.commandName}":`, error);
            await interaction.reply({ content: '❌ Command failed!', ephemeral: true });
        }
    },
};
