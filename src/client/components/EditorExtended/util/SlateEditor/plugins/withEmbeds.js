import { Transforms, Node, Element } from 'slate';
import { deserializeHtmlToSlate } from '../../constants';
import { CODE_BLOCK, PARAGRAPH_BLOCK } from '../utils/constants';
import { deserializeToSlate } from '../utils/parse';
import {
  safeResetSelection,
  getSafeSelectedElement,
  isInsideCodeBlock,
} from '../utils/safeSelection';

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
  const { isVoid, insertData, normalizeNode } = editor;

  /* eslint-disable no-param-reassign */
  editor.isVoid = element => (['video', 'image'].includes(element.type) ? true : isVoid(element));

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    let selectedElement = null;
    let isWrapped = false;

    try {
      selectedElement = getSafeSelectedElement(editor);
      isWrapped = selectedElement?.type?.includes(CODE_BLOCK);
    } catch (error) {
      console.warn('Error in withEmbeds normalizeNode:', error);
      safeResetSelection(editor);
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
      // Check if code block is empty or has only whitespace
      const isEmpty =
        node.children.length === 0 ||
        (node.children.length === 1 &&
          (node.children[0].text === '' || node.children[0].text.trim() === ''));

      if (isEmpty) {
        // Convert empty code block to paragraph
        Transforms.setNodes(editor, { type: PARAGRAPH_BLOCK }, { at: path });

        // Ensure it has a text node
        if (node.children.length === 0) {
          Transforms.insertNodes(editor, { text: '' }, { at: [...path, 0] });
        } else if (node.children[0].text.trim() === '') {
          // Clear the whitespace-only text
          Transforms.removeNodes(editor, { at: [...path, 0] });
          Transforms.insertNodes(editor, { text: '' }, { at: [...path, 0] });
        }

        return;
      }

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
        selectedElement = getSafeSelectedElement(editor);
        isWrapped = selectedElement?.type?.includes(CODE_BLOCK);
      } catch (error) {
        console.warn('Error in withEmbeds insertData:', error);
        safeResetSelection(editor);
      }

      // Check if HTML content looks like code
      const htmlText = _html.toLowerCase();
      const isHtmlCodeContent =
        htmlText.includes('<!doctype') ||
        htmlText.includes('<html') ||
        htmlText.includes('<head') ||
        htmlText.includes('<style') ||
        htmlText.includes('<script') ||
        (htmlText.includes('<pre') && htmlText.includes('<code')) ||
        (htmlText.includes('<code') && !htmlText.includes('</p>'));

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
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
          ...nodesNormalized,
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ];
      }

      if (isHtmlCodeContent && !isWrapped) {
        // Convert HTML code to code block - preserve the original HTML
        let textContent = _html;

        // If it's wrapped in pre/code tags, extract the content
        if (htmlText.includes('<pre') && htmlText.includes('<code')) {
          const preMatch = _html.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/i);

          if (preMatch) {
            textContent = preMatch[1];
          }
        } else if (htmlText.includes('<code')) {
          const codeMatch = _html.match(/<code[^>]*>([\s\S]*?)<\/code>/i);

          if (codeMatch) {
            textContent = codeMatch[1];
          }
        }

        // Decode HTML entities
        textContent = textContent
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .trim();

        const codeNode = {
          type: 'code',
          lang: 'html',
          children: [{ text: textContent }],
        };

        Transforms.insertNodes(editor, codeNode);
      } else {
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
      }
      cb(html);
      if (isWrapped) Transforms.move(editor, { unit: 'offset' });

      return;
    }

    const text = data.getData('text/plain');

    // Check if we're inside a code block
    let isWrapped = false;

    try {
      isWrapped = isInsideCodeBlock(editor);
    } catch (error) {
      console.warn('Error checking code block wrapper:', error);
      safeResetSelection(editor);
    }

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
    const isCodeBlock = /^```[\s\S]*?```$/m.test(text) || text?.includes('```');

    // Check if the pasted content looks like HTML/CSS/JS code
    const isHtmlCode = /<!DOCTYPE html|<html|<head|<body|<style|<script|<div|<span|<p|<h[1-6]|<ul|<ol|<li|<form|<input|<button|<img|<a\s+href/.test(
      text,
    );
    const isCssCode = /@media|@import|@keyframes|:root|\.\w+|#\w+|\w+\s*\{/.test(text);
    const isJsCode = /function\s+\w+|const\s+\w+|let\s+\w+|var\s+\w+|=>|\.addEventListener|document\.|window\./.test(
      text,
    );

    // More sophisticated code detection
    const hasCodeStructure = text.includes('<') && (text.includes('>') || text.includes('/>'));
    const hasMultipleLines = text.split('\n').length > 3;
    const hasIndentation = text.includes('  ') || text.includes('\t');
    const hasCodePatterns = /[{}();]/.test(text) || /<[^>]*>/.test(text);

    const looksLikeCode =
      isHtmlCode ||
      isCssCode ||
      isJsCode ||
      (hasCodeStructure && hasMultipleLines && text.length > 100) ||
      (hasCodePatterns && hasMultipleLines && hasIndentation);

    if (isCodeBlock) {
      // Handle markdown code block paste
      const codeMatch = text.match(/^```(\w+)?\n([\s\S]*?)```$/m);

      if (codeMatch) {
        const [, language, codeContent] = codeMatch;
        const codeNode = {
          type: 'code',
          lang: language || 'javascript',
          children: [{ text: codeContent.trim() }],
        };

        Transforms.insertNodes(editor, codeNode);

        return;
      }
    }

    if (looksLikeCode && text.length > 50) {
      // Handle direct code paste - detect language
      let detectedLang = 'javascript';

      if (isHtmlCode) detectedLang = 'html';
      else if (isCssCode) detectedLang = 'css';
      else if (isJsCode) detectedLang = 'javascript';

      const codeNode = {
        type: 'code',
        lang: detectedLang,
        children: [{ text }],
      };

      Transforms.insertNodes(editor, codeNode);

      return;
    }

    if (isWrapped && text) {
      // When inside code block, insert text directly preserving line breaks
      Transforms.insertText(editor, text);

      return;
    }

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
