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

// deserializeInlineMarks.js

function deserializeInlineMarks(node, marks = {}) {
  if (!node) return [];

  if (node.type === 'text') {
    return [{ text: node.value || '', ...marks }];
  }

  if (node.type === 'strong') {
    return node.children.flatMap(child =>
      deserializeInlineMarks(child, { ...marks, strong: true }),
    );
  }

  if (node.type === 'em') {
    return node.children.flatMap(child =>
      deserializeInlineMarks(child, { ...marks, italic: true }),
    );
  }

  if (node.type === 'delete') {
    return node.children.flatMap(child =>
      deserializeInlineMarks(child, { ...marks, strikethrough: true }),
    );
  }

  if (node.type === 'u') {
    return node.children.flatMap(child =>
      deserializeInlineMarks(child, { ...marks, underline: true }),
    );
  }

  if (node.type === 'inlineCode') {
    return node.children.flatMap(child => deserializeInlineMarks(child, { ...marks, code: true }));
  }

  if (node.type === 'sup') {
    return node.children.flatMap(child =>
      deserializeInlineMarks(child, { ...marks, superscript: true }),
    );
  }

  if (node.type === 'sub') {
    return node.children.flatMap(child =>
      deserializeInlineMarks(child, { ...marks, subscript: true }),
    );
  }

  if (node.type === 'mark') {
    return node.children.flatMap(child =>
      deserializeInlineMarks(child, { ...marks, highlight: true }),
    );
  }

  if (node.type === 'link' && node.url) {
    return [
      {
        type: 'link',
        url: node.url,
        children: node.children.flatMap(child => deserializeInlineMarks(child, marks)),
      },
    ];
  }

  if (!node.type && node.value) {
    return [{ text: node.value, ...marks }];
  }

  return [];
}

const emptyParagraph = {
  type: 'paragraph',
  children: [{ text: '' }],
};

const isIgnoredHtmlTag = value =>
  [
    '<li>',
    '</li>',
    '</ol>',
    '</ul>',
    '<br />',
    '</h1>',
    '</h2>',
    '</h3>',
    '</h4>',
    '</blockquote>',
  ].includes(value);

const createHeaderNode = (value, children, index) => {
  const headerLevel = parseInt(value.match(/<h(\d)>/)[1], 10);
  const headerTypes = {
    1: 'headingOne',
    2: 'headingTwo',
    3: 'headingThree',
    4: 'headingFour',
  };

  return {
    type: headerTypes[headerLevel],
    children: [{ text: children[index + 1]?.value || '' }],
  };
};

const createBlockquoteNode = (children, index) => ({
  type: 'blockquote',
  children: [{ text: children[index + 1]?.value || '' }],
});

function htmlArrayToSlateList(htmlArray) {
  const slateList = [];
  let currentList = null;

  htmlArray.forEach(node => {
    if (node.type === 'html' && node.value === '<ol>') {
      currentList = { type: 'orderedList', children: [] };
    } else if (node.type === 'html' && node.value === '<ul>') {
      currentList = { type: 'unorderedList', children: [] };
    } else if (node.type === 'html' && ['</ol>', '</ul>'].includes(node.value)) {
      if (currentList) {
        slateList.push(currentList);
        currentList = null;
      }
    } else if (node.type === 'html' && node.value === '<li>') {
      if (currentList && Array.isArray(currentList.children)) {
        currentList.children.push({
          type: 'listItem',
          children: [],
        });
      }
    } else if (node.type === 'text' && currentList && Array.isArray(currentList.children)) {
      const lastItem = currentList.children[currentList.children.length - 1];

      if (lastItem && Array.isArray(lastItem.children)) {
        lastItem.children.push({ text: node.value });
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

          if (node.children[0].type === 'image') {
            return {
              type: 'image',
              ...node.children[0],
              href: node.url,
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
        listItem: (node, next) => ({
          type: 'listItem',
          children: next(node.children),
        }),
        tableCell: node => {
          const children = node.children.reduce((acc, child, i) => {
            const prevEl = node.children[i - 1];
            const nextEl = node.children[i + 1];

            if (
              (child.type === 'html' && isIgnoredHtmlTag(child.value)) ||
              (prevEl?.type === 'html' &&
                prevEl?.value !== '<br />' &&
                child.type === 'text' &&
                nextEl?.type === 'html' &&
                prevEl?.value !== '<br />')
            ) {
              return acc;
            }

            if (child.type === 'html' && child.value === '<p />') {
              return [...acc, emptyParagraph];
            }

            if (child.type === 'html' && ['<ol>', '<ul>'].includes(child.value)) {
              const list = htmlArrayToSlateList(node.children);

              return [...acc, ...list];
            }

            if (child.type === 'html' && ['<h1>', '<h2>', '<h3>', '<h4>'].includes(child.value)) {
              return [...acc, createHeaderNode(child.value, node.children, i)];
            }

            if (child.type === 'html' && child.value === '<blockquote>') {
              return [...acc, createBlockquoteNode(node.children, i)];
            }

            if (child.type === 'text') {
              return [
                ...acc,
                {
                  type: 'paragraph',
                  children: [{ text: child.value }],
                },
              ];
            }

            if (child.type === 'image') {
              return [
                ...acc,
                {
                  type: 'paragraph',
                  children: [
                    { type: 'paragraph', children: [{ text: '' }] },
                    {
                      type: 'image',
                      url: child.url,
                      alt: child.alt,
                      children: [{ text: '' }],
                    },
                    { type: 'paragraph', children: [{ text: '' }] },
                  ],
                },
              ];
            }

            if (child.type === 'link') {
              if (child.children[0].type === 'image') {
                return [
                  ...acc,
                  { type: 'paragraph', children: [{ text: '' }] },
                  {
                    type: 'image',
                    ...child.children[0],
                    href: child.url,
                    children: [{ text: '' }],
                  },
                  { type: 'paragraph', children: [{ text: '' }] },
                ];
              }

              return [
                ...acc,
                {
                  type: 'paragraph',
                  children: [
                    emptyParagraph,
                    {
                      type: 'link',
                      url: child.url,
                      children: child.children.map(cld => {
                        if (cld.type === 'text') {
                          return { text: cld.value };
                        }

                        return cld;
                      }),
                    },
                    emptyParagraph,
                  ],
                },
              ];
            }

            if (
              ['strong', 'em', 'delete', 'inlineCode', 'u', 'mark', 'sup', 'sub'].includes(
                child.type,
              )
            ) {
              return [
                ...acc,
                {
                  type: 'paragraph',
                  children: deserializeInlineMarks(child),
                },
              ];
            }

            return [...acc, child];
          }, []);

          return {
            type: node.type,
            children: isEmpty(children) ? [emptyParagraph] : children,
          };
        },
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
            if (node.children[i].type === 'html' && node.children[i].value === '</hr>') {
              children.push({ children: [{ text: '' }], type: 'thematicBreak' });
              i++;
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
    const lastNode = blocks[blocks.length - 1];
    const hasVideo = lastNode
      ? lastNode?.children?.every(
          child => child.type === 'video' || (child.text !== undefined && child.text.trim() === ''),
        )
      : false;

    if (hasVideo) {
      postParsed = [...postParsed, ...blocks];
    } else if (isThread) {
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
