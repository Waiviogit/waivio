import unified from 'unified';
import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { remarkToSlate } from 'remark-slate-transformer';
import SteemEmbed from '../../../../../vendor/embedMedia';
import { addSpaces } from '../../../../../../common/helpers/editorHelper';

export const defaultNodeTypes = {
  paragraph: 'paragraph',
  block_quote: 'block_quote',
  code_block: 'code_block',
  code: 'code',
  link: 'link',
  ul_list: 'ul_list',
  ol_list: 'ol_list',
  listItem: 'list_item',
  heading: {
    1: 'headingOne',
    2: 'headingTwo',
    3: 'headingThree',
    4: 'headingFour',
    5: 'headingFive',
    6: 'headingSix',
  },
  emphasis_mark: 'italic',
  strong_mark: 'bold',
  delete_mark: 'strikeThrough',
  inline_code_mark: 'inlineCode',
  thematic_break: 'thematicBreak',
  image: 'image',
  object: 'object',
};

export const deserializeToSlate = body => {
  const processor = unified()
    .use(markdown)
    .use(remarkGfm)
    .use(remarkToSlate, {
      overrides: {
        link: (node, next) => {
          if (node.url.includes('/object/')) {
            return {
              type: 'object',
              hashtag: node.children[0]?.value,
              url: node.url,
              children: [{ text: '' }],
            };
          }
          if (SteemEmbed.get(node.url)) {
            return {
              type: 'video',
              url: node.url,
              children: [{ text: '' }],
            };
          }

          return {
            type: 'link',
            url: node.url,
            children: next(node.children),
          };
        },
        heading: (node, next) => ({
          type: `${defaultNodeTypes.heading[node.depth || 1]}`,
          children: next(node.children),
        }),
        list: (node, next) => ({
          type: node.ordered ? 'orderedList' : 'unorderedList',
          children: next(node.children),
        }),
        paragraph: (node, next) => {
          const children = [];

          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].type === 'html' && node.children[i].value === '<u>') {
              let text = '';
              let withClose = false;
              let j = i + 1;
              const position = { start: node.children[i].position.start, end: null };

              for (; j < node.children.length; j++) {
                if (node.children[j].type === 'html' && node.children[j].value === '</u>') {
                  withClose = true;
                  position.end = node.children[j].position.end;
                  break;
                }
                text += node.children[j].value;
              }
              if (withClose)
                children.push({ underline: true, value: text, type: 'underline', position });
              i = j + 1;
            }
            if (node.children[i]) children.push(node.children[i]);
          }

          return { type: 'paragraph', children: next(children) };
        },
        underline: (node, next) => ({
          text: node.value,
          ...(node.underline && { underline: true }),
          ...(node.children && { children: next(node.children) }),
        }),
      },
    });
  let postParsed = [];

  const _body = addSpaces(body);

  _body.split('\n\n\n').forEach(i => {
    const blocks = processor.processSync(i).result;

    postParsed = [...postParsed, ...blocks, { type: 'paragraph', children: [{ text: '' }] }];
    const isItemList = blocks[blocks.length - 1]?.type !== 'itemList';

    if (!isItemList) {
      postParsed.push({ type: 'paragraph', children: [{ text: '' }] });
    }
  });

  return postParsed;
};
