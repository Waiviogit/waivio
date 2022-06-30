import { Transforms } from 'slate';
import { deserializeHtmlToSlate } from '../../constants';

const withEmbeds = editor => {
  const { isVoid, insertData } = editor;

  /* eslint-disable no-param-reassign */
  editor.isVoid = element => (['video', 'image'].includes(element.type) ? true : isVoid(element));

  editor.insertData = data => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const nodes = deserializeHtmlToSlate(parsed.body);
      const nodesNormalized = nodes.map(i => {
        if (i.text && i.text !== '\n' && !i.type) {
          return { type: 'paragraph', children: [i] };
        }

        return i;
      });

      Transforms.insertFragment(editor, nodesNormalized);

      return;
    }

    insertData(data);
  };

  return editor;
};

export default withEmbeds;
