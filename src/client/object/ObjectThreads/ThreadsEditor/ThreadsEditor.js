import React, { useCallback, useEffect, useState } from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { Transforms } from 'slate';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { setCursorCoordinates } from '../../../../store/editorStore/editorActions';
import { searchObjectsAutoCompete } from '../../../../store/searchStore/searchActions';
import { getSelectionRect } from '../../../components/EditorExtended/util';
import { checkCursorInSearchSlate } from '../../../../common/helpers/editorHelper';
import { resetEditorState } from '../../../components/EditorExtended/util/SlateEditor/utils/SlateUtilityFunctions';
import { editorStateToMarkdownSlate } from '../../../components/EditorExtended/util/editorStateToMarkdown';
import { getObjectName, getObjectType } from '../../../../common/helpers/wObjectHelper';
import objectTypes from '../../const/objectTypes';
import { getObjectUrl } from '../../../../common/helpers/postHelpers';
import { insertObject } from '../../../components/EditorExtended/util/SlateEditor/utils/common';
import EditorSlate from '../../../components/EditorExtended/editorSlate';
import { getIsAuthenticated } from '../../../../store/authStore/authSelectors';

import './ThreadsEditor.less';

const ThreadsEditor = ({
  parentPost,
  signature,
  isLoading,
  isEdit,
  inputValue,
  onSubmit,
  isAuth,
  intl,
  setCursorCoordin,
  searchObjects,
}) => {
  const [editor, setEditor] = useState(null);
  const [isShowEditorSearch, setShowEditorSearch] = useState(false);
  const [commentMsg, setCommentMsg] = useState(inputValue || '');

  const handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    if (e.shiftKey) {
      setCommentMsg(prevCommentMsg => `${prevCommentMsg}\n`);
    } else if (commentMsg) {
      const bodyWithSignature = isEdit ? commentMsg : `${commentMsg}${signature}`;

      onSubmit(parentPost, bodyWithSignature).then(() => {
        setCommentMsg('');

        resetEditorState(editor);
      });
    }
  };

  const debouncedSearch = debounce(searchStr => searchObjects(searchStr), 150);

  const handleContentChangeSlate = useCallback(
    debounce(ed => {
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
    }, 350),
    [isShowEditorSearch],
  );

  const handleMsgChange = body => {
    const updatedCommentMsg = body.children ? editorStateToMarkdownSlate(body.children) : body;

    setCommentMsg(updatedCommentMsg);
    handleContentChangeSlate(body);
  };

  const handleObjectSelect = selectedObject => {
    const { beforeRange } = checkCursorInSearchSlate(editor);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectUrl(selectedObject.id || selectedObject.author_permlink);

    Transforms.select(editor, beforeRange);
    insertObject(editor, url, textReplace, true);
    handleMsgChange(editor);
  };

  useEffect(() => {
    setShowEditorSearch(isAuth);
  }, [isAuth]);

  return (
    <div className="ThreadsEditor">
      <div className="QuickComment">
        {isAuth && (
          <>
            <EditorSlate
              small
              isComment
              isQuickComment
              editorEnabled
              onChange={handleMsgChange}
              minHeight="auto"
              initialPosTopBtn="-14px"
              placeholder={intl.formatMessage({
                id: 'write_thread',
                defaultMessage: 'Write your thread...',
              })}
              handleObjectSelect={handleObjectSelect}
              setEditorCb={setEditor}
              ADD_BTN_DIF={24}
              initialBody={inputValue}
              isShowEditorSearch={isShowEditorSearch}
              setShowEditorSearch={setShowEditorSearch}
            />
            {isLoading ? (
              <Icon
                type="loading"
                className="QuickComment__send-comment QuickComment__send-comment--loader"
              />
            ) : (
              <span
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
  );
};

ThreadsEditor.propTypes = {
  parentPost: PropTypes.shape().isRequired,
  signature: PropTypes.string,
  isLoading: PropTypes.bool,
  isEdit: PropTypes.bool,
  inputValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  isAuth: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  setCursorCoordin: PropTypes.func,
  searchObjects: PropTypes.func,
};

ThreadsEditor.defaultProps = {
  inputValue: '',
  isLoading: false,
  onSubmit: () => {},
};

const mapStateToProps = state => ({
  isAuth: getIsAuthenticated(state),
});

const mapDispatchToProps = dispatch => ({
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  searchObjects: value => dispatch(searchObjectsAutoCompete(value, '', null, true)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ThreadsEditor));
