import { Client, Events, GatewayIntentBits, PermissionFlagsBits } from 'discord.js';
import { config } from './config.js';

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildBans,
  ]
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('!ping')) {
    await message.reply('Pong! 🏓');
  }

  if (message.content.startsWith('!hello')) {
    await message.reply(`Hello, ${message.author.username}!`);
  }
});

// Store welcome channels and their associated members for reaction handling
const welcomeChannels = new Map();

client.on(Events.GuildMemberAdd, async member => {
  console.log(`New member joined: ${member.user.username}`);
  // create a channel with name of the user and access to only the user and admins
  const channel = await member.guild.channels.create({
    name: member.user.username + '-welcome',
    type: 0, // text channel
    permissionOverwrites: [
      {
        id: member.guild.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: member.id,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      // Allow admins to view the channel
      {
        id: "1369077365946449920",
        allow: [PermissionFlagsBits.ViewChannel],
      }
    ],
  });

  const welcomeMessage = await channel.send(`Welcome to the server, ${member.user.username}! Please introduce yourself, and an admin will approve your membership.`);

  // Store the welcome channel and member info
  welcomeChannels.set(channel.id, {
    memberId: member.id,
    welcomeMessageId: welcomeMessage.id
  });

  client.on(Events.MessageCreate, async newMessage => {
    if (newMessage.channel.id === channel.id && !newMessage.author.bot && newMessage.author.id === member.id) {
      // This is a message from the new member in their welcome channel
      // Add a check reaction to the message for admin approval
      await newMessage.react('✅');
    }
  });
});

// Handle reaction events for admin approval
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  // Ignore bot reactions
  if (user.bot) return;

  // Partial reactions need to be fetched to access their data
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the reaction:', error);
      return;
    }
  }

  // Get the channel and check if it's a welcome channel
  const channel = reaction.message.channel;
  const welcomeChannelData = welcomeChannels.get(channel.id);

  if (!welcomeChannelData) return;

  // Check if the reaction is the check mark
  if (reaction.emoji.name === '✅') {
    // Fetch the guild member who reacted
    const guild = reaction.message.guild;

    if (!guild) return;

    const member = await guild.members.fetch(user.id);

    // Check if the user who reacted has the Admin role
    if (member.roles.cache.some(role => role.id === '1369077365946449920')) {
      // Get the new member to approve
      const newMember = await guild.members.fetch(welcomeChannelData.memberId);

      // Add the Membre role to the new member
      const membreRole = guild.roles.cache.find(role => role.name === 'Membre');
      if (membreRole) {
        await newMember.roles.add(membreRole);
      } else {
        console.error('Membre role not found');
      }

      // Send a message to the presentation channel
      const presentationChannel = guild.channels.cache.find(ch => ch.name === 'présentation');
      if (presentationChannel && presentationChannel.type === 0) {
        // Get the introduction message (the one that was reacted to)
        const introMessage = reaction.message.content;

        await presentationChannel.send(`New member approved: ${newMember.user.username} - ${introMessage}`);
      } else {
        console.error('Presentation channel not found');
      }

      if (channel && channel.type === 0) {
        // Send a message to the channel that the member has been approved
        await channel.send(`Congratulations ${newMember.user.username}! You've been approved by ${member.user.username} and given the Membre role.`);
      }

      // Wait a moment before deleting the channel
      setTimeout(async () => {
        try {
          await channel.delete();
          // Remove this channel from our Map
          welcomeChannels.delete(channel.id);
        } catch (error) {
          console.error('Error deleting channel:', error);
        }
      }, 5000); // 5 seconds delay before deletion
    }
  }
});

client.login(config.token).then(() => {
  console.log('Start successfully!');
}).catch(err => {
  console.error('Failed to log in:', err);
});