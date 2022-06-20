const createParagraph = text => ({
  type: 'paragraph',
  children: [{ text }],
});

export const wrapWithParagraph = children => ({
  type: 'paragraph',
  children,
});

export default createParagraph;
