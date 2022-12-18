import {
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import {
  time,
  TimestampStyles
} from "discord.js";
import { Discord, Slash } from "discordx";
import { db, stringFormatter } from './../main.js';
import { UsersTableType, ItemsTableType } from '../assets/DatabaseTypes.js';
import { Items } from '../assets/Items.js';
import { Emojis } from '../assets/Emojis.js';


@Discord()
export class Example {
  @Slash({
    description: "Collect your daily rewards",
    name: "daily",
  })
  async daily(
    interaction: CommandInteraction
  ): Promise<void> {

    const cd = 60 * 60 * 18; // 18 hours
    const current_time = Math.round(Date.now() / 1000);

    db.get("SELECT coins, exp, daily_cooldown FROM users WHERE id=?",
      [interaction.user.id],
      async (err: Error | null, row: UsersTableType) => {
        if (err) throw err;

        if (current_time >= row.daily_cooldown) {
          const coin = 30;

          db.run("UPDATE users SET coins=coins+$amount WHERE id=$id",
            {
              $amount: coin,
              $id: interaction.user.id
            },
            (err: Error | null) => { if (err) throw err; });

          // Check for exp booster
          db.get("SELECT COUNT(1) FROM items WHERE items.user_id=$id AND items.item_id=$item",
            {
              $id: interaction.user.id,
              $item: Items.Collectables.PotionOfLeaping
            },
            async (err: Error | null, row: ItemsTableType) => {
              if (err) throw err;

              var exp_mult: number = 1;
              if (row && row.enabled) exp_mult = 1.25;

              const exp = Math.round(10 * exp_mult);

              db.run("UPDATE users SET exp=exp+$amount, daily_cooldown=$cd WHERE id=$id",
                {
                  $amount: exp,
                  $cd: current_time + cd,
                  $id: interaction.user.id
                }, (err: Error | null) => { if (err) throw err; });

              const embed = new EmbedBuilder()
                .setColor(2105893)
                .addFields({
                  name: interaction.user.username + stringFormatter.format(' collected their daily rewards.'),
                  value:
                    `${Emojis.Coin} +${coin}\n` +
                    `${Emojis.Zap} +${exp}`
                });

              await interaction.reply({
                embeds: [embed]
              });
            });

          // await levelup_check(inter.author, db)
        }
        else {
          const timestamp = time(row.daily_cooldown, TimestampStyles.RelativeTime);
          await interaction.reply(`${interaction.user.username}, check back ${timestamp}.`);
        }
      });
  }
}