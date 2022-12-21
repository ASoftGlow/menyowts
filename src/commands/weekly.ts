import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember
} from "discord.js";
import {
  time,
  TimestampStyles
} from "discord.js";
import { Discord, Slash } from "discordx";
import { db, stringFormatter } from './../main.js';
import { UsersTableRow, ItemsTableRow } from '../assets/DatabaseTypes.js';
import { Items } from '../assets/Items.js';
import { Emojis } from '../assets/Emojis.js';
import { levelupCheck } from '../utils/LevelupChecks.js';


@Discord()
export class Example {
  @Slash({
    description: "Collect your weekly rewards",
    name: "weekly",
  })
  async weekly(
    interaction: CommandInteraction
  ): Promise<void> {

    const cd = 60 * 60 * 24 * 7 - 60 * 60 * 6; // 7 days - 6 hours
    const current_time = Math.round(Date.now() / 1000);

    db.get("SELECT coins, exp, weekly_cooldown FROM users WHERE id=?",
      [interaction.user.id],
      async (err: Error | null, row: UsersTableRow) => {
        if (err) throw err;

        if (current_time >= row.weekly_cooldown) {
          const coin = 45;

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
            async (err: Error | null, row: ItemsTableRow) => {
              if (err) throw err;

              var exp_mult: number = 1;
              if (row && row.enabled) exp_mult = 1.25;

              const exp = Math.round(40 * exp_mult);

              db.run("UPDATE users SET exp=exp+$amount, weekly_cooldown=$cd WHERE id=$id",
                {
                  $amount: exp,
                  $cd: current_time + cd,
                  $id: interaction.user.id
                }, (err: Error | null) => { if (err) throw err; });

              const embed = new EmbedBuilder()
                .setColor(2105893)
                .addFields({
                  name: (interaction.member as GuildMember).displayName + stringFormatter.format(' collected their weekly rewards.'),
                  value:
                    `${Emojis.Coin} +${coin}\n` +
                    `${Emojis.Zap} +${exp}`
                });

              await interaction.reply({
                embeds: [embed]
              });
            });

          await levelupCheck(db, (interaction.member as GuildMember));
        }
        else {
          const timestamp = time(row.weekly_cooldown, TimestampStyles.RelativeTime);
          await interaction.reply(`${(interaction.member as GuildMember).displayName}, check back ${timestamp}.`);
        }
      });
  }
}
