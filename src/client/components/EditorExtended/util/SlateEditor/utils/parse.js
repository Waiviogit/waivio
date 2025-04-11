import { isEmpty } from 'lodash';
import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { remarkToSlate } from 'remark-slate-transformer';
import SteemEmbed from '../../../../../vendor/embedMedia';

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

function htmlArrayToSlateList(htmlArray) {
  const slateList = [];
  let currentList = null;

  htmlArray.forEach(node => {
    if (node.type === 'html' && node.value === '<ol>') {
      currentList = { type: 'orderedList', children: [] };
    } else if (node.type === 'html' && node.value === '</ol>') {
      if (currentList) {
        slateList.push(currentList);
        currentList = null;
      }
    } else if (node.type === 'html' && node.value === '<li>') {
      currentList.children.push({ type: 'listItem', children: [] });
    } else if (node.type === 'text' && currentList) {
      const lastItem = currentList.children[currentList.children.length - 1];

      if (lastItem) {
        lastItem.children.push({ type: 'text', value: node.value });
      }
    }
  });

  return slateList;
}

export const deserializeToSlate = (body, isThread, isNewReview) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkToSlate, {
      overrides: {
        link: (node, next) => {
          if (node.url.includes('/object/')) {
            return {
              type: 'object',
              hashtag: node.children[0]?.value,
              url: node.url,
              children: [{ text: ' ' }],
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

          return {
            type: 'paragraph',
            children: ['link', 'object'].includes(children[children?.length - 1]?.type)
              ? next([
                  ...children,
                  {
                    type: 'text',
                    value: ' ',
                  },
                ])
              : next(children),
          };
        },
        underline: (node, next) => ({
          text: node.value,
          ...(node.underline && { underline: true }),
          ...(node.children && { children: next(node.children) }),
        }),
        tableCell: (node, next) => {
          const emptyParagraph = {
            type: 'paragraph',
            children: [{ type: 'text', value: '' }],
          };

          const children = node.children.reduce((acc, child) => {
            if (child.type === 'html' && child.value === '<p />') {
              return [...acc, emptyParagraph];
            }

            if (child.type === 'html' && ['<ol>', '<ul>'].includes(child.value)) {
              const u = htmlArrayToSlateList(node.children);

              return [...acc, ...u];
            }

            if (
              child.type === 'html' &&
              ['<li>', '</li>', '</ol>', '</ul>'].includes(child.value)
            ) {
              return acc;
            }

            if (child.type === 'html' && child.value === '<br />') {
              return acc;
            }

            if (child.type === 'text') {
              return [
                ...acc,
                {
                  type: 'paragraph',
                  children: [{ type: 'text', value: child.value }],
                },
              ];
            }

            return [...acc, child];
          }, []);

          return {
            type: node.type,
            children: isEmpty(node.children) ? next([emptyParagraph]) : next(children),
          };
        },
      },
    });
  const _body = body
    .split('\n\n')
    .map(i => {
      if (i.includes('\n') && !i.includes('|\n|')) return i.split('\n').join('\n\n');

      return i;
    })
    .join('\n\n');
  let postParsed = [];

  _body.split('\n\n\n').forEach(i => {
    const blocks = processor.processSync(i.replaceAll('<p>&nbsp;</p>', '<p />')).result;

    if (isThread) {
      postParsed = [...postParsed, ...blocks, { text: ' ' }];
    } else if (isNewReview) {
      postParsed = [
        { type: 'paragraph', children: [{ text: '' }] },
        ...postParsed,
        ...blocks,
        { type: 'paragraph', children: [{ text: '' }] },
      ];
    } else {
      postParsed = [...postParsed, ...blocks, { type: 'paragraph', children: [{ text: '' }] }];
    }

    const isItemList = blocks[blocks.length - 1]?.type !== 'itemList';

    if (!isItemList) {
      postParsed.push({ type: 'paragraph', children: [{ text: '' }] });
    }
  });

  return postParsed;
};
