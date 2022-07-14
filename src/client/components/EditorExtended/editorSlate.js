import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'draft-js/dist/Draft.css';
import uuidv4 from 'uuid/v4';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { message } from 'antd';
import classNames from 'classnames';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Editor, Transforms, Node, Range } from 'slate';
import { withHistory } from 'slate-history';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { isKeyHotkey } from 'is-hotkey';

import { encodeImageFileAsURL, SIDE_BUTTONS_SLATE } from './model/content';
import EditorSearchObjects from './components/EditorSearchObjects';
import withEmbeds from './util/SlateEditor/plugins/withEmbeds';
import withTables from './util/SlateEditor/plugins/withTable';
import withLinks from './util/SlateEditor/plugins/withLinks';
import { Leaf, Element } from './util/SlateEditor/Editor';
import Toolbar from './util/SlateEditor/toolbar/toolbar';
import AddButtonSlate from './components/addbuttonSlate';
import withObjects from './util/SlateEditor/plugins/withObjects';
import { deserializeToSlate } from './util/SlateEditor/utils/parse';
import { getEditorDraftBody } from '../../../store/slateEditorStore/editorSelectors';
import { createEmptyNode, createImageNode } from './util/SlateEditor/utils/embed';
import { wrapWithParagraph } from './util/SlateEditor/utils/paragraph';
import withLists from './util/SlateEditor/plugins/withLists';
import {
  focusEditorToEnd,
  removeAllInlineFormats,
} from './util/SlateEditor/utils/SlateUtilityFunctions';
import { pipe } from '../../../common/helpers';
import { handlePasteText, setEditor } from '../../../store/slateEditorStore/editorActions';
import { HEADING_BLOCKS } from './util/SlateEditor/utils/constants';

import './index.less';

