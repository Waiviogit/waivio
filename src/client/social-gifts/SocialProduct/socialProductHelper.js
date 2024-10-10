export const objAuthorPermlink = obj => obj.authorPermlink || obj.author_permlink;

export const isTabletOrMobile = typeof window !== 'undefined' && window.innerWidth <= 820;
export const isTablet =
  typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1024;

export const listOfIngredientsHelpingWords = [
  'cup',
  'teaspoon',
  'tsp',
  'tablespoon',
  'tbsp',
  'ounce',
  'oz',
  'pint',
  'quart',
  'gallon',
  'liter',
  'milliliter',
  'ml',
  'gram',
  'g',
  'kilogram',
  'kg',
  'pound',
  'lb',
  'dash',
  'pinch',
  'slice',
  'piece',
  'handful',
  'bunch',
  'stick',
  'can',
  'jar',
  'package',
  'block',
  'fillet',
  'head',
  'a squeeze of',

  // Quantifiers & Units
  'clove',
  'sprig',
  'stalk',
  'leaf',
  'strip',
  'chunk',
  'cube',
  'drop',
  'layer',
  'drizzle',
  'splash',
  'handful',
  'chopped',
  'diced',
  'minced',
  'sliced',
  'grated',
  'peeled',
  'seeded',
  'cored',
  'crushed',
  'ground',
  'beaten',
  'whipped',
  'mashed',
  'melted',
  'softened',
  'toasted',
  'roasted',
  'cooked',
  'boiled',
  'simmered',
  'steamed',
  'fried',
  'sautéed',
  'baked',
  'grilled',
  'broiled',
  'marinated',
  'seasoned',
  'blended',
  'preheat',
  'bake',
  'cook',
  'grill',
  'broil',
  'fry',
  'stir',
  'mix',
  'combine',
  'whisk',
  'blend',
  'fold',
  'knead',
  'pour',
  'spread',
  'sprinkle',
  'drizzle',
  'coat',
  'garnish',
  'toss',
  'layer',
  'fill',
  'stuff',
  'arrange',
  'top',
  'serve',
  'fresh',
  'dried',
  'unsalted',
  'salted',
  'raw',
  'cooked',
  'organic',
  'frozen',
  'canned',
  'ripe',
  'overripe',
  'room temperature',
  'large',
  'small',
  'medium',
  'whole',
  'sliced',
  'half',
  'quartered',
  'skinless',
  'boneless',
  'shredded',
  'finely',
  'coarsely',
  'light',
  'dark',
  'low-fat',
  'high-fat',
  'lean',
  'thick',
  'thinly',
  'thin',
  'tender',
  'firm',
  'to taste',
  'as needed',
  'for garnish',
  'for serving',
  'for the filling and frosting',
  'optional',
  'and',
  'a',
  'of',
  'or',
  'etc',
  '-sized',
  'cups',
  'large',
  'for toasting',
  'chilled',
  'high-quality',
  'pure',
  'hard-boiled',
  'grams',
  'drained',
  'condensed',
  'for topping',
  'for frying',
  'drained',
  'cut into',
  'for drizzling',
];

export const cleanIngredientString = ingredient => {
  const removeHelpingWords = new RegExp(
    `\\b(${listOfIngredientsHelpingWords.map(word => `${word}s?`).join('|')})\\b`,
    'gi',
  );

  const removeQuantitiesAndMeasurements = /(\d+|\u00BC|\u00BD|\u00BE|\u2150|\u2151|\u2152|\u2153|\u2154|\u2155|\u2156|\u2157|\u2158|\u2159|\u215A|\u215B|\u215C|\u215D|\u215E)\s*(g|kg|ml|l|oz|tsp|tbsp|cup|cups|pint|quart|gallon|pound|lb)?|[()/,;.!:-]/gi;

  return ingredient
    ?.replace(removeHelpingWords, '')
    ?.replace(removeQuantitiesAndMeasurements, '')
    ?.trim()
    ?.split(/\s+/)
    ?.filter(Boolean)
    ?.map(word => word.replace(/s\b/g, ''))
    ?.join(' ');
};

export default null;
