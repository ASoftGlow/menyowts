import {
  CommandInteraction,
  GuildMember,
} from "discord.js";
import {
  ApplicationCommandOptionType,
} from "discord.js";
import { Discord, Slash, SlashOption, SlashChoice } from "discordx";
import { db } from './../main.js';


@Discord()
export class Example {
  @Slash({
    name: "_set",
    description: "Admin only",
    defaultMemberPermissions: "Administrator"
  })
  async set(
    @SlashOption({
      name: "member",
      description: "member",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    member: GuildMember,

    @SlashOption({
      name: "value",
      description: "value",
      required: true,
      type: ApplicationCommandOptionType.Number
    })
    value: number,

    @SlashChoice(
      'coins', 'message_count', 'level',
      'exp', 'job_id', 'rank', 'warnings',
      'daily_cooldown', 'weekly_cooldown',
      'job_task_cooldown', 'new_job_cooldown',
      'correct_trivia', 'incorrect_trivia',
      'threads', 'trivia_streak', 'stock'
    )
    @SlashOption({
      name: "column",
      description: "column",
      required: true,
      type: ApplicationCommandOptionType.String
    })
    column: string,

    @SlashOption({
      name: 'add',
      description: 'Whether to add to current value, in the case of numbers.',
      type: ApplicationCommandOptionType.Boolean,
      required: false
    })
    add: boolean,

    interaction: CommandInteraction
  ): Promise<void> {
    if (interaction.user.id !== "774980691016024085") return;
    if (add === undefined) add = false;

    // This is a terrible idea. Don't do this.
    db.run(`UPDATE users SET ${column}=${add ? `${column}+` : ''}$value WHERE id=$id`,
      {
        $value: value,
        $id: member.id
      },
      (err: Error | null) => {
        if (err) {
          interaction.reply(err.name + ': ' + err.message);
          return;
        }

        db.get(`SELECT ${column} FROM users WHERE id=?`, [member.id], (err: Error | null, row: any) => {
          if (row === undefined) {
            interaction.reply("Returned undefined.");
            return;
          }

          interaction.reply({
            content: (add ?
              `Added ${value} to ${column}` :
              `Set ${column} to ${value}`)
              + `; now ${row[column]}.`
          });
        });
      });
  }
}
