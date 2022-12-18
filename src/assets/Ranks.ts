type Rank = {
  // id: number
  readonly name: string;
  readonly emoji: string;
};

export const ranks = new Map<number, Rank>([
  [0, {
    name: 'Fluff',
    emoji: '<:fluff:955211294951227412>'
  }],
  [1, {
    name: 'Kitten',
    emoji: '🐈'
  }],
  [2, {
    name: 'Cattermelon',
    emoji: '<:cattermelon:832275206964772945>'
  }],
  [3, {
    name: 'Sphynx',
    emoji: '<:sphynx:832280115827310652>'
  }],
  [4, {
    name: 'Elder',
    emoji: '<:sc_drip:954773184769564702>'
  }],
  [5, {
    name: 'Elder',
    emoji: '<:tacocat:1003474331445239908>'
  }]
]);