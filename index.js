require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// slash command list
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if the fledgling is listening.')
].map(c => c.toJSON());

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log('✅ Slash commands registered for House Noctis');
}

client.once('ready', () => {
  console.log(`🟢 Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'serving the Vampiress • House Noctis' }],
    status: 'online'
  });
});

client.on('interactionCreate', async (ix) => {
  if (!ix.isChatInputCommand()) return;
  if (ix.commandName === 'ping') {
    await ix.reply({ content: 'Yes, Mistress. I am listening.', ephemeral: true });
  }
});

registerCommands()
  .then(() => client.login(process.env.TOKEN))
  .catch(console.error);
