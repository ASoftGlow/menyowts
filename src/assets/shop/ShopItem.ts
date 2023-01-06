import { EmojiResolvable } from "discord.js";
import { ShopBuyType as ShopItemBuyCallbackType } from './ShopClickTypes.js';


export type ShopItem = {
  name: string;
  description?: string;
  buyCallbackType?: ShopItemBuyCallbackType;
  // click = buy;
  image?: string;
  // category: ShopCategory = None;
  price: number;
  // index: int = None;
  limit?: number;
  ID: number;
  // other = other;
  hidden?: boolean;
  emoji?: EmojiResolvable;
  inventoriable?: boolean
}

//   constructor(
//     builder: ShopItemBuilder
//   ) {
//     this.buyCallbackType = builder.buyCallbackType;
//     this.description = builder.description!;
//     this.emoji = builder.emoji!;
//     this.hidden = builder.hidden;
//     this.ID = builder.ID!;
//     this.image = builder.image!;
//     this.limit = builder.limit;
//     this.name = builder.name!;
//     this.price = builder.price!;
//   }
// }

// export class ShopItemBuilder {
//   name?: string;
//   description?: string;
//   buyCallbackType: ShopItemBuyCallbackType = ShopItemBuyCallbackType.Default;
//   image?: string;
//   price?: number;
//   limit: number | null = null;
//   ID?: number;
//   hidden: boolean = false;
//   emoji?: EmojiResolvable | null;

//   setName(name: string) {
//     this.name = name;
//     return this;
//   }
//   setDescription(description: string) {
//     this.description = description;
//     return this;
//   }
//   setBuyCallbackType(type: ShopItemBuyCallbackType) {
//     this.buyCallbackType = type;
//     return this;
//   }
//   setImage(imageURL: string) {
//     this.image = imageURL;
//     return this;
//   }
//   setPrice(price: number) {
//     this.price = price;
//     return this;
//   }
//   setLimit(ownedLimit: number) {
//     this.limit = ownedLimit;
//     return this;
//   }
//   setID(ID: number) {
//     this.ID = ID;
//     return this;
//   }
//   setHidden(hidden: boolean) {
//     this.hidden = hidden;
//     return this;
//   }
//   setEmoji(emoji: EmojiResolvable | null) {
//     this.emoji = emoji;
//     return this;
//   }

//   build(): ShopItem {
//     return new ShopItem(
//       this
//     );
//   }
// }