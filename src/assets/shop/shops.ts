import { Shop, ShopBuilder } from "./Shop.js";
import { ShopCategoryBuilder } from "./ShopCategory.js";
import { ShopBuyType } from "./ShopClickTypes.js";

export const shops = {
  itemShop: new ShopBuilder()
    .setName("Item Shop")
    .addCategories([
      new ShopCategoryBuilder()
        .setName("Name Colors")
        .setColor("Blurple")
        .setDefaultBuyType(ShopBuyType.AddRole)
        .addItems([
          {
            ID: 0,
            name: "Red",
            description: 'Changes the color of your name',
            price: 50,
            image: 'https://github.com/Leaf-Forest/Menyow/blob/main/images/red_role.png?raw=true',
            limit: 1,
            emoji: '🟥'
          },
          {
            ID: 1,
            name: 'Yellow',
            description: 'Changes the color of your name',
            price: 50,
            image: 'https://github.com/Leaf-Forest/Menyow/blob/main/images/yellow_role.png?raw=true',
            emoji: '🟨',
            limit: 1
          },
          {
            ID: 2,
            name: 'Blue',
            description: 'Changes the color of your name',
            price: 50,
            image: 'https://github.com/Leaf-Forest/Menyow/blob/main/images/blue_role.png?raw=true',
            limit: 1,
            emoji: '🟦'
          },
          {
            ID: 12,
            name: 'Halloween',
            description: 'Ooooo!!',
            price: 444,
            limit: 1,
            emoji: '🕸️',
            hidden: true
          }
        ]),
      new ShopCategoryBuilder()
        .setName("Special Roles")
        .setColor("Green")
        .setDefaultBuyType(ShopBuyType.AddRole)
        .addItems([
          {
            ID: 3,
            name: 'Cool',
            description: 'Makes you "cool"',
            price: 100,
            image: 'https://github.com/Leaf-Forest/Menyow/blob/main/images/Cool_role.png?raw=true',
            limit: 1
          },
          {
            ID: 4,
            name: 'Secret Pass',
            description: "It's a secret..",
            price: 400,
            image: 'https://github.com/Leaf-Forest/Menyow/blob/main/images/lock.png?raw=true'
          }
        ]),
      new ShopCategoryBuilder()
        .setName("Collectables")
        .setColor("Greyple")
        .setDefaultBuyType(ShopBuyType.Default)
        .addItems([
          {
            ID: 5,
            name: 'Potion of Leaping',
            description: 'Boosts daily exp by 25%',
            price: 500,
            image: 'https://gamepedia.cursecdn.com/minecraft_gamepedia/d/db/Potion_of_Leaping.gif',
            limit: 1
          },
          {
            ID: 6,
            name: 'Useless Rock',
            description: 'A completely useless rock.',
            price: 222,
            image: 'https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/da268f06e621b21.png'
          },
          {
            ID: 13,
            name: 'One Thread',
            description: 'Allows you create a single thread.',
            price: 100,
            buyCallbackType: ShopBuyType.AddThread
          },
          {
            ID: 14,
            name: 'Text Manipulation',
            description: 'Manipulations all bot output text for 24 hours',
            price: 100,
            emoji: '✏',
            buyCallbackType: ShopBuyType.SetMode,
            inventoriable: false
          }
        ])
    ])
    .build(),

  petShop: new ShopBuilder()
    .setName("Pet Shop")
    .setColor("LuminousVividPink")
    .addCategories([
      new ShopCategoryBuilder()
        .setName("Food")
        .addItems([
          {
            ID: 7,
            name: 'Tuna',
            description: 'Freshly caught',
            price: 9,
            image: 'https://gamepedia.cursecdn.com/shatteredskies_gamepedia_en/thumb/e/e8/Cooked_Tuna.png/156px-Cooked_Tuna.png'
          },
          {
            ID: 8,
            name: 'Oatmeal',
            description: 'Just right?',
            price: 5
          },
          {
            ID: 9,
            name: 'Spinach',
            description: 'Healthy!',
            price: 8
          }
        ]),
      new ShopCategoryBuilder()
        .setName("Cosmetics")
        .setColor("Yellow")
        .addItems([
          {
            ID: 10,
            name: 'Hat',
            price: 30
          },
          {
            ID: 11,
            name: 'Scarf',
            price: 25
          }
        ])
    ])
    .build()
};

export const shopsList = [shops.itemShop, shops.petShop];