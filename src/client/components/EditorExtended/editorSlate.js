import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'draft-js/dist/Draft.css';
import uuidv4 from 'uuid/v4';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { message } from 'antd';
import classNames from 'classnames';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Transforms, Node, Range } from 'slate';
import { withHistory } from 'slate-history';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { isKeyHotkey } from 'is-hotkey';
import { injectIntl } from 'react-intl';
import { checkCursorInSearchSlate } from '../../../common/helpers/editorHelper';
import useQuery from '../../../hooks/useQuery';

import { encodeImageFileAsURL, SIDE_BUTTONS_SLATE } from './model/content';
import EditorSearchObjects from './components/EditorSearchObjects';
import { getSelection, getSelectionRect } from './util';
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
import createParagraph, { wrapWithParagraph } from './util/SlateEditor/utils/paragraph';
import withLists from './util/SlateEditor/plugins/withLists';
import {
  focusEditorToEnd,
  focusEditorToStart,
  removeAllInlineFormats,
  resetEditorState,
} from './util/SlateEditor/utils/SlateUtilityFunctions';
import { pipe } from '../../../common/helpers';
import {
  handlePasteText,
  setClearState,
  setEditor,
  setShowEditorSearch,
  setCursorCoordinates,
} from '../../../store/slateEditorStore/editorActions';
import { HEADING_BLOCKS } from './util/SlateEditor/utils/constants';

import './index.less';

const useEditor = props => {
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

  return editor;
};

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
    isComment,
    isMainEditor,
    initialPosTopBtn,
    clearEditor,
    ADD_BTN_DIF,
    isNewReview,
    parentPost,
    startToSearching,
    isLoading,
  } = props;

  const params = useParams();
  const query = useQuery();
  const [initiallized, setInitiallized] = useState(false);
  const [draftInit, setDraftInit] = useState(!!params[0]);
  const editor = useEditor(props);

  const editorRef = useRef(null);
  const handlePastedFiles = async event => {
    const html = event.clipboardData.getData('text/html');

    if (html) return;

    const uploadedImages = [];

    const dT = event.clipboardData || (window && window.clipboardData);

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

    // image of uploading from editor not removed in feeds without that hack
    Transforms.insertNodes(editor, [wrapWithParagraph([imageBlock]), createParagraph('')]);
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

    if (event.keyCode === 51) {
      const searchInfo = checkCursorInSearchSlate(editor, props.isShowEditorSearch);
      const nativeSelection = getSelection(window);
      const selectionBoundary = getSelectionRect(nativeSelection);

      props.setCursorCoordinates({
        selectionBoundary,
        selectionState: editor.selection,
        searchString: searchInfo.searchString,
      });

      props.setShowEditorSearch(true);

      return true;
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
    'md-RichEditor-root-small': props.small,
  });

  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  useEffect(() => {
    setDraftInit(true);
  }, [query.get('draft')]);

  const handleChange = newState => {
    if (!draftInit) onChange(editor);
    setDraftInit(false);
    setValue(newState);
  };

  const renderElement = useCallback(newProps => <Element {...newProps} />, []);
  const renderLeaf = useCallback(newProps => <Leaf {...newProps} />, []);

  useEffect(
    () => () => {
      resetEditorState(editor);
      clearEditor();
    },
    [],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') window.slateEditor = editor;
    props.setEditor(editor);
    if (props.setEditorCb) props.setEditorCb(editor);
    if (!isComment && !isNewReview) setTimeout(() => focusEditorToEnd(editor), 200);
    setInitiallized(true);
    if (isNewReview) {
      focusEditorToStart(editor);
    }
    const id = setTimeout(() => setInitiallized(false), 1500);

    return () => clearTimeout(id);
  }, [params]);

  useEffect(() => {
    if ((body || initialBody) && initiallized) {
      setInitiallized(false);
      const postParsed = deserializeToSlate(body || initialBody, false, isNewReview);

      resetEditorState(editor);
      Transforms.insertFragment(editor, postParsed, { at: [0, 0] });
      const lastBlock = editor.children?.[editor.children.length - 1];

      /* add an empty space if it doesn't exist in the end  */
      if (!(lastBlock?.type === 'paragraph' && lastBlock?.children?.[0].text === '')) {
        Transforms.insertNodes(editor, createEmptyNode());
      }

      Transforms.deselect(editor);
      if (!isComment && !isNewReview) focusEditorToEnd(editor);
      if (isNewReview) focusEditorToStart(editor);
    }
  }, [body, initiallized]);

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <div className={RichEditorRootClassNamesList} ref={editorRef}>
        <div className={editorClass}>
          {isShowEditorSearch && (
            <EditorSearchObjects
              handleObjectSelect={isComment || isMainEditor ? handleObjectSelect : null}
              editor={editor}
              isComment={isComment}
              startToSearching={startToSearching}
              isLoading={isLoading}
            />
          )}
          <Toolbar editorNode={editorRef.current} intl={intl} />
          <Editable
            placeholder={placeholder}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={handleKeyCommand}
            onDrop={handleDroppedFiles}
            onFocus={() => {
              props.setEditor(editor);
              if (props.onFocus) props.onFocus();
            }}
            onBlur={() => {
              // editor.lastSelection = editor.selection;
            }}
            spellCheck={false}
            onPaste={handlePastedFiles}
            style={{ minHeight: props.minHeight || '150px' }}
          />
          <AddButtonSlate
            parentPost={parentPost}
            editor={editor}
            sideButtons={SIDE_BUTTONS_SLATE}
            handleHashtag={handleHashtag}
            handleObjectSelect={handleObjectSelect}
            editorNode={editorRef.current}
            isComment={isComment}
            isCommentEdit={props.isCommentEdit}
            size={isComment ? 25 : 30}
            initialPosTop={initialPosTopBtn}
            ADD_BTN_DIF={ADD_BTN_DIF}
          />
        </div>
      </div>
    </Slate>
  );
};

