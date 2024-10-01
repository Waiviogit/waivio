export const objAuthorPermlink = obj => obj.authorPermlink || obj.author_permlink;

export const isTabletOrMobile = typeof window !== 'undefined' && window.innerWidth <= 820;
export const isTablet =
  typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1024;

export const listOfIngredientsHelpingWords = [
  // Measurements
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

  //  Preparation Methods
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

  // Cooking Terms
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

  // Descriptors & Miscellaneous
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

  //  Miscellaneous
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
];

export const cleanIngredientString = ingredient => {
  const omitWordRegex = new RegExp(
    `\\b(${listOfIngredientsHelpingWords.join('s?|')}s?)\\b|\\d+\\/?\\d*|[(),;\\.!]`,
    'gi',
  );

  return ingredient
    ?.replace(omitWordRegex, '')
    ?.trim()
    ?.split(/\s+/)
    ?.filter(Boolean)
    ?.join(' ');
};

export default null;
