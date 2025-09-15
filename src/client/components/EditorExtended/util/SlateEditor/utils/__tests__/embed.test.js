import {
  createImageNode,
  insertImageReplaceParagraph,
  insertImageForImageSetter,
  createEmptyNode,
} from '../embed';

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

  describe('insertImageReplaceParagraph', () => {
    it('should return array with empty paragraph, image node, and empty paragraph', () => {
      const mockEditor = {};
      const imageNode = createImageNode('test image', { url: 'https://example.com/image.jpg' });
      const result = insertImageReplaceParagraph(mockEditor, imageNode);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(createEmptyNode());
      expect(result[1]).toEqual(imageNode);
      expect(result[2]).toEqual(createEmptyNode());
    });
  });

  describe('insertImageForImageSetter', () => {
    it('should return array with image node and empty paragraph', () => {
      const mockEditor = {};
      const imageNode = createImageNode('test image', { url: 'https://example.com/image.jpg' });
      const result = insertImageForImageSetter(mockEditor, imageNode);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(imageNode);
      expect(result[1]).toEqual(createEmptyNode());
    });
  });
});
