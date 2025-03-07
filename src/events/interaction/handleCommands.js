module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            // Check if the command needs deferring (adjust per command)
            if (command.defer) await interaction.deferReply();

            // Execute the command
            await command.execute(interaction);

        } catch (error) {
            console.error('Error executing command:', error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: '❌ There was an error executing that command!', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ There was an error executing that command!', ephemeral: true });
            }
        }
    },
};
