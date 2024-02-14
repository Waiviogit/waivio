export const objAuthorPermlink = obj => obj.authorPermlink || obj.author_permlink;

export const isTabletOrMobile = typeof window !== 'undefined' && window.innerWidth <= 820;
export const isTablet =
  typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1024;

export default null;
