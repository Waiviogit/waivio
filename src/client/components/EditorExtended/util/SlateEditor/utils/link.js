import { Editor, Transforms, Path, Element, Range } from 'slate';
import { ReactEditor } from 'slate-react';

import createParagraph from './paragraph';

const createLinkNode = (url, text) => ({
  type: 'link',
  url,
  children: [{ text }],
});

const normalizeLink = url => {
  const lowerUrl = url.toLowerCase();
  let newUrl = url;

  if (lowerUrl.indexOf('http') !== 0 && lowerUrl.indexOf('mailto:') !== 0) {
    if (url.indexOf('@') >= 0) {
      newUrl = `mailto:${newUrl}`;
    } else {
      newUrl = `https://${newUrl}`;
    }
  }

  return newUrl;
};

export const removeLink = (editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  });
};

const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  });

  return !!link;
};

const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  });
};

export const wrapLink = (editor, url) => {
  const normalizedUrl = normalizeLink(url);

  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url: normalizedUrl,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const insertLink = (editor, url) => {
  if (!url) return;

  const { selection } = editor;
  const link = createLinkNode(url, 'New Link');

  ReactEditor.focus(editor);

  if (selection) {
    const [parentNode, parentPath] = Editor.parent(editor, selection.focus?.path);

    // Remove the Link node if we're inserting a new link node inside of another
    // link.
    if (parentNode.type === 'link') {
      removeLink(editor);
    }

    if (editor.isVoid(parentNode)) {
      // Insert the new link after the void node
      Transforms.insertNodes(editor, createParagraph([link]), {
        at: Path.next(parentPath),
        select: true,
      });
    } else if (selection.isCollapsed) {
      // Insert the new link in our last known location
      Transforms.insertNodes(editor, link, { select: true });
    } else {
      // Wrap the currently selected range of text into a Link
      Transforms.wrapNodes(editor, link, { split: true });
      // Remove the highlight and move the cursor to the end of the highlight
      Transforms.collapse(editor, { edge: 'end' });
    }
  } else {
    // Insert the new link node at the bottom of the Editor when selection
    // is falsey
    Transforms.insertNodes(editor, createParagraph([link]));
  }
};

export default insertLink;
