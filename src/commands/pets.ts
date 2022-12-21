import { Pagination } from "@discordx/pagination";
import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { PetsTableRow } from "../assets/DatabaseTypes.js";
import { db } from "../main.js";
import { LanguageUtils } from "../utils/LanguageUtils.js";


@Discord()
export class SlashExample {
  // example: pagination for all slash command
  @Slash({
    name: "pets",
    description: "Pagination for all slash command",
  })
  async pages(
    @SlashOption({
      name: 'member',
      description: 'member',
      type: ApplicationCommandOptionType.User,
      required: false
    })
    member: GuildMember | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    if (member === undefined) member = (interaction.member as GuildMember);
    if (member.user.bot) {
      await interaction.reply({
        content: "Bots don't have pets.",
        ephemeral: true
      });
      return;
    }

    db.all('SELECT name, gender, health, hunger, age, happiness, pet_id FROM pets WHERE owner_id=?',
      [member.id],
      async (err: Error | null, rows: PetsTableRow[]) => {
        if (err) throw err;

        const pages = rows.map((pet, i) => {
          const embed = new EmbedBuilder()
            .setImage(pet.b2_img)
            .addFields(
              {
                name: 'Name',
                value: pet.name,
              },
              {
                name: 'Health',
                value: pet.health.toString()
              },
              {
                name: 'Hunger',
                value: pet.hunger.toString()
              },
              {
                name: 'Age',
                value: pet.age.toString()
              },
              {
                name: 'Happiness',
                value: pet.happiness.toString()
              }
            )
            .setTitle(`**${LanguageUtils.makePossessive(member?.displayName!)} Pets**`)
            .setFooter({ text: `Page ${i + 1} of ${rows.length}` });

          return { embeds: [embed] };
        });

        const pagination = new Pagination(interaction, pages);
        await pagination.send();

      });
  }
}
