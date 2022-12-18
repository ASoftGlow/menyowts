import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  User,
} from "discord.js";
import {
  ApplicationCommandOptionType,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { db, stringFormatter } from './../main.js'


@Discord()
export class Example {
  @Slash({ 
    description: "Warns a user and increments their warn count", 
    name: "warn",
    defaultMemberPermissions: "Administrator"
  })
  async warn(
    @SlashOption({
      name: "member",
      description: "Recipient of warn",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    @SlashOption({
      name: "reason",
      description: "Defaults to \"None\"",
      required: false,
      type: ApplicationCommandOptionType.String,
      maxLength: 128
    })
    member: GuildMember,
    reason: string | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    if (!reason) reason = "None"

    db.run("UPDATE users SET warnings=warnings+1 WHERE id=?", [member.id])

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: stringFormatter.format('User Warned'),
        iconURL: 'https://media.disnakeapp.net/attachments/626843115650547743/912508572498280488/icon.png' 
      })
      .setColor(0xb80000)
      .setDescription(
        stringFormatter.formatD(`User ${member.user} has been warned by ${interaction.member?.user.username}.`)
      )
      .addFields([{name: stringFormatter.format('Reason:'), value: stringFormatter.formatD(reason)}])

    interaction.editReply({
      embeds: [embed]
    });
  }
}
