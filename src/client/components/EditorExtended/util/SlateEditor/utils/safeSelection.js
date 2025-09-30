import { Transforms, Node, Editor } from 'slate';

/**
 * Safely gets the selected element path from editor selection
 * @param {Editor} editor - The Slate editor instance
 * @returns {Array|null} - The selected element path or null if invalid
 */
export const getSafeSelectedElementPath = editor => {
  try {
    if (!editor.selection?.anchor?.path || editor.selection.anchor.path.length === 0) {
      return null;
    }

    const selectedElementPath = editor.selection.anchor.path.slice(0, -1);

    if (!Node.has(editor, selectedElementPath)) {
      return null;
    }

    return selectedElementPath;
  } catch (error) {
    console.warn('Error getting safe selected element path:', error);
    return null;
  }
};

/**
 * Safely resets editor selection to the beginning of the first node
 * @param {Editor} editor - The Slate editor instance
 */
export const safeResetSelection = editor => {
  try {
    if (editor.selection && editor.children.length > 0) {
      Transforms.select(editor, Editor.start(editor, [0]));
    }
  } catch (error) {
    console.warn('Error resetting selection:', error);
  }
};

/**
 * Safely gets the selected element from editor
 * @param {Editor} editor - The Slate editor instance
 * @returns {Object|null} - The selected element or null if invalid
 */
export const getSafeSelectedElement = editor => {
  try {
    const selectedElementPath = getSafeSelectedElementPath(editor);

    if (!selectedElementPath) {
      return null;
    }

    return Node.descendant(editor, selectedElementPath);
  } catch (error) {
    console.warn('Error getting safe selected element:', error);
    return null;
  }
};

/**
 * Checks if the current selection is inside a code block
 * @param {Editor} editor - The Slate editor instance
 * @returns {boolean} - True if inside code block, false otherwise
 */
export const isInsideCodeBlock = editor => {
  try {
    const selectedElement = getSafeSelectedElement(editor);

    return selectedElement?.type === 'code';
  } catch (error) {
    console.warn('Error checking if inside code block:', error);

    return false;
  }
};
