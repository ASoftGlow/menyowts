import { dirname, importx } from "@discordx/importer";
import { EmbedBuilder, Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { config as load_envs } from 'dotenv';
import _splite3_pkg from 'sqlite3';
import { expBar } from "./utils/ProgressBar.js";
const sqlite3 = _splite3_pkg.verbose();
import { StringFormatter, FormatterMode } from './utils/StringFormatter.js';

load_envs();


export const stringFormatter = new StringFormatter(FormatterMode.normal);

export const bot = new Client({
  // To use only guild command
  botGuilds: ['809179222551429150'],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
  ],

  // Debug logs are disabled in silent mode
  silent: true,
});

export const db = new sqlite3.Database('.\\src\\assets\\main.db');

bot.once("ready", async () => {
  // Make sure all guilds are cached
  // await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  bot.user!.setStatus('invisible');
  await bot.initApplicationCommands();

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  console.log("Bot started");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

// bot.on("messageCreate", async (message: Message) => {
//   if (message.author.id === '774980691016024085')
//     await message.reply({
//       embeds: [
//         new EmbedBuilder()
//           .setDescription(stringFormatter.formatD(
//             `${'a'} ${row.coins} \n` +
//             `${Emojis.Level} ${row.level} \n` +
//             `${Emojis.Messages} ${row.message_count} \n` +
//             `${rank.emoji} ${rank.name} \n` +
//             `${Emojis.Zap} ${expBar(row.exp, row.level)}`
//             , false))
//       ]
//     });
// });

(async () => {
  // The following syntax should be used in the commonjs environment
  //
  // await importx(__dirname + "/{events,commands}/**/*.{ts,js}");

  // The following syntax should be used in the ECMAScript environment
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  // Let's start the bot
  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  // Log in with your bot token
  await bot.login(process.env.BOT_TOKEN);
})();
