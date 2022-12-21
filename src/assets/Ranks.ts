export type Rank = {
  // id: number
  readonly name: string;
  readonly emoji: string;
  readonly roleID: string;
};

export const ranks = new Map<number, Rank>([
  [0, {
    name: 'Fluff',
    emoji: '<:fluff:955211294951227412>',
    roleID: '809224689692049440'
  }],
  [1, {
    name: 'Kitten',
    emoji: '🐈',
    roleID: '809224808708702288'
  }],
  [2, {
    name: 'Cattermelon',
    emoji: '<:cattermelon:832275206964772945>',
    roleID: '809224829056188436'
  }],
  [3, {
    name: 'Sphynx',
    emoji: '<:sphynx:832280115827310652>',
    roleID: '809224960123731999'
  }],
  [4, {
    name: 'Elder',
    emoji: '<:sc_drip:954773184769564702>',
    roleID: '954816258950455317'
  }],
  [5, {
    name: 'Tacocat',
    emoji: '<:tacocat:1003474331445239908>',
    roleID: '1003471698168918106'
  }]
]);