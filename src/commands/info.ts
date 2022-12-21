import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  User,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  userMention,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { UsersTableRow } from '../assets/DatabaseTypes.js';
import { ranks } from '../assets/Ranks.js';
import { expBar } from '../utils/ProgressBar.js';
import { Emojis } from '../assets/Emojis.js';
import { db, stringFormatter } from '../main.js';


@Discord()
export class Example {
  @Slash({ description: "Displays someone's information (ex. coins, rank, level, and more)", name: "info" })
  async info(
    @SlashOption({
      description: "user",
      name: "user",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    _member: GuildMember | User | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    if (_member instanceof User) return;
    if (!_member) {
      if (!interaction.member) return;
      if (interaction.member)
        _member = await interaction.guild?.members.fetch(interaction.user.id);
      if (!_member) return;
    }
    const member = _member;

    if (member.user.bot) return;

    await interaction.deferReply();

    db.get(
      "SELECT coins, message_count, level, exp, job_id, rank, correct_trivia, incorrect_trivia, trivia_streak FROM users WHERE id=?",
      (member.id),
      async (err: Error | null, row: UsersTableRow | undefined) => {
        if (err) throw err;
        if (!row) {
          await interaction.followUp(`${userMention(interaction.client.application.owner?.id!)}, ${member.id} is not in the database yet`);
          return;
        }

        const rank = ranks.get(row.rank)!;

        await interaction.followUp({
          embeds: [new EmbedBuilder()
            .setColor(member.user.accentColor ? member.user.accentColor : null)
            .setAuthor({
              name: `${member.displayName}'${member.displayName.endsWith('s') ? '' : 's'} ${stringFormatter.format('Info')}`,
              iconURL: member.avatarURL() ? member.avatarURL()! : member.user.avatarURL()!
            })
            .setDescription(stringFormatter.formatD(
              `${Emojis.Coin} ${row.coins} \n` +
              `${Emojis.Level} ${row.level} \n` +
              `${Emojis.Messages} ${row.message_count} \n` +
              `${rank.emoji} ${rank.name} \n` +
              `${Emojis.Zap} ${expBar(row.exp, row.level)}`
              , false))

            // # t_total = q[6] + q[7]
            // # t_correct = q[6]

            // # if t_total == 0:
            // #     if t_correct == 0:
            // #         t_ratio = 0
            // #     else:
            // #         t_ratio = 1
            // # else:
            // #     t_ratio = round(q[6] / (q[6] + q[7]), 3);

            .addFields({
              name: stringFormatter.format('Trivia'),
              value: stringFormatter.format(
                `Correct: ${row.correct_trivia}\n` +
                `Incorrect: ${row.incorrect_trivia}\n` +
                `Streak: ${row.trivia_streak}\n`
              )
            })
          ]
        });
      }
    );
  }
}

// if member.bot:
//     await inter.response.send_message(go_away())
//     return
