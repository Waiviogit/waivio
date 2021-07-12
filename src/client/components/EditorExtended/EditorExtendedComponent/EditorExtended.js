import React from 'react';
import { get, size } from 'lodash';
import PropTypes from 'prop-types';
import { Input, message } from 'antd';
import { injectIntl } from 'react-intl';
import { convertToRaw, SelectionState } from 'draft-js';
import { fromMarkdown, Editor as MediumDraftEditor, createEditorState } from '../index';
import { SIDE_BUTTONS } from '../model/content';
import { checkCursorInSearch, parseImagesFromBlocks } from '../../../helpers/editorHelper';
import { getSelection, getSelectionRect } from "../util";

const MAX_LENGTH = 255;

const Editor = props => {
  const {
    editorExtended: { editorState, isMounted, editorEnabled, titleValue },
  } = props;
  const refsEditor = React.useRef();

  React.useEffect(() => {
    props.setUpdatedEditorExtendedData({
      isMounted: true,
      titleValue: get(props, 'initialContent.title', ''),
      editorState: createEditorState(fromMarkdown(props.initialContent)),
    });
    restoreObjects(fromMarkdown(props.initialContent));
  }, []);

  React.useEffect(() => setFocusAfterMount(), [isMounted, props.draftId]);

  const onChange = updatedEditorState => {
    const { editorState: prevEditorState } = props.editorExtended;

    props.setUpdatedEditorExtendedData({ editorState: updatedEditorState, prevEditorState });
  };

  const setFocusAfterMount = () => {
    props.setUpdatedEditorExtendedData({ editorEnabled: true });
  };

  const restoreObjects = (rawContent, newObject) => {
    const newLinkedObjectsCards = props.getRestoreObjects(rawContent, newObject, props.draftId);

    props.setUpdatedEditorData({ hideLinkedObjects: newLinkedObjectsCards });
  };

  const handleContentChange = updatedEditorState => {
    const updatedEditorStateParsed = parseImagesFromBlocks(updatedEditorState);
    const searchInfo = checkCursorInSearch(updatedEditorStateParsed);

    if (searchInfo.isNeedOpenSearch && !props.isShowEditorSearch) {
      const selectionState = updatedEditorStateParsed.getSelection();
      const newSelection = new SelectionState({
        anchorKey: selectionState.getAnchorKey(),
        focusKey: selectionState.getFocusKey(),
        anchorOffset: searchInfo.startPositionOfWord,
        focusOffset: searchInfo.startPositionOfWord,
      });
      const nativeSelection = getSelection(window);
      const selectionBoundary = getSelectionRect(nativeSelection);

      props.setCursorCoordinates({
        selectionBoundary,
        selectionState: newSelection,
        searchString: searchInfo.searchString,
        wordForCountWidth: searchInfo.wordForCountWidth,
      });
      props.setShowEditorSearch(true);
    }

    onChange(updatedEditorStateParsed);
    props.onChange(
      convertToRaw(updatedEditorStateParsed.getCurrentContent()),
      props.editorExtended.titleValue,
    );
  };

  const validateLength = event => {
    const updatedTitleValue = event.target.value;

    props.setUpdatedEditorExtendedData({ titleValue: updatedTitleValue });
    props.onChange(convertToRaw(editorState.getCurrentContent()), updatedTitleValue);
    if (size(updatedTitleValue) === MAX_LENGTH) {
      message.error(
        props.intl.formatMessage({
          id: 'title_error_too_long',
          defaultMessage: "Title can't be longer than 255 characters.",
        }),
      );
    }
  };

  const isVimeo = get(props, 'initialContent.body', '').includes('player.vimeo.com');

  return (
    <div className="waiv-editor-wrap">
      {props.displayTitle && (
        <Input.TextArea
          autoSize
          value={titleValue}
          maxLength={MAX_LENGTH}
          className="md-RichEditor-title"
          onChange={validateLength}
          placeholder={props.intl.formatMessage({ id: 'title', defaultMessage: 'Title' })}
        />
      )}
      <div className="waiv-editor">
        {isMounted && (
          <MediumDraftEditor
            ref={refsEditor}
            intl={props.intl}
            isVimeo={isVimeo}
            editorState={editorState}
            sideButtons={SIDE_BUTTONS}
            onChange={handleContentChange}
            handleHashtag={props.handleHashtag}
            isShowEditorSearch={props.isShowEditorSearch}
            handleObjectSelect={props.handleObjectSelect}
            editorEnabled={editorEnabled && props.enabled}
            setShowEditorSearch={props.setShowEditorSearch}
            setSearchCoordinates={props.setCursorCoordinates}
            placeholder={props.intl.formatMessage({
              id: 'story_placeholder',
              defaultMessage: 'Write your story...',
            })}
            handlePastedText={props.handlePasteTest}
          />
        )}
      </div>
    </div>
  );
};

const propTypes = {
  initialContent: PropTypes.shape({
    body: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  intl: PropTypes.shape(),
  onChange: PropTypes.func,
  draftId: PropTypes.string,
  displayTitle: PropTypes.bool,
  handleHashtag: PropTypes.func,
  handlePasteTest: PropTypes.func,
  getRestoreObjects: PropTypes.func,
  enabled: PropTypes.bool.isRequired,
  editorExtended: PropTypes.shape().isRequired,
  handleObjectSelect: PropTypes.func.isRequired,
  isShowEditorSearch: PropTypes.bool.isRequired,
  setShowEditorSearch: PropTypes.func.isRequired,
  setUpdatedEditorData: PropTypes.func.isRequired,
  setCursorCoordinates: PropTypes.func.isRequired,
  setUpdatedEditorExtendedData: PropTypes.func.isRequired,
};

const defaultProps = {
  intl: {},
  onChange: () => {},
  handleHashtag: () => {},
  handlePasteTest: () => {},
  displayTitle: true,
  draftId: '',
  linkedObjects: [],
  getRestoreObjects: () => {},
};

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default injectIntl(Editor);
