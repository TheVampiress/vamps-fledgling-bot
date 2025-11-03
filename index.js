// tiny keep-alive server (Render/Replit friendly)
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Vamp’s Fledgling is awake.'));
app.listen(3000, () => console.log('🩸 Web server running on 3000'));

require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
} = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
});

// simple slash commands to prove it works
const commands = [
  {
    name: 'ping',
    description: 'Check if Vamp’s Fledgling is alive.',
  },
  {
    name: 'welcome',
    description: 'Send the welcome embed.',
  },
];

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
  console.log('🦇 Slash commands registered.');
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'serving the Vampiress • House Noctis' }],
    status: 'online',
  });
});

client.on('interactionCreate', async (ix) => {
  if (!ix.isChatInputCommand()) return;

  if (ix.commandName === 'ping') {
    return ix.reply({ content: 'Yes, Mistress. I am awake.', ephemeral: true });
  }

  if (ix.commandName === 'welcome') {
    return ix.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x8b0000)
          .setTitle('House Noctis')
          .setDescription(
            'Welcome. Read the Rules, then complete verification. Disobedience is… corrected.'
          )
          .setFooter({ text: 'Fledgling of the Vampiress 🩸' }),
      ],
      ephemeral: true,
    });
  }
});

registerCommands()
  .then(() => client.login(TOKEN))
  .catch(console.error);
