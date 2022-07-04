import { Transforms, Node, Element } from 'slate';
import { deserializeHtmlToSlate } from '../../constants';

const withEmbeds = cb => editor => {
  const { isVoid, insertData, normalizeNode } = editor;

  /* eslint-disable no-param-reassign */
  editor.isVoid = element => (['video', 'image'].includes(element.type) ? true : isVoid(element));

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === 'paragraph') {
      // eslint-disable-next-line no-restricted-syntax
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });

          return;
        }
      }
    }

    normalizeNode(entry);
  };

  editor.insertData = data => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const nodes = deserializeHtmlToSlate(parsed.body);
      const nodesNormalized = nodes.map(i => {
        if (i.text && i.text !== '\n' && !i.type) {
          return { type: 'paragraph', children: [i] };
        }
        if (i.type === 'link' && i.children[0]?.type === 'image') {
          return i.children[0];
        }
        if (i.type === 'link' && i.url.includes('/object/')) {
          return {
            type: 'object',
            url: i.url,
            children: [{ text: '' }],
            hashtag: i.children[0]?.text,
          };
        }

        return i;
      });

      Transforms.insertFragment(editor, [
        {
          type: 'paragraph',
          children: nodesNormalized,
        },
      ]);
      cb(html);

      return;
    }

    insertData(data);
  };

  return editor;
};

export default withEmbeds;
