import { dirname, importx } from "@discordx/importer";
import { GuildMember, Interaction, InteractionType } from "discord.js";
import { IntentsBitField, Message, EmbedBuilder } from "discord.js";
import { Client } from "discordx";
import { config as load_envs } from 'dotenv';
import __splite3_pkg from 'sqlite3';
const sqlite3 = __splite3_pkg.verbose();
import { levelupCheck } from "./utils/LevelupChecks.js";
import { StringFormatter, FormatterMode } from './utils/StringFormatter.js';
load_envs();


export const stringFormatter = new StringFormatter();

export const client = new Client({
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

/**SQLite Database */
export const db = new sqlite3.Database('main.db');

client.once("ready", async () => {
  // Make sure all guilds are cached
  // await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  client.user!.setStatus('dnd');
  await client.initApplicationCommands();

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  console.log("Bot started");
});

client.on("interactionCreate", (interaction: Interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    db.run("UPDATE users SET exp=exp+1 WHERE id=$id",
      {
        $id: interaction.user.id
      },
      async (err: Error | null) => {
        if (err) throw err;
        await levelupCheck(db, (interaction.member as GuildMember));
      });
  }

  client.executeInteraction(interaction);
});


client.on("emojiCreate", (emoji) => {
  const member = emoji.guild.members.cache.get(emoji.author?.id!);
  db.run("UPDATE users SET exp=exp+10 WHERE id=$id",
    {
      $id: emoji.author?.id!
    },
    async (err: Error | null) => {
      if (err) throw err;
      await levelupCheck(db, member!);
    });
});

client.on("inviteCreate", async (invite) => {
  const me = client.users.cache.get("774980691016024085")!;
  await me.send(`${invite.inviter?.username} has created an invite!`);
});

client.on("messageReactionAdd", (reaction, user) => {
  console.log('a');
  if (!reaction.message.guild) return;
  const member = reaction.message.guild.members.cache.get(user.id);
  console.log('b');
  db.run("UPDATE users SET exp=exp+1 WHERE id=$id",
    {
      $id: user.id
    },
    async (err: Error | null) => {
      if (err) throw err;
      console.log(member?.nickname);
      await levelupCheck(db, member!);
    });
});

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
  await client.login(process.env.BOT_TOKEN);
})();
