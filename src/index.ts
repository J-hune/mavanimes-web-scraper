import {CronJob} from 'cron'
import {check, sendMessage} from "./functions";
import settings, {ChannelID, GuildID} from './settings.json'
import {Client, Events, GatewayIntentBits, Guild, GuildBasedChannel} from "discord.js";

// If the parameters are not valid the app is stopped
if (!settings.token || !settings.timeBetweenEachCall || !settings.ChannelID || !settings.GuildID) {
   console.error("Error: Please complete the settings (settings.json) before continuing")
   process.exit(1);
}

// Creation of a new Discord client
const client = new Client({intents: [GatewayIntentBits.Guilds]});

// Add an event listener to warn that the bot is online
client.once(Events.ClientReady, c => {
   console.log(`Ready! Logged in as ${c.user.tag}`);
});


// Add a cron job that will call check function  every x minutes.
// x is the "timeBetweenEachCall" parameter
new CronJob(
    '*/' + settings.timeBetweenEachCall + ' * * * *',
    async function () {
       try {
          const guild: Guild = await client.guilds.fetch(GuildID)
          const channel: GuildBasedChannel | null = await guild.channels.fetch(ChannelID)
          check((anime) => sendMessage(client, anime, guild, channel))
       } catch (e) {
          console.error("Error: Invalid Guild or Channel")
          process.exit(1)
       }
    },
    null,
    true,
    'Europe/Paris'
);

client.login(settings.token);