import React, { useCallback } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Input, message } from 'antd';
import { injectIntl } from 'react-intl';
import { convertToRaw, EditorState } from 'draft-js';
import {
  fromMarkdown,
  Editor as MediumDraftEditor,
} from '../index';
import { defaultDecorators, SIDE_BUTTONS } from "../../../helpers/editorHelper";

const MAX_LENGTH = 255

const Editor = (props) => {
  const {
    editorExtended: { editorState, isMounted, editorEnabled, titleValue }
  } = props;
  const refsEditor = React.useRef();

  React.useEffect(() => {
    props.setUpdatedEditorExtendedData({
      isMounted: true,
      editorState: EditorState.createEmpty(defaultDecorators),
      titleValue: get(props, 'initialContent.title', '')
    });
    restoreObjects(fromMarkdown(props.initialContent)).then(() => setFocusAfterMount());
  }, []);

  const onChange = updatedEditorState => {
    const { editorState: prevEditorState } = props.editorExtended;

    props.setUpdatedEditorExtendedData({ editorState: updatedEditorState, prevEditorState });
  };

  const setFocusAfterMount = useCallback(() => {
    refsEditor.current && refsEditor.current.focus();
    props.setUpdatedEditorExtendedData({ editorEnabled: true });
  }, []);

  const restoreObjects = useCallback((rawContent, newObject) =>
    props.getRestoreObjects(rawContent, newObject, props.draftId),
    [props.draftId]
  );

  const handleContentChange = updatedEditorState => {
    onChange(updatedEditorState);
    props.onChange(convertToRaw(updatedEditorState.getCurrentContent()), props.editorExtended.titleValue);
  };

  const validateLength = useCallback(event => {
    const updatedTitleValue = event.target.value;

    props.setUpdatedEditorExtendedData({ titleValue: updatedTitleValue });
    if (updatedTitleValue && updatedTitleValue.length === MAX_LENGTH) {
      message.error(
        props.intl.formatMessage({
          id: 'title_error_too_long',
          defaultMessage: "Title can't be longer than 255 characters.",
        }),
      );
    }
  }, []);

    const isVimeo = get(props, 'initialContent.body', '').includes('player.vimeo.com');

    return (
      <div className="waiv-editor-wrap">
        {props.displayTitle && (
          <Input.TextArea
            autoSize
            value={titleValue}
            maxLength={MAX_LENGTH}
            className="md-RichEditor-title"
            onChange={event => validateLength(event)}
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
              editorEnabled={editorEnabled && props.enabled}
              placeholder={props.intl.formatMessage({
                id: 'story_placeholder',
                defaultMessage: 'Write your story...',
              })}
            />
          )}
        </div>
      </div>
    );
  }

const propTypes = {
  enabled: PropTypes.bool.isRequired,
  initialContent: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func,
  intl: PropTypes.shape(),
  draftId: PropTypes.string,
  editorExtended: PropTypes.shape().isRequired,
  handleHashtag: PropTypes.func,
  displayTitle: PropTypes.bool,
  getRestoreObjects: PropTypes.func,
  setUpdatedEditorExtendedData: PropTypes.func.isRequired,
};

const defaultProps = {
  intl: {},
  onChange: () => {},
  handleHashtag: () => {},
  displayTitle: true,
  draftId: '',
  linkedObjects: [],
  getRestoreObjects: () => {},
};

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default injectIntl(Editor);
