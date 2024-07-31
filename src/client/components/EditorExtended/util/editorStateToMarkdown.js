import { get } from 'lodash';
import unified from 'unified';
import { slateToRemark } from 'remark-slate-transformer';
import stringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import { ATOMIC_TYPES, Block, Entity } from './constants';

const defaultMarkdownDict = {
  BOLD: '**',
  ITALIC: '*',
  CODE: '```',
  // UNDERLINE: '++',
};

const blockStyleDict = {
  'unordered-list-item': '- ',
  'header-one': '# ',
  'header-two': '## ',
  'header-three': '### ',
  'header-four': '#### ',
  'header-five': '##### ',
  'header-six': '###### ',
  'atomic:break': '***',
  blockquote: '> ',
};

const wrappingBlockStyleDict = {
  'code-block': '```',
};

const getBlockStyle = (currentStyle, appliedBlockStyles) => {
  if (currentStyle === 'ordered-list-item') {
    const counter = appliedBlockStyles.reduce((prev, style) => {
      if (style === 'ordered-list-item') {
        return prev + 1;
      }

      return prev;
    }, 1);

    return `${counter}. `;
  }

  return blockStyleDict[currentStyle] || '';
};

const applyWrappingBlockStyle = (currentStyle, content, nextBlock, prevBlock) => {
  if (currentStyle in wrappingBlockStyleDict) {
    const wrappingSymbol = wrappingBlockStyleDict[currentStyle];
    const isPrevStyleSame = prevBlock && prevBlock.type === currentStyle;
    const isNextStyleSame = nextBlock && nextBlock.type === currentStyle;

    if (isPrevStyleSame && isNextStyleSame) {
      return content;
    } else if (isPrevStyleSame) {
      return `${content}\n${wrappingSymbol}`;
    } else if (isNextStyleSame) {
      return `${wrappingSymbol}\n${content}`;
    }

    return `${wrappingSymbol}\n${content}\n${wrappingSymbol}`;
  }

  return content;
};

const applyAtomicStyle = (block, entityMap, content) => {
  if (block.type.indexOf('atomic') === -1) return content;
  // strip the test that was added in the media block
  const strippedContent = content.substring(0, content.length - block.text.length);
  let type;
  let data;
  let text;

  if (block.type === Block.ATOMIC) {
    const key = block.entityRanges[0] && block.entityRanges[0].key;

    type = get(entityMap[key], 'type', null);
    data = get(entityMap[key], 'data', null);
  } else {
    type = block.type.split(':')[1] || 'atomic';
    data = block.data;
    text = block.text;
  }

  switch (type) {
    case ATOMIC_TYPES.SEPARATOR:
      return `${strippedContent}***`;
    case ATOMIC_TYPES.IMAGE:
      return `${strippedContent}<center>![${text || 'image'}](${data.src})</center>`;
    case ATOMIC_TYPES.VIDEO:
      return `${strippedContent}${data.url || data.src}`;
    default:
      return content;
  }
};

const getEntityStart = entity => {
  switch (entity.type) {
    case Entity.LINK:
    case Entity.OBJECT:
      return '[';
    default:
      return '';
  }
};

const getEntityEnd = entity => {
  switch (entity.type) {
    case Entity.LINK:
    case Entity.OBJECT:
      return `](${entity.data.url})`;
    default:
      return '';
  }
};

function fixWhitespacesInsideStyle(text, style) {
  const { symbol } = style;

  // Text before style-opening marker (including the marker)
  const pre = text.slice(0, style.range.start);
  // Text between opening and closing markers
  const body = text.slice(style.range.start, style.range.end);
  // Trimmed text between markers
  const bodyTrimmed = body.trim();
  // Text after closing marker
  const post = text.slice(style.range.end);

  const bodyTrimmedStart = style.range.start + body.indexOf(bodyTrimmed);

  // Text between opening marker and trimmed content (leading spaces)
  const prefix = text.slice(style.range.start, bodyTrimmedStart);
  // Text between the end of trimmed content and closing marker (trailing spaces)
  const postfix = text.slice(bodyTrimmedStart + bodyTrimmed.length, style.range.end);

  // Temporary text that contains trimmed content wrapped into original pre- and post-texts
  const newText = `${pre}${bodyTrimmed}${post}`;

  // Insert leading and trailing spaces between pre-/post- contents and their respective markers
  return newText.replace(
    `${symbol}${bodyTrimmed}${symbol}`,
    `${prefix}${symbol}${bodyTrimmed}${symbol}${postfix}`,
  );
}

function getInlineStyleRangesByLength(inlineStyleRanges) {
  return [...inlineStyleRanges].sort((a, b) => b.length - a.length);
}

