export const getUserShopSchema = (url, isRecipePage = false) =>
  isRecipePage || url?.includes('recipe') ? 'recipe' : 'shop';
export default null;
