import { Transforms, Node, Element } from 'slate';
import { deserializeHtmlToSlate } from '../../constants';
import { CODE_BLOCK, PARAGRAPH_BLOCK } from '../utils/constants';
import { deserializeToSlate } from '../utils/parse';

function wrapListItemsInBulletedList(nodes) {
  const result = [];
  let buffer = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const node of nodes) {
    if (node.type === 'listItem') {
      buffer.push(node);
    } else {
      if (buffer.length) {
        result.push({
          type: 'bulletedList',
          children: [...buffer],
        });
        buffer = [];
      }
      result.push(node);
    }
  }

  // В случае, если список закончился на listItem
  if (buffer.length) {
    result.push({
      type: 'bulletedList',
      children: [...buffer],
    });
  }

  return result;
}

const withEmbeds = cb => editor => {
  const { isVoid, insertData, normalizeNode, selection } = editor;

  /* eslint-disable no-param-reassign */
  editor.isVoid = element => (['video', 'image'].includes(element.type) ? true : isVoid(element));

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    let selectedElement = null;
    let isWrapped = false;

    try {
      if (selection && editor.selection?.anchor?.path) {
        const selectedElementPath = editor.selection.anchor.path.slice(0, -1);

        if (Node.has(editor, selectedElementPath)) {
          selectedElement = Node.descendant(editor, selectedElementPath);
          isWrapped = selectedElement?.type?.includes(CODE_BLOCK);
        }
      }
    } catch (error) {
      console.warn('Error in withEmbeds normalizeNode:', error);
    }

    if (Element.isElement(node) && node.type === PARAGRAPH_BLOCK) {
      if (isWrapped) {
        Transforms.unwrapNodes(editor, { at: path });

        return;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.liftNodes(editor, { at: childPath });

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
    const isBlobImage = html && html?.includes('<img src="blob:');

    if (html && !isBlobImage) {
      let _html = html;

      const match = html?.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/g);

      if (match) {
        /* on Windows browser insert extra breaklines  */
        _html = _html.replace(
          /<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/g,
          '<meta charset="utf-8">$1',
        );
        _html = _html.replace(/<html>([\s\S]*?)<\/html>/g, '$1');
        _html = _html.replace(/<body>([\s\S]*?)<\/body>/g, '$1').trim();
      }

      const parsed = new DOMParser().parseFromString(_html, 'text/html');
      const nodes = deserializeHtmlToSlate(parsed.body);

      let selectedElement = null;
      let isWrapped = false;

      try {
        if (editor.selection?.anchor?.path) {
          const selectedElementPath = editor.selection.anchor.path.slice(0, -1);

          if (Node.has(editor, selectedElementPath)) {
            selectedElement = Node.descendant(editor, selectedElementPath);
            isWrapped = selectedElement?.type?.includes(CODE_BLOCK);
          }
        }
      } catch (error) {
        console.warn('Error in withEmbeds insertData:', error);
      }

      let nodesNormalized = nodes
        .filter(i => i.text !== '\n')
        .map(i => {
          if (i.type === 'link' && i.children[0]?.type === 'image') {
            return i.children[0];
          }
          if (i.type === 'link' && i?.url?.includes('/object/')) {
            return {
              type: 'object',
              url: i.url,
              children: [{ text: ' ' }],
              hashtag: i.children[0]?.text,
            };
          }

          if (['orderedList', 'bulletedList'].includes(i.type)) {
            return {
              type: i.type,
              children: i?.children?.reduce((acc, it) => {
                if (it.type === 'listItem') {
                  return [
                    ...acc,
                    {
                      type: 'listItem',
                      children: it.children.reduce((a, c) => {
                        if (c.type === 'paragraph') {
                          return [...a, ...c.children];
                        }

                        if (!c.type && c.text === '\n') {
                          return a;
                        }

                        return [...a, c];
                      }, []),
                    },
                  ];
                }

                return acc;
              }, []),
            };
          }

          if (['listItem'].includes(i.type)) {
            return {
              type: 'listItem',
              children: i.children.reduce((a, c) => {
                if (c.type === 'paragraph') {
                  return [...a, ...c.children];
                }

                if (!c.type && c.text === '\n') {
                  return a;
                }

                return [...a, c];
              }, []),
            };
          }

          if (i.text === '\n') {
            return {
              text: '',
            };
          }

          return i;
        });

      if (nodesNormalized.length === 1 && nodesNormalized[0].type === 'image') {
        nodesNormalized = [
          ...nodesNormalized,
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ];
      }

      Transforms.insertFragment(
        editor,
        !isWrapped
          ? [
              {
                type: PARAGRAPH_BLOCK,
                children: wrapListItemsInBulletedList(nodesNormalized),
              },
            ]
          : wrapListItemsInBulletedList(nodesNormalized),
      );
      cb(html);
      if (isWrapped) Transforms.move(editor, { unit: 'offset' });

      return;
    }

    const text = data.getData('text/plain');

    if (text && /^https?:\/\/\S+$/.test(text.trim())) {
      let node;

      if (text?.includes('youtube.com') || text?.includes('youtu.be')) {
        node = {
          type: 'video',
          url: text.trim(),
          children: [{ text: '' }],
        };
      } else {
        node = {
          type: 'link',
          url: text.trim(),
          children: [{ text: text.trim() }],
        };
      }

      Transforms.insertNodes(editor, node);

      return;
    }

    const isMarkdown = /[*_#>`-]/.test(text) || text?.includes('\n');

    if (isMarkdown) {
      const tree = deserializeToSlate(text);

      Transforms.insertFragment(editor, tree);
      Transforms.move(editor, { unit: 'offset' });

      return;
    }

    insertData(data);
  };

  return editor;
};

export default withEmbeds;