EditorSlate.propTypes = {
  editorEnabled: PropTypes.bool,
  startToSearching: PropTypes.bool,
  isShowEditorSearch: PropTypes.bool,
  isVimeo: PropTypes.bool,
  isLoading: PropTypes.bool,
  setCursorCoordinates: PropTypes.func,
  setShowEditorSearch: PropTypes.func,
  body: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
  parentPost: PropTypes.shape(),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  handleObjectSelect: PropTypes.func.isRequired,
  handleHashtag: PropTypes.func.isRequired,
  initialBody: PropTypes.string,
  handlePasteText: PropTypes.func,
  onFocus: PropTypes.func,
  setEditor: PropTypes.func,
  setEditorCb: PropTypes.func,
  isComment: PropTypes.bool,
  isMainEditor: PropTypes.bool,
  isCommentEdit: PropTypes.bool,
  small: PropTypes.bool,
  isNewReview: PropTypes.bool,
  minHeight: PropTypes.string,
  initialPosTopBtn: PropTypes.string,
  clearEditor: PropTypes.func,
  ADD_BTN_DIF: PropTypes.number,
};

EditorSlate.defaultProps = {
  editorEnabled: false,
  isShowEditorSearch: false,
  isNewReview: false,
  isVimeo: false,
  placeholder: '',
  initialBody: '',
  handlePasteText: () => {},
  setEditor: () => {},
  isComment: false,
  small: false,
  minHeight: '',
  initialPosTopBtn: '',
  setEditorCb: null,
  ADD_BTN_DIF: 14,
};

const mapStateToProps = store => ({
  body: getEditorDraftBody(store),
});

const mapDispatchToProps = dispatch => ({
  handlePasteText: html => dispatch(handlePasteText(html)),
  setShowEditorSearch: isShowEditorSearch => dispatch(setShowEditorSearch(isShowEditorSearch)),
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  setEditor: editor => dispatch(setEditor({ editor })),
  clearEditor: () => dispatch(setClearState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EditorSlate));
