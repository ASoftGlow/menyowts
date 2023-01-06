import { ShopItem } from "./ShopItem.js";


export function getShopItemBuyFunction(type: ShopBuyType) {
  return [
    ()=>{},
    (_this: ShopItem) => {

    },
    (_this: ShopItem) => {

    },
    (_this: ShopItem) => {

    }
  ][type]
}

export enum ShopBuyType {
  Default,
  AddRole,
  AddThread,
  AddPet,
  SetMode
}