import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce, get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Transforms } from 'slate';
import { Button } from 'antd';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import withEditor from '../Editor/withEditor';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import Avatar from '../Avatar';
import EditorSlate from '../EditorExtended/editorSlate';
import { editorStateToMarkdownSlate } from '../EditorExtended/util/editorStateToMarkdown';
import { resetEditorState } from '../EditorExtended/util/SlateEditor/utils/SlateUtilityFunctions';
import { getEditorSlate } from '../../../store/slateEditorStore/editorSelectors';
import { setCursorCoordinates } from '../../../store/slateEditorStore/editorActions';
import { checkCursorInSearchSlate } from '../../../common/helpers/editorHelper';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import objectTypes from '../../object/const/objectTypes';
import { getObjectUrl } from '../../../common/helpers/postHelpers';
import { insertObject } from '../EditorExtended/util/SlateEditor/utils/common';
import { getSelection, getSelectionRect } from '../EditorExtended/util';
import { searchObjectsAutoCompete } from '../../../store/searchStore/searchActions';

import './CommentForm.less';

const Element = Scroll.Element;

const CommentForm = props => {
  const [body, setBody] = useState('');
  const [bodyHTML, setHTML] = useState('');
  const [isShowEditorSearch, setIsShowEditorSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((!props.isLoading && props.inputValue !== '') || props.submitted) {
      setBodyAndRender(props.inputValue);
    }
  }, [props.isLoading, props.inputValue, props.submitted]);

  const setBodyAndRender = value => {
    const markdownBody = value.children ? editorStateToMarkdownSlate(value.children) : value;

    setBody(markdownBody);
    setHTML(remarkable.render(markdownBody));
  };

  const setShowEditorSearch = value => setIsShowEditorSearch(value);

  const debouncedSearch = debounce(searchStr => props.searchObjects(searchStr), 150);

  const handleContentChangeSlate = debounce(editor => {
    const searchInfo = checkCursorInSearchSlate(editor);

    if (searchInfo.isNeedOpenSearch) {
      if (!isShowEditorSearch) {
        const nativeSelection = getSelection(window);
        const selectionBoundary = getSelectionRect(nativeSelection);

        props.setCursorCoordinates({
          selectionBoundary,
          selectionState: editor.selection,
          searchString: searchInfo.searchString,
        });
        setShowEditorSearch(true);
      }
      debouncedSearch(searchInfo.searchString);
    } else if (isShowEditorSearch) {
      setShowEditorSearch(false);
    }
  }, 350);

  const handleBodyUpdate = value => {
    setBodyAndRender(value);
    handleContentChangeSlate(value);
  };

  const handleSubmit = e => {
    e.stopPropagation();
    setLoading(true);
    if (body) {
      const formattedBody = body.replace(/\\(#.)+/g, '$1');

      props.onSubmit(props.parentPost, formattedBody).then(response => {
        if (!get(response, 'error', false)) {
          setBodyAndRender('');
          const { editor } = props;

          resetEditorState(editor);
        }
        setLoading(false);
      });
    }
  };

  const handleObjectSelect = selectedObject => {
    const { editor } = props;
    const { beforeRange } = checkCursorInSearchSlate(editor);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectUrl(selectedObject.id || selectedObject.author_permlink);

    Transforms.select(editor, beforeRange);
    insertObject(editor, url, textReplace, true);
  };

  const { username, isSmall, isEdit } = props;
  const getButtonText = () => {
    let text = loading ? (
      <FormattedMessage id="comment_send_progress" defaultMessage="Commenting" />
    ) : (
      <FormattedMessage id="comment_send" defaultMessage="Comment" />
    );

    if (isEdit) {
      text = loading ? (
        <FormattedMessage id="comment_update_progress" defaultMessage="Updating" />
      ) : (
        <FormattedMessage id="comment_update_send" defaultMessage="Update comment" />
      );
    }

    return text;
  };

  return (
    <div className="CommentForm">
      {!props.isEdit && <Avatar username={username} size={!isSmall ? 40 : 32} />}
      <div className="CommentForm__text">
        <Element name="commentFormInputScrollerElement">
          <div className="CommentForm__editor">
            <EditorSlate
              onChange={handleBodyUpdate}
              handleObjectSelect={handleObjectSelect}
              isCommentEdit={props.isEdit}
              isComment
              editorEnabled
              initialPosTopBtn={props.isEdit ? '3.5px' : '11.5px'}
              isShowEditorSearch={isShowEditorSearch}
              setShowEditorSearch={setShowEditorSearch}
              initialBody={props.inputValue}
              small={props.isEdit}
            />
          </div>
        </Element>
        <Button onClick={handleSubmit} disabled={loading} loading={loading} type={'primary'}>
          {getButtonText()}
        </Button>
        {isEdit && (
          <Button type="link" onClick={props.onClose}>
            <FormattedMessage id="close" defaultMessage="Close" />
          </Button>
        )}
        {bodyHTML && (
          <div className="CommentForm__preview">
            <span className="Editor__label">
              <FormattedMessage id="preview" defaultMessage="Preview" />
            </span>
            <BodyContainer body={bodyHTML} />
          </div>
        )}
      </div>
    </div>
  );
};

CommentForm.propTypes = {
  parentPost: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  // top: PropTypes.bool,
  isSmall: PropTypes.bool,
  isLoading: PropTypes.bool,
  submitted: PropTypes.bool,
  inputValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  editor: PropTypes.shape(),
  setCursorCoordinates: PropTypes.func,
  searchObjects: PropTypes.func,
  isEdit: PropTypes.bool,
  onClose: PropTypes.func,
};

CommentForm.defaultProps = {
  top: false,
  isSmall: false,
  isLoading: false,
  submitted: false,
  inputValue: '',
  onImageUpload: () => {},
  onImageInvalid: () => {},
  onSubmit: () => {},
  editor: {},
};

const mapStateToProps = store => ({
  editor: getEditorSlate(store),
});

const mapDispatchToProps = dispatch => ({
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  searchObjects: value => dispatch(searchObjectsAutoCompete(value, '', null, true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withEditor(CommentForm));
