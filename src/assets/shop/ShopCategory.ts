import { ButtonStyle, ColorResolvable } from "discord.js";
import { ShopBuyType } from "./ShopClickTypes.js";
import { ShopItem } from "./ShopItem.js";

export class ShopCategory {
  name: string;
  color: ColorResolvable | null;
  items: ShopItem[] = [];

  constructor(builder: ShopCategoryBuilder) {
    this.name = builder.name!;
    this.color = builder.color!;
    this.items = builder.items;
  }
}

export class ShopCategoryBuilder {
  name?: string;
  color?: ColorResolvable | null;
  items: ShopItem[] = [];
  defaultBuyType?: ShopBuyType;

  setName(name: string) {
    this.name = name;
    return this;
  }
  setColor(color?: ColorResolvable | null) {
    this.color = color;
    return this;
  }
  setDefaultBuyType(type?: ShopBuyType) {
    this.defaultBuyType = type;
    return this;
  }
  addItems(items: ShopItem[]) {
    items.forEach((i) => {
      if (
        items.some((v) => {
          return (i !== v && v.ID === i.ID);
        })
      ) {
        throw new Error("Item IDs must be unqiue");
      }

      if (!i.buyCallbackType) {
        if (!this.defaultBuyType) {
          i.buyCallbackType = ShopBuyType.Default;
        }
        else {
          i.buyCallbackType = this.defaultBuyType;
        }
      }
      this.items.push(i);
    });
    return this;
  }

  build(): ShopCategory {
    if (this.color === undefined) this.color = null;
    return new ShopCategory(
      this
    );
  }
}