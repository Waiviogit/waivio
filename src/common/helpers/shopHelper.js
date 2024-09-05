export const getUserShopSchema = url =>
  url?.includes('@') && url?.includes('recipe') ? 'recipe' : 'shop';
export default null;
