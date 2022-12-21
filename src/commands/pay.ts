import type {
  ButtonInteraction,
  CommandInteraction,
  GuildMember,
  MessageActionRowComponentBuilder,
  User,
} from "discord.js";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  userMention
} from "discord.js";
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
import { stringFormatter, db } from '../main.js';
import { UsersTableRow } from '../assets/DatabaseTypes.js';
import { Emojis } from '../assets/Emojis.js';


const confirmBtn = new ButtonBuilder()
  .setEmoji({
    name: 'check',
    id: '1054622449750253589'
  })
  .setStyle(ButtonStyle.Success)
  .setCustomId("pay-confirm-btn");

const actionRow =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    confirmBtn
  );


@Discord()
export class Example {
  //TODO: option descriptions
  @Slash({ description: 'Pays someone coins', name: "pay" })
  async command(
    @SlashOption({
      description: "user",
      name: "user",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    member: GuildMember,
    @SlashOption({
      description: "amount",
      name: "amount",
      required: true,
      type: ApplicationCommandOptionType.Integer,
      minValue: 1
    })
    amount: number,
    interaction: CommandInteraction
  ): Promise<void> {
    if (interaction.user.id === member.id) {
      await interaction.reply(stringFormatter.format('k'));
      return;
    }
    if (member.user.bot) {
      await interaction.reply(stringFormatter.format(`Bots can't receive ${Emojis.Coin}.`));
      return;
    }

    db.get("SELECT coins FROM users WHERE id=?", [interaction.user.id], async (err: Error | null, row: UsersTableRow) => {
      if (err) throw err;

      if (row.coins >= amount) {
        actionRow.components[0].setCustomId(`pay-confirm_${member.id}_${amount}`);

        await interaction.reply({
          content: stringFormatter.formatD(`Are you sure you want to pay ${userMention(member.id)} ${Emojis.Coin}${amount}?`),
          components: [actionRow],
          ephemeral: true,
        });
      }
      else {
        await interaction.reply(stringFormatter.format(`You doesn't have enough ${Emojis.Coin}!`));
      }
    });
  }


  @ButtonComponent({ id: /pay-confirm_\w+/ })
  handleConfirmBtn(interaction: ButtonInteraction): void {
    const [memberID, amount] = interaction.customId.slice("pay-confirm_".length).split('_');

    db.run("UPDATE users SET coins=coins+$amount WHERE id=$id",
      {
        $amount: -amount,
        $id: interaction.user.id
      })
      .run("UPDATE users SET coins=coins+$amount WHERE id=$id",
        {
          $amount: amount,
          $id: memberID
        });

    interaction.reply(stringFormatter.format(`${userMention(interaction.user.id)} gave ${userMention(memberID)} ${Emojis.Coin}${amount}`));
  }
}