const EditorSlate = props => {
  const {
    editorEnabled,
    isShowEditorSearch,
    isVimeo,
    body,
    intl,
    onChange,
    placeholder,
    handleHashtag,
    handleObjectSelect,
    initialBody,
  } = props;

  const params = useParams();
  const [prevParams, setParams] = useState(null);
  const editorRef = useRef(null);

  const handlePastedFiles = async event => {
    const html = event.clipboardData.getData('text/html');

    if (html) return;

    const uploadedImages = [];

    const dT = event.clipboardData || window.clipboardData;

    if (dT.files === 0) {
      console.error('no image found');

      return;
    }

    // Only support one image
    if (dT.files > 1) {
      console.error('only support one image');

      return;
    }

    const image = dT.files[0];

    if (!image || !image.type.includes('image/')) return;

    message.info(
      intl.formatMessage({
        id: 'notify_uploading_image',
        defaultMessage: 'Uploading image',
      }),
    );

    const insertImage = (file, fileName = 'image') => {
      const newImage = {
        src: file,
        name: fileName,
        id: uuidv4(),
      };

      uploadedImages.push(newImage);
    };

    // Prepare URL on images
    await encodeImageFileAsURL(image, insertImage);

    const currentImage = uploadedImages[0];

    // Add empty block after image
    const imageBlock = createImageNode(currentImage.name, {
      url: `${
        currentImage.src.startsWith('http') ? currentImage.src : `https://${currentImage.src}`
      }`,
    });

    Transforms.insertNodes(editor, [wrapWithParagraph([imageBlock])]);
  };

  // Drug and drop method
  const handleDroppedFiles = async event => {
    message.info(
      intl.formatMessage({
        id: 'notify_uploading_image',
        defaultMessage: 'Uploading image',
      }),
    );
    event.preventDefault();
    const files = [...event.dataTransfer.files];

    const uploadedImages = [];
    const filteredFiles = files.filter(file => file.type.indexOf('image/') === 0);

    const insertImage = (file, fileName = 'image') => {
      const newImage = {
        src: file,
        name: fileName,
        id: uuidv4(),
      };

      uploadedImages.push(newImage);
    };

    if (!filteredFiles.length) {
      return 'not_handled';
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      await encodeImageFileAsURL(file, insertImage);
    }

    // eslint-disable-next-line array-callback-return
    uploadedImages.forEach(item => {
      const imageBlock = createImageNode(item.name, {
        url: `${item.src.startsWith('http') ? item.src : `https://${item.src}`}`,
      });

      Transforms.insertNodes(editor, [imageBlock]);
    });

    return true;
  };

  const handleKeyCommand = event => {
    if (event.altKey || event.metaKey || event.ctrlKey) return false;
    const { selection } = editor;

    if (event.key === 'Enter') {
      const selectedElement = Node.descendant(editor, editor.selection.anchor.path.slice(0, -1));

      if (
        HEADING_BLOCKS.includes(selectedElement.type) ||
        (['blockquote'].includes(selectedElement.type) && !isKeyHotkey('shift+enter', event))
      ) {
        const selectedLeaf = Node.descendant(editor, editor.selection.anchor.path);

        if (selectedLeaf.text.length === editor.selection.anchor.offset) {
          setTimeout(() => {
            Transforms.setNodes(editor, { type: 'paragraph' });
          }, 0);
        }
      } else if (isSoftNewlineEvent(event)) {
        event.preventDefault();
        editor.insertText('\n');

        return true;
      }
    }
    if (event.keyCode === 32) {
      removeAllInlineFormats(editor);

      return false;
    }
    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;

      if (isKeyHotkey('left', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset', reverse: true });

        return true;
      }

      if (isKeyHotkey('right', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset' });

        return true;
      }
    }

    return false;
  };

  const editorClass = `md-RichEditor-editor Body Body--full public-DraftEditor-content${
    !editorEnabled ? ' md-RichEditor-readonly' : ''
  }`;
  const RichEditorRootClassNamesList = classNames('md-RichEditor-root', {
    'md-RichEditor-root-vimeo': isVimeo,
  });

  const editor = useMemo(
    () =>
      pipe(
        createEditor,
        withObjects,
        withLists,
        withReact,
        withLinks,
        withTables,
        withEmbeds(props.handlePasteText),
        withHistory,
      )(),
    [],
  );
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const handleChange = newState => {
    onChange(editor);
    setValue(newState);
  };

  const renderElement = useCallback(newProps => <Element {...newProps} />, []);
  const renderLeaf = useCallback(newProps => <Leaf {...newProps} />, []);

  useEffect(() => {
    window.slateEditor = editor;
    props.setEditor(editor);
    const editorEl = document.querySelector('[data-slate-editor="true"]');

    editorEl.style.minHeight = `100px`;
    setTimeout(() => focusEditorToEnd(editor), 200);
  }, [params]);

  useEffect(() => {
    if (!body) setParams(params);
    if (body && prevParams !== params) {
      setParams(params);
      // setBody(body);
      const postParsed = deserializeToSlate(body || initialBody);

      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
      Transforms.insertFragment(editor, postParsed, { at: [0, 0] });
      const lastBlock = editor.children?.[editor.children.length - 1];

      /* add an empty space if it doesn't exist in the end  */
      if (!(lastBlock?.type === 'paragraph' && lastBlock?.children?.[0].text === '')) {
        Transforms.insertNodes(editor, createEmptyNode());
      }
      Transforms.deselect(editor);
      focusEditorToEnd(editor);
    }
  }, [body]);

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <div className={RichEditorRootClassNamesList} ref={editorRef}>
        <div className={editorClass}>
          {isShowEditorSearch && <EditorSearchObjects editor={editor} />}
          <Toolbar editorNode={editorRef.current} intl={intl} />
          <Editable
            placeholder={placeholder}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={handleKeyCommand}
            onDrop={handleDroppedFiles}
            onBlur={() => {
              editor.lastSelection = editor.selection;
            }}
            spellCheck={false}
            onPaste={handlePastedFiles}
            style={{ minHeight: '150px' }}
          />
          <AddButtonSlate
            sideButtons={SIDE_BUTTONS_SLATE}
            handleHashtag={handleHashtag}
            handleObjectSelect={handleObjectSelect}
            editorNode={editorRef.current}
          />
        </div>
      </div>
    </Slate>
  );
};

EditorSlate.propTypes = {
  editorEnabled: PropTypes.bool,
  isShowEditorSearch: PropTypes.bool,
  isVimeo: PropTypes.bool,
  body: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  handleObjectSelect: PropTypes.func.isRequired,
  handleHashtag: PropTypes.func.isRequired,
  initialBody: PropTypes.string,
  handlePasteText: PropTypes.func,
  setEditor: PropTypes.func,
};

EditorSlate.defaultProps = {
  editorEnabled: false,
  isShowEditorSearch: false,
  isVimeo: false,
  placeholder: '',
  initialBody: '',
  handlePasteText: () => {},
  setEditor: () => {},
};

const mapStateToProps = store => ({
  body: getEditorDraftBody(store),
});

const mapDispatchToProps = dispatch => ({
  handlePasteText: html => dispatch(handlePasteText(html)),
  setEditor: editor => dispatch(setEditor({ editor })),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorSlate);
