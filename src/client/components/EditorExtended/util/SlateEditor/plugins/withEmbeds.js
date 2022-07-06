import { Transforms, Node, Element } from 'slate';
import { deserializeHtmlToSlate } from '../../constants';
import { CODE_BLOCK, PARAGRAPH_BLOCK } from '../utils/constants';

const withEmbeds = cb => editor => {
  const { isVoid, insertData, normalizeNode, selection } = editor;

  /* eslint-disable no-param-reassign */
  editor.isVoid = element => (['video', 'image'].includes(element.type) ? true : isVoid(element));

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    const selectedElement =
      selection && Node.descendant(editor, editor.selection.anchor.path.slice(0, -1));
    const isWrapped = selectedElement?.type.includes(CODE_BLOCK);

    if (Element.isElement(node) && node.type === PARAGRAPH_BLOCK) {
      if (isWrapped) {
        Transforms.unwrapNodes(editor, { at: path });

        return;
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child) && child.type !== CODE_BLOCK) {
          Transforms.unwrapNodes(editor, { at: childPath });

          return;
        }
      }
    }

    if (Element.isElement(node) && node.type === CODE_BLOCK) {
      // eslint-disable-next-line no-restricted-syntax
      Transforms.setNodes(
        editor,
        { meta: node.meta || '', lang: node.lang || 'javascript' },
        { at: path },
      );

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
      const selectedElement = Node.descendant(editor, editor.selection.anchor.path.slice(0, -1));
      const isWrapped = selectedElement.type.includes(CODE_BLOCK);

      const nodesNormalized = nodes.map(i => {
        if (i.text && i.text !== '\n' && !i.type && !isWrapped) {
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

      Transforms.insertFragment(
        editor,
        !isWrapped
          ? [
              {
                type: PARAGRAPH_BLOCK,
                children: nodesNormalized,
              },
            ]
          : nodesNormalized,
      );
      cb(html);

      return;
    }

    insertData(data);
  };

  return editor;
};

export default withEmbeds;
