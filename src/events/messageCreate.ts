import { userMention } from "discord.js";
import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import { Dialog } from "../assets/Dialog.js";
import { db, stringFormatter } from "../main.js";


@Discord()
export class Example {
  @On({ event: "messageCreate" })
  async handleMessageCreate([message]: ArgsOf<"messageCreate">, client: Client): Promise<void> {
    if (!message.guild) {
      // FIXME
      await message.author.send(Dialog.meow());
      return;
    }

    if (message.channelId === "819319306139205692") {
      message.react('\u2705');
      message.react('\u274c');
    }

    if (message.mentions.users.has(client.user?.id!)) {
      if (message.content.toLowerCase().includes('what do we do around here?')) {
        await message.channel.send(
          message.member?.displayName + stringFormatter.format(`, sometimes we do a *little trolling* in these parts.`)
        );
      }
      else {
        message.react(message.guild?.emojis.cache.random()!);
      }
    }

    if (message.content.toLowerCase().includes("psps")) {
      await message.channel.send(Dialog.meow());
    }

    var amount = 1;
    if (message.attachments.size > 0) amount += 5;
    if (message.mentions.members && message.mentions.members?.size > 0) amount += 1;

    db.run("UPDATE users SET message_count=message_count+1, exp=exp+$amount WHERE id=$id",
      {
        $amount: amount,
        $id: message.author.id
      },
      (err: Error | null) => {
        if (err) throw err;
      });
  }
}