function editorStateToMarkdown(raw, extraMarkdownDict) {
  const markdownDict = { ...defaultMarkdownDict, ...extraMarkdownDict };
  let returnString = '';
  const appliedBlockStyles = [];

  // totalOffset is a difference of index position between raw string and enhanced ones
  let totalOffset = 0;

  let isListType = false;

  get(raw, 'blocks', []).forEach((block, blockIndex) => {
    if (blockIndex !== 0) {
      returnString += '\n';
      totalOffset = 0;
      if (
        block.text &&
        block.type !== 'ordered-list-item' &&
        block.type !== 'unordered-list-item' &&
        block.type !== 'code-block' &&
        isListType
      ) {
        returnString += '\n';
      }
    }
    isListType = block.type === 'ordered-list-item' || block.type === 'unordered-list-item';

    // add block style
    returnString += getBlockStyle(block.type, appliedBlockStyles);
    appliedBlockStyles.push(block.type);

    const appliedStyles = [];

    const newString = block.text.split('').reduce((text, currentChar, index) => {
      let newText = text;
      const sortedInlineStyleRanges = getInlineStyleRangesByLength(block.inlineStyleRanges);

      // find all styled at this character
      const stylesStartAtChar = sortedInlineStyleRanges
        .filter(range => range.offset === index)
        .filter(range => markdownDict[range.style]); // disregard styles not defined in the md dict

      // add the symbol to the md string and push the style in the applied styles stack
      stylesStartAtChar.forEach(currentStyle => {
        const symbolLength = markdownDict[currentStyle.style].length;

        newText += markdownDict[currentStyle.style];
        totalOffset += symbolLength;
        appliedStyles.push({
          symbol: markdownDict[currentStyle.style],
          range: {
            start: currentStyle.offset + totalOffset,
            end: currentStyle.offset + currentStyle.length + totalOffset,
          },
          end: currentStyle.offset + (currentStyle.length - 1),
        });
      });

      // check for entityRanges starting and add if existing
      const entitiesStartAtChar = block.entityRanges.filter(range => range.offset === index);

      entitiesStartAtChar.forEach(entity => {
        newText += getEntityStart(raw.entityMap[entity.key]);
      });

      // add the current character to the md string
      newText += currentChar !== '\n' ? currentChar : '';

      // check for entityRanges ending and add if existing
      const entitiesEndAtChar = block.entityRanges.filter(
        range => range.offset + range.length - 1 === index,
      );

      entitiesEndAtChar.forEach(entity => {
        newText += getEntityEnd(raw.entityMap[entity.key]);
      });

      // apply the 'ending' tags for any styles that end in the current position in order (stack)
      while (appliedStyles.length !== 0 && appliedStyles[appliedStyles.length - 1].end === index) {
        const endingStyle = appliedStyles.pop();

        newText += endingStyle.symbol;

        newText = fixWhitespacesInsideStyle(newText, endingStyle);
        totalOffset += endingStyle.symbol.length;
      }

      return newText;
    }, '');

    returnString += applyWrappingBlockStyle(
      block.type,
      newString,
      raw.blocks[blockIndex + 1],
      raw.blocks[blockIndex - 1],
    );
    returnString = applyAtomicStyle(block, raw.entityMap, returnString);
  });

  return returnString;
}

export function editorStateToMarkdownSlate(value) {
  const processor = unified()
    .use(slateToRemark, {
      overrides: {
        headingOne: (node, next) => ({
          type: 'heading',
          depth: 1,
          children: next(node.children),
        }),
        headingTwo: (node, next) => ({
          type: 'heading',
          depth: 2,
          children: next(node.children),
        }),
        headingThree: (node, next) => ({
          type: 'heading',
          depth: 3,
          children: next(node.children),
        }),
        headingFour: (node, next) => ({
          type: 'heading',
          depth: 4,
          children: next(node.children),
        }),
        orderedList: (node, next) => ({
          type: 'list',
          children: next(node.children),
          ordered: true,
        }),
        unorderedList: (node, next) => ({
          type: 'list',
          children: next(node.children),
          ordered: false,
        }),
        bulletedList: (node, next) => ({
          type: 'list',
          children: next(node.children),
          ordered: false,
        }),
        paragraph: (node, next) => {
          const children = node.children.map(child => {
            if (child.text && child.underline) {
              const { text, ...modifiedChild } = child;

              return {
                ...modifiedChild,
                type: 'html',
                children: [{ text: `<u>${child.text}</u>` }],
              };
            }

            return child;
          });

          return {
            type: 'paragraph',
            children: next(children),
          };
        },
        video: node => ({
          type: 'text',
          value: node.url,
        }),
        object: (node, next) => {
          if (node.children[0].text) {
            return {
              type: 'link',
              url: node.url,
              children: next([{ text: node.hashtag }]),
            };
          }

          return {
            type: 'paragraph',
            children: next([{ text: '' }]),
          };
        },
      },
    })
    .use(remarkGfm)
    .use(stringify);

  const ast = processor.runSync({
    type: 'root',
    children: value,
  });

  return processor.stringify(ast);
}

export default editorStateToMarkdown;
