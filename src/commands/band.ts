import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import {
  ApplicationCommandOptionType,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { stringFormatter } from './../main.js';


@Discord()
export class Example {
  @Slash({ 
    description: "Can only be used by <@&1003471698168918106>s", 
    name: "ban"
  })
  //TODO: add role
  //TODO: cooldown
  async band(
    @SlashOption({
      name: "member",
      description: "m",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    @SlashOption({
      name: "reason",
      description: "r",
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

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: stringFormatter.format('User Band', false),
        iconURL: 'https://cdn.discordapp.com/attachments/811728406202155048/1003480603737468928/1f3a4.png' 
      })
      .setColor(0xb80000)
      .setDescription(
        stringFormatter.formatD(`User ${interaction.member?.user} has been band by ${interaction.member?.user.username}. 🎺 🥁 🎷 📯`)
      )
      .addFields([{name: stringFormatter.format('Reason:'), value: stringFormatter.formatD(reason)}])
    
    await member.voice.disconnect()
    if (member.bannable) await member.timeout(3.0, "Band - " + reason)

    interaction.editReply({
      embeds: [embed]
    });
  }
}
