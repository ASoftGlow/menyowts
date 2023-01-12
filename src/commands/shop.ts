import { Pagination, PaginationItem, PaginationType } from "@discordx/pagination";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  MessageActionRowComponentBuilder
} from "discord.js";
import { EmbedBuilder } from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";
import { Emojis, CustomEmojis } from "../assets/Emojis.js";
import { Shop } from "../assets/shop/Shop.js";
import { shops, shopsList } from "../assets/shop/shops.js";


@Discord()
export class ShopCommand {
  static readonly buyItemBtn = new ButtonBuilder()
    .setLabel('Buy')
    .setEmoji(Emojis.Coin)
    .setStyle(ButtonStyle.Success);

  static readonly nextItemBtn = new ButtonBuilder()
    .setEmoji(CustomEmojis.PlaybackEmojis.Skip)
    .setStyle(ButtonStyle.Secondary)
    .setCustomId('yr2uh');
  static readonly lastItemBtn = new ButtonBuilder()
    .setEmoji(CustomEmojis.PlaybackEmojis.Back)
    .setStyle(ButtonStyle.Secondary)
    .setCustomId('ydr2uh');


  // example: pagination for all slash command
  @Slash({
    name: "shop",
    description: "-",
  })
  async pages(interaction: CommandInteraction): Promise<void> {
    const shopsBtns = shopsList.map((shop, i) => {
      return (
        new ButtonBuilder()
          .setCustomId('shops-' + i)
          .setLabel(shop.name)
          .setStyle(ButtonStyle.Primary)
      );
    });

    const shopsEmbed = new EmbedBuilder()
      .setTitle('Choose a shop')
      .addFields([
        {
          name: "If you can not buy an item:",
          value: "- You don't have enought coins\n- You bought the maxium amount"
        }
      ]);

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(
        shopsBtns
      );

    await interaction.reply({
      embeds: [shopsEmbed],
      components: [row]
    });
  }


  @ButtonComponent({ id: /shops-\d/ })
  async handleShopsBtns(interaction: ButtonInteraction): Promise<void> {
    const shopID: number = Number.parseInt(interaction.customId.slice('shops-'.length));
    const shop: Shop = shopsList[shopID];

    const categoriesEmbed = new EmbedBuilder()
      .setTitle(shop.name)
      .setDescription('Choose a category')
      .setColor(shop.color === undefined ? null : shop.color);

    const categoriesBtns = shop.categories.map((category, i) => {
      return (
        new ButtonBuilder()
          .setCustomId(`shop-cats-${shopID}-${i}`)
          .setLabel(category.name)
          .setStyle(ButtonStyle.Primary)
      );
    });

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(
        categoriesBtns
      );

    await interaction.reply({
      embeds: [categoriesEmbed],
      components: [row]
    });
    // const collector = re.createMessageComponentCollector({
    //   componentType: ComponentType.Button,
    // })
    // collector.on("collect", (interaction)=>{
    //   // if (interaction.customId)
    // })
  }


  @ButtonComponent({ id: /shop-cats-\d-\d/ })
  async handleCategoriesBtns(interaction: ButtonInteraction): Promise<void> {
    const [shopID, categoryID]: number[] = interaction.customId.slice('shop-cats-'.length).split('-').map((i) => { return Number.parseInt(i); });
    const shop: Shop = shopsList[shopID];
    const category = shop.categories[categoryID];

    const pages = category.items.map((item, i) => {
      const embed = new EmbedBuilder()
        .setFooter({ text: `Page ${i + 1} of ${category.items.length}` })
        .setTitle(category.name)
        .setColor(category.color)
        .addFields({ name: item.name, value: item.description === undefined ? "-" : item.description })
        .setThumbnail(item.image === undefined ? null : item.image);

      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(
          ShopCommand.lastItemBtn,
          // .setCustomId(),
          ShopCommand.buyItemBtn
            .setCustomId(`shop-buy`/*-${item.ID}`*/),
          ShopCommand.nextItemBtn
        );

      return {
        embeds: [embed],
        components: [row]
      } as PaginationItem;
    });

    const pagination = new Pagination(interaction, pages, {
      type: PaginationType.SelectMenu,
      showStartEnd: false
    });
    pagination.collector?.on("collect", async (collectInteraction) => {
      console.log(collectInteraction.customId)
      if (collectInteraction.isButton()) {
        if (collectInteraction.customId === 'shop-buy') {
          console.log(pagination.currentPage);

        }
      }
    });

    await pagination.send();
  }


  @ButtonComponent({ id: /shop-buy-\d+/ })
  async handleBuyItemBtn(interaction: ButtonInteraction): Promise<void> {
    const itemID: number = Number.parseInt(interaction.customId.slice('shop-buy-'.length));
    // const item = 
  }
}