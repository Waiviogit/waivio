const createParagraph = text => ({
  type: 'paragraph',
  children: [{ text }],
});

export default createParagraph;
