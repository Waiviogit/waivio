import React, { useEffect, useState } from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { Transforms } from 'slate';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { setCursorCoordinates } from '../../../store/editorStore/editorActions';
import { searchObjectsAutoCompete } from '../../../store/searchStore/searchActions';
import { getSelection, getSelectionRect } from '../../components/EditorExtended/util';
import { checkCursorInSearchSlate } from '../../../common/helpers/editorHelper';
import { resetEditorState } from '../../components/EditorExtended/util/SlateEditor/utils/SlateUtilityFunctions';
import { editorStateToMarkdownSlate } from '../../components/EditorExtended/util/editorStateToMarkdown';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import objectTypes from '../../object/const/objectTypes';
import { getObjectUrl } from '../../../common/helpers/postHelpers';
import { insertObject } from '../../components/EditorExtended/util/SlateEditor/utils/common';
import ThreadsEditorSlate from '../../components/EditorExtended/ThreadsEditorSlate';
import { getAuthUserSignature, getIsAuthenticated } from '../../../store/authStore/authSelectors';

import './ThreadsEditor.less';

const ThreadsEditor = ({
  parentPost,
  signature,
  isLoading,
  isEdit,
  intl,
  inputValue,
  onSubmit,
  isAuth,
  setCursorCoordin,
  searchObjects,
  callback,
  mainThreadHashtag,
  isUser,
  name,
  loading,
  setLoading,
}) => {
  const [editor, setEditor] = useState(null);
  const [isShowEditorSearch, setShowEditorSearch] = useState(false);
  const [commentMsg, setCommentMsg] = useState(inputValue || '');
  const [focused, setFocused] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentMsg.includes(`${isUser ? '@' : '#'}${name}`)) {
      setShowError(true);

      return;
    }
    setShowError(false);
    if (e.shiftKey) {
      setCommentMsg(prevCommentMsg => `${prevCommentMsg}\n`);
    } else if (commentMsg) {
      const bodyWithSignature = isEdit ? commentMsg : `${commentMsg}${signature}`;

      setCommentMsg('');
      setLoading(true);
      resetEditorState(editor);
      onSubmit(parentPost, bodyWithSignature, false, parentPost, callback).then(() => {
        setFocused(false);
      });
    }
  };

  const debouncedSearch = debounce(searchStr => searchObjects(searchStr), 150);

  const handleContentChangeSlate = ed => {
    const searchInfo = checkCursorInSearchSlate(ed);

    if (searchInfo.isNeedOpenSearch) {
      if (!isShowEditorSearch) {
        const nativeSelection = getSelection(window);
        const selectionBoundary = getSelectionRect(nativeSelection);

        setCursorCoordin({
          selectionBoundary,
          selectionState: ed.selection,
          searchString: searchInfo.searchString,
        });
        setShowEditorSearch(true);
      }
      debouncedSearch(searchInfo.searchString);
    } else if (isShowEditorSearch) {
      setShowEditorSearch(false);
    }
  };

  const handleMsgChange = body => {
    const updatedCommentMsg = body.children ? editorStateToMarkdownSlate(body.children) : body;

    setCommentMsg(updatedCommentMsg);
    handleContentChangeSlate(body);
  };

  const handleObjectSelect = selectedObject => {
    const { beforeRange } = checkCursorInSearchSlate(editor);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace =
      objectType === objectTypes.HASHTAG || mainThreadHashtag === selectedObject.author_permlink
        ? `#${selectedObject.author_permlink}`
        : objectName;
    const url = getObjectUrl(selectedObject?.id || selectedObject?.author_permlink);

    Transforms.select(editor, beforeRange);
    insertObject(editor, url, textReplace, true);
    handleMsgChange(editor);
  };

  useEffect(() => {
    setShowEditorSearch(isAuth);
  }, [isAuth]);

  return (
    <>
      <div className="ThreadsEditor">
        <div className="QuickComment">
          {isAuth && (
            <>
              <ThreadsEditorSlate
                small
                isComment
                isThread
                isQuickComment
                editorEnabled
                onChange={handleMsgChange}
                minHeight="auto"
                initialPosTopBtn="-14px"
                placeholder={`${isUser ? '@' : '#'}${name}...`}
                handleObjectSelect={handleObjectSelect}
                setEditorCb={setEditor}
                ADD_BTN_DIF={24}
                initialBody={focused ? `${inputValue} ` : ''}
                onFocus={() => setFocused(true)}
                isShowEditorSearch={isShowEditorSearch}
                setShowEditorSearch={() => setShowEditorSearch(!isShowEditorSearch)}
              />
              {isLoading || loading ? (
                <Icon
                  type="loading"
                  className="QuickComment__send-comment QuickComment__send-comment--loader"
                />
              ) : (
                <span
                  disabled={showError}
                  role="presentation"
                  onClick={handleSubmit}
                  className="QuickComment__send-comment"
                >
                  <img src={'/images/icons/send.svg'} alt="send" />
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {showError && (
        <div className={'error-text'}>
          {intl.formatMessage({ id: `the_${isUser ? 'user' : 'object'}_must_be_mentioned` })}
        </div>
      )}
    </>
  );
};

ThreadsEditor.propTypes = {
  parentPost: PropTypes.shape().isRequired,
  signature: PropTypes.string,
  mainThreadHashtag: PropTypes.string,
  name: PropTypes.string,
  isUser: PropTypes.bool,
  intl: PropTypes.shape,
  isLoading: PropTypes.bool,
  isEdit: PropTypes.bool,
  inputValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  isAuth: PropTypes.bool,
  setLoading: PropTypes.func,
  loading: PropTypes.bool,
  setCursorCoordin: PropTypes.func,
  callback: PropTypes.func,
  searchObjects: PropTypes.func,
};

ThreadsEditor.defaultProps = {
  inputValue: '',
  isLoading: false,
  onSubmit: () => {},
};

const mapStateToProps = state => ({
  isAuth: getIsAuthenticated(state),
  signature: getAuthUserSignature(state),
});

const mapDispatchToProps = dispatch => ({
  setCursorCoordin: data => dispatch(setCursorCoordinates(data)),
  searchObjects: value => dispatch(searchObjectsAutoCompete(value, '', null, true)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ThreadsEditor));
