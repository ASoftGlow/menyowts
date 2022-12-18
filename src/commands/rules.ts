import {
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Discord, Slash } from "discordx";
import { RULES } from '../assets/Rules.js';
import { stringFormatter } from './../main.js';


@Discord()
export class Example {
  @Slash({ description: "Sends a list of server rules", name: "rules" })
  async rules(
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    let icon_url: string | null | undefined = interaction.guild?.iconURL({ forceStatic: true, size: 128 });
    if (!icon_url) icon_url = 'https://cdn.discordapp.com/emojis/913835102730084362.webp?quality=lossless';

    const embed = new EmbedBuilder()
      .setThumbnail(icon_url)
      .setTitle(stringFormatter.format('- Rules -', false))
      .setDescription(stringFormatter.formatD((() => {
        let o: string = '';

        for (let i = 0; i < RULES.length; i++) {
          o += (i + 1) + '. ' + RULES[i] + '\n\n';
        }
        return o;
      })()));

    interaction.editReply({
      embeds: [embed]
    });
  }
}
