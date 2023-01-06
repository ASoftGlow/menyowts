import { ColorResolvable } from "discord.js";
import { ShopCategory, ShopCategoryBuilder } from "./ShopCategory.js";

export class Shop {
  name: string;
  color?: ColorResolvable;
  categories: ShopCategory[] = [];

  currentCategory?: ShopCategory;

  constructor(builder: ShopBuilder) {
    this.name = builder.name!;
    this.color = builder.color;
    this.categories = builder.categories;
  }
}

export class ShopBuilder {
  private _name?: string;
  private _color: ColorResolvable | undefined;
  private _categories: ShopCategory[] = [];

  setName(name: string) {
    this._name = name;
    return this;
  }
  get name() {
    return this._name;
  }
  setColor(color: ColorResolvable | undefined) {
    this._color = color;
    return this;
  }
  get color() {
    return this._color;
  }
  addCategories(categories: ShopCategoryBuilder[]) {
    categories.forEach((i) => {
      this._categories.push(i.build());
    });
    return this;
  }
  get categories() {
    return this._categories;
  }

  build(): Shop {
    return new Shop(
      this
    );
  }
}