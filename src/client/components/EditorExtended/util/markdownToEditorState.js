import { parse } from '@textlint/markdown-to-ast';
import { last } from 'lodash';

import { getSrc } from './videoHelper';
import { ATOMIC_TYPES, Block, Entity } from './constants';
import { VIDEO_MATCH_URL } from '../../../../common/helpers/regexHelpers';
import { addSpaces } from '../../../../common/helpers/editorHelper';

const defaultInlineStyles = {
  Strong: {
    type: 'BOLD',
    symbol: '**',
  },
  Emphasis: {
    type: 'ITALIC',
    symbol: '*',
  },
  Code: {
    type: 'CODE',
    symbol: '```',
  },
};

const defaultBlockStyles = {
  List: 'unordered-list-item',
  Header1: 'header-one',
  Header2: 'header-two',
  Header3: 'header-three',
  Header4: 'header-four',
  Header5: 'header-five',
  Header6: 'header-six',
  CodeBlock: 'code-block',
  BlockQuote: 'blockquote',
  HorizontalRule: 'atomic',
};

const isVideoLink = url => Object.values(VIDEO_MATCH_URL).some(match => match.test(url));

const normalizeMd = content => {
  const regExp = new RegExp('<center>|</center>', 'g');

  return content.replace(regExp, '');
};

const getBlockStyleForMd = (node, blockStyles) => {
  const style = node.type;
  const ordered = node.ordered;
  const depth = node.depth;

  if (style === 'List' && ordered) {
    return 'ordered-list-item';
  } else if (style === 'Header') {
    return blockStyles[`${style}${depth}`];
  } else if (
    node.type === 'Paragraph' &&
    node.children &&
    node.children[0] &&
    node.children[0].type === 'Image'
  ) {
    return Block.IMAGE;
  } else if (node.type === 'Paragraph' && node.raw && isVideoLink(node.raw)) {
    return 'atomic';
  }

  return blockStyles[style];
};

const joinCodeBlocks = splitMd => {
  const opening = splitMd.indexOf('```');
  const closing = splitMd.indexOf('```', opening + 1);

  if (opening >= 0 && closing >= 0) {
    const codeBlock = splitMd.slice(opening, closing + 1);
    const codeBlockJoined = codeBlock.join('\n');
    const updatedSplitMarkdown = [
      ...splitMd.slice(0, opening),
      codeBlockJoined,
      ...splitMd.slice(closing + 1),
    ];

    return joinCodeBlocks(updatedSplitMarkdown);
  }

  return splitMd;
};

const splitMdBlocks = md => {
  const splitMd = md.split('\n');

  // Process the split markdown include the
  // one syntax where there's an block level opening
  // and closing symbol with content in the middle.
  const splitMdWithCodeBlocks = joinCodeBlocks(splitMd);

  return splitMdWithCodeBlocks;
};

const parseMdLine = (line, existingEntities, extraStyles = {}) => {
  const inlineStyles = { ...defaultInlineStyles, ...extraStyles.inlineStyles };
  const blockStyles = { ...defaultBlockStyles, ...extraStyles.blockStyles };
  const astString = parse(addSpaces(line));
  let text = '';
  const inlineStyleRanges = [];
  const entityRanges = [];
  const data = {};
  const entityMap = existingEntities;

  const addInlineStyleRange = (offset, length, style) => {
    inlineStyleRanges.push({ offset, length, style });
  };

  const getRawLength = children =>
    children.reduce((prev, current) => prev + (current.value ? current.value.length : 0), 0);

  const addObject = child => {
    const entityKey = Object.keys(entityMap).length;
    const urlParts = child.url.split('/');

    entityMap[entityKey] = {
      type: Entity.OBJECT,
      mutability: 'IMMUTABLE',
      data: {
        url: child.url,
        object: {
          id: last(urlParts),
        },
      },
    };
    entityRanges.push({
      key: entityKey,
      length: getRawLength(child.children),
      offset: text.length,
    });
  };

  const addLink = child => {
    const entityKey = Object.keys(entityMap).length;

    entityMap[entityKey] = {
      type: Entity.LINK,
      mutability: 'MUTABLE',
      data: {
        url: child.url,
      },
    };
    entityRanges.push({
      key: entityKey,
      length: getRawLength(child.children),
      offset: text.length,
    });
  };

  const addImage = child => {
    data.src = child.url;
    data.alt = child.alt || '';
  };

  const addVideo = child => {
    const src = child.raw;

    // RegEx: [[ embed url=<anything> ]]
    const url = getSrc({ src });

    const entityKey = Object.keys(entityMap).length;

    entityMap[entityKey] = {
      type: ATOMIC_TYPES.VIDEO,
      mutability: 'IMMUTABLE',
      data: {
        src: url,
      },
    };
    text = ' ';
    entityRanges.push({
      key: entityKey,
      length: 1,
      offset: 0,
    });
  };

  const addSeparator = child => {
    const entityKey = Object.keys(entityMap).length;

    entityMap[entityKey] = {
      type: ATOMIC_TYPES.SEPARATOR,
      mutability: 'IMMUTABLE',
      data: {},
    };
    entityRanges.push({
      key: entityKey,
      length: child.raw.length,
      offset: 0,
    });
  };

  const parseChildren = (child, style) => {
    // RegEx: [[ embed url=<anything> ]]
    const objectLinkRegEx = /\/object\//; // eslint-disable-line

    switch (child.type) {
      case 'Link':
        if (objectLinkRegEx.test(child.url)) {
          addObject(child);
        } else {
          addLink(child);
        }
        break;
      case 'Image':
        addImage(child);
        break;
      case 'HorizontalRule':
        addSeparator(child);
        text = child.raw;
        break;
      case 'Paragraph':
        if (isVideoLink(child.raw)) {
          addVideo(child);
        }
        break;
      default:
    }

    if (!isVideoLink(child.raw) && child.children && style) {
      const rawLength = getRawLength(child.children);

      addInlineStyleRange(text.length, rawLength, style.type);
      const newStyle = inlineStyles[child.type];

      child.children.forEach(grandChild => {
        parseChildren(grandChild, newStyle);
      });
    } else if (!isVideoLink(child.raw) && child.children) {
      const newStyle = inlineStyles[child.type];

      child.children.forEach(grandChild => {
        parseChildren(grandChild, newStyle);
      });
    } else {
      if (style) {
        addInlineStyleRange(text.length, child.value.length, style.type);
      }
      if (inlineStyles[child.type]) {
        addInlineStyleRange(text.length, child.value.length, inlineStyles[child.type].type);
      }
      text = `${text}${child.type === 'Image' || isVideoLink(child.raw) ? '' : child.value}`;
    }
  };

  astString.children.forEach(child => {
    const style = inlineStyles[child.type];

    parseChildren(child, style);
  });

  // add block style if it exists
  let blockStyle = 'unstyled';

  if (astString.children[0]) {
    const style = getBlockStyleForMd(astString.children[0], blockStyles);

    if (style) {
      blockStyle = style;
    }
  }

  return {
    text,
    inlineStyleRanges,
    entityRanges,
    data,
    blockStyle,
    entityMap,
  };
};

function mdToDraftjs({ body } = { body: '' }, extraStyles) {
  const blocks = [];
  let entityMap = {};

  if (body) {
    const paragraphs = splitMdBlocks(normalizeMd(body));
    // eslint-disable-next-line
    paragraphs.forEach(paragraph => {
      const result = parseMdLine(paragraph, entityMap, extraStyles);

      blocks.push({
        text: result.text,
        type: result.blockStyle,
        depth: 0,
        inlineStyleRanges: result.inlineStyleRanges,
        entityRanges: result.entityRanges,
        data: result.data,
      });
      entityMap = result.entityMap;
    });

    // add a default value
    // not sure why that's needed but Draftjs convertToRaw fails without it
    if (Object.keys(entityMap).length === 0) {
      entityMap = {
        data: '',
        mutability: '',
        type: '',
      };
    }
  }

  return {
    blocks,
    entityMap,
  };
}

export default mdToDraftjs;
