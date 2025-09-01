import { createImageNode, insertImageWithoutParagraph, insertImageWithParagraph } from '../embed';

describe('Image Insert Functions', () => {
  const mockEditor = {};

  describe('createImageNode', () => {
    it('should create image node with default values', () => {
      const imageNode = createImageNode('test image', { url: 'https://example.com/image.jpg' });

      expect(imageNode).toEqual({
        type: 'image',
        alt: 'test image',
        url: 'https://example.com/image.jpg',
        width: 200,
        height: 200,
        children: [{ text: '' }],
      });
    });

    it('should create image node with custom dimensions', () => {
      const imageNode = createImageNode('test image', {
        url: 'https://example.com/image.jpg',
        width: 400,
        height: 300,
      });

      expect(imageNode).toEqual({
        type: 'image',
        alt: 'test image',
        url: 'https://example.com/image.jpg',
        width: 400,
        height: 300,
        children: [{ text: '' }],
      });
    });
  });

  describe('insertImageWithoutParagraph', () => {
    it('should return array with only image node', () => {
      const imageNode = createImageNode('test', { url: 'https://example.com/image.jpg' });
      const result = insertImageWithoutParagraph(mockEditor, imageNode);

      expect(result).toEqual([imageNode]);
      expect(result).toHaveLength(1);
    });
  });

  describe('insertImageWithParagraph', () => {
    it('should return array with wrapped image and empty node', () => {
      const imageNode = createImageNode('test', { url: 'https://example.com/image.jpg' });
      const result = insertImageWithParagraph(mockEditor, imageNode);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('paragraph');
      expect(result[0].children).toContain(imageNode);
      expect(result[1].type).toBe('paragraph');
    });
  });
});
