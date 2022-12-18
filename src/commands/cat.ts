import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  Discord,
  Slash,
  ButtonComponent
} from "discordx";
import fetch from 'node-fetch';
import { stringFormatter } from './../main.js';
import { CatResponse } from './../assets/CatResponse.js';


async function requestCat(): Promise<string> {
  const res = await fetch('https://api.thecatapi.com/v1/images/search');
  if (!res.ok) {
    switch (res.status) {
      // Too many requests
      case 429:
        return 'https://png.pngtree.com/png-vector/20190331/ourlarge/pngtree-cat-one-line-drawing-continuous-style-of-minimalism-design-png-image_900696.jpg'
    
      default:
        console.log(res.status + ' - ' + res.statusText);
        throw new Error(res.statusText)
    }
  }

  const json: any = await res.json();
  const cat: CatResponse = json[0];
  return cat.url;
}


@Discord()
export class Cat {
  cache: string | null = null;

  private static readonly row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel(stringFormatter.format("New", false))
        .setEmoji("🐱")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("new-cat-btn")
    );


  private async sendCat(interaction: CommandInteraction | ButtonInteraction) {
    const isCommand = interaction instanceof CommandInteraction;
    const sendReply = isCommand ?
      interaction.followUp.bind(interaction) :
      interaction.editReply.bind(interaction);
    isCommand ? await interaction.deferReply() : await interaction.deferUpdate();

    var cat;
    if (this.cache !== null) {
      cat = this.cache;
      this.cache = null;
    }
    else {
      cat = await requestCat();
    }
    await sendReply({
      embeds: [
        new EmbedBuilder().setImage(cat)
      ],
      components: [Cat.row]
    });

    if (this.cache === null) {
      this.cache = await requestCat();
    }
  }


  @Slash({ description: 'Sends a random picture of a cat!', name: "cat" })
  async cat(
    interaction: CommandInteraction
  ): Promise<void> {
    await this.sendCat(interaction);
  }

  @ButtonComponent({ id: "new-cat-btn" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    await this.sendCat(interaction);
  }
}