import {
  ButtonInteraction,
  CommandInteraction,
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
import { FactResponse } from '../assets/FactResponse.js';
import { facts } from '../assets/Facts.js';
import { randomElement } from '../utils/RandomElement.js';


async function requestFact(): Promise<FactResponse> {
  if (Math.random() > 0.1) {
    const res = await fetch('https://some-random-api.ml/facts/cat');
    if (!res.ok) {
      console.log(res.status + ' - ' + res.statusText);
    }

    const json: any = await res.json();
    return json;
  }
  else {
    return { fact: randomElement(facts) };
  }
}


@Discord()
export class Fact {
  cache: FactResponse | null = null;

  private static readonly row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel(stringFormatter.format("New", false))
        .setEmoji("🐱")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("new-fact-btn")
    );


  private async sendFact(interaction: CommandInteraction | ButtonInteraction) {
    const isCommand = interaction instanceof CommandInteraction;
    const sendReply = isCommand ?
      interaction.followUp.bind(interaction) :
      interaction.editReply.bind(interaction);
    isCommand ? await interaction.deferReply() : await interaction.deferUpdate();

    var response;
    if (this.cache !== null) {
      response = this.cache;
      this.cache = null;
    }
    else {
      response = await requestFact();
    }
    await sendReply({
      content: stringFormatter.format(`> ${response.fact}`),
      components: [Fact.row]
    });

    if (this.cache === null) {
      this.cache = await requestFact();
    }
  }


  @Slash({ description: "Sends a cat fact", name: "fact" })
  async fact(
    interaction: CommandInteraction
  ): Promise<void> {
    await this.sendFact(interaction);
  }

  @ButtonComponent({ id: "new-fact-btn" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    await this.sendFact(interaction);
  }
}