import { createImageNode } from '../embed';

describe('Image Insert Functions', () => {
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
});
