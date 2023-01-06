import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import { EmbedBuilder } from 'discord.js';
import { ranks } from "../assets/Ranks.js";
import { db, stringFormatter } from "../main.js";


@Discord()
export class Example {
  @On({event: "guildMemberAdd"})
  handleGuildMemberAdd([member]: ArgsOf<"guildMemberAdd">, client: Client): void {
    if (member.user.bot) return;

    db.get("EXISTS(SELECT COUNT(1) FROM users WHERE id=?)",
      [member.id],
      async (err: Error | null, exists: boolean) => {
        if (err) throw err;

        if (exists) {
          const role = member.guild.roles.cache.get(ranks.get(0)?.roleID!)!; //'Fluff'
          await member.roles.add(role);

          const embed = new EmbedBuilder()
            .setColor(0xc39341)
            .setThumbnail(member.avatarURL({ size: 256 }))
            .setTitle(member.displayName + stringFormatter.format(` has been recruited!`));

          await member.guild.systemChannel?.send({
            embeds: [embed]
          });

          db.run("INSERT INTO users (id, rank) VALUES(?, 0)",
            [member.id],
            (err: Error | null) => {
              if (err) throw err;
            });
        }
        else {
          const embed = new EmbedBuilder()
            .setColor(0xc39341)
            .setThumbnail(member.avatarURL({ size: 256 }))
            .setTitle(stringFormatter.format(`Welcome back, `, false) + member.displayName + stringFormatter.format('!'));

          await member.guild.systemChannel?.send({
            embeds: [embed]
          });
        }
      });
  }
}