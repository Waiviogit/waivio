import React, { useCallback, useRef } from 'react';
import { debounce, get, size } from 'lodash';
import PropTypes from 'prop-types';
import { Input, message } from 'antd';
import { injectIntl } from 'react-intl';
import { fromMarkdown, createEditorState } from '../index';
import MediumDraftEditor from '../editorSlate';
import { SIDE_BUTTONS } from '../model/content';
import { checkCursorInSearchSlate } from '../../../../common/helpers/editorHelper';
import { getSelection, getSelectionRect } from '../util';

const MAX_LENGTH = 255;

const Editor = props => {
  const {
    editorExtended: { editorState, isMounted, editorEnabled, titleValue },
  } = props;
  const [prevSearchValue, setPrevSearch] = React.useState('');
  const abortController = useRef(null);

  React.useEffect(() => {
    props.setUpdatedEditorExtendedData({
      isMounted: true,
      titleValue: get(props, 'initialContent.title', ''),
      editorState: createEditorState(fromMarkdown(props.initialContent)),
    });
  }, []);

  React.useEffect(() => setFocusAfterMount(), [isMounted, props.draftId]);

  const setFocusAfterMount = () => {
    props.setUpdatedEditorExtendedData({ editorEnabled: true });
  };

  const debouncedSearch = useCallback(
    debounce(searchStr => {
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();

      props.searchObjects(searchStr, abortController.current);
    }, 300),
    [props.searchObjects],
  );

  const handleContentChangeSlate = editor => {
    const searchInfo = checkCursorInSearchSlate(editor, props.isShowEditorSearch);

    if (props.isShowEditorSearch && !searchInfo.searchString) props.setShowEditorSearch(false);

    if (searchInfo.isNeedOpenSearch && !props.isShowEditorSearch) {
      if (typeof window !== 'undefined') {
        const nativeSelection = getSelection(window);
        const selectionBoundary = getSelectionRect(nativeSelection);

        props.setCursorCoordinates({
          selectionBoundary,
          selectionState: editor.selection,
          searchString: searchInfo.searchString,
        });

        props.setShowEditorSearch(true);
      }
    }

    if (props.isShowEditorSearch && searchInfo.searchString !== prevSearchValue) {
      setPrevSearch(searchInfo.searchString);
      if (prevSearchValue !== searchInfo.searchString) {
        debouncedSearch(searchInfo.searchString);
      }
    }

    props.onChange(editor, props.editorExtended.titleValue);
  };

  const onTitleChange = event => {
    const updatedTitleValue = event.target.value;

    props.setUpdatedEditorExtendedData({ titleValue: updatedTitleValue });
    if (typeof window !== 'undefined') props.onChange(window.slateEditor, updatedTitleValue);
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
          onChange={onTitleChange}
          placeholder={props.intl.formatMessage({ id: 'title', defaultMessage: 'Title' })}
        />
      )}
      <div className="waiv-editor">
        {isMounted && (
          <MediumDraftEditor
            initialPosTopBtn="11.5px"
            isNewReview={props.isNewReview}
            intl={props.intl}
            isVimeo={isVimeo}
            isMainEditor
            editorState={editorState}
            sideButtons={SIDE_BUTTONS}
            onChange={handleContentChangeSlate}
            handleHashtag={props.handleHashtag}
            isShowEditorSearch={props.isShowEditorSearch}
            handleObjectSelect={props.handleObjectSelect}
            editorEnabled={editorEnabled && props.enabled}
            setShowEditorSearch={props.setShowEditorSearch}
            setSearchCoordinates={props.setCursorCoordinates}
            initialBody={get(props, 'initialContent.body', '')}
            placeholder={props.intl.formatMessage({
              id: 'story_placeholder',
              defaultMessage: 'Write your story...',
            })}
            handlePasteText={props.handlePasteText}
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
  }),
  intl: PropTypes.shape(),
  onChange: PropTypes.func,
  draftId: PropTypes.string,
  displayTitle: PropTypes.bool,
  isNewReview: PropTypes.bool,
  handleHashtag: PropTypes.func,
  handlePasteText: PropTypes.func,
  enabled: PropTypes.bool.isRequired,
  searchObjects: PropTypes.func.isRequired,
  editorExtended: PropTypes.shape().isRequired,
  handleObjectSelect: PropTypes.func.isRequired,
  isShowEditorSearch: PropTypes.bool.isRequired,
  setShowEditorSearch: PropTypes.func.isRequired,
  setCursorCoordinates: PropTypes.func.isRequired,
  setUpdatedEditorExtendedData: PropTypes.func.isRequired,
};

const defaultProps = {
  intl: {},
  isWaivio: false,
  isNewReview: false,
  onChange: () => {},
  handleHashtag: () => {},
  handlePasteText: () => {},
  displayTitle: true,
  draftId: '',
  linkedObjects: [],
  searchObjectsResults: [],
  isStartSearchObject: false,
  initialContent: {
    body: '',
    title: '',
  },
};

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default injectIntl(Editor);
