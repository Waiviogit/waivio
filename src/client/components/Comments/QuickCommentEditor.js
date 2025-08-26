import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { debounce, isEmpty } from 'lodash';
import { Editor, Transforms } from 'slate';
import { injectIntl } from 'react-intl';

import { getAuthUserSignature, getIsAuthenticated } from '../../../store/authStore/authSelectors';
import EditorSlate from '../EditorExtended/editorSlate';
import { editorStateToMarkdownSlate } from '../EditorExtended/util/editorStateToMarkdown';
import { checkCursorInSearchSlate } from '../../../common/helpers/editorHelper';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import objectTypes from '../../object/const/objectTypes';
import { getObjectUrl } from '../../../common/helpers/postHelpers';
import { resetEditorState } from '../EditorExtended/util/SlateEditor/utils/SlateUtilityFunctions';
import { getSelection, getSelectionRect } from '../EditorExtended/util';
import {
  setCursorCoordinates,
  setImportObject,
} from '../../../store/slateEditorStore/editorActions';
import { searchObjectsAutoCompete } from '../../../store/searchStore/searchActions';
import { insertObject } from '../EditorExtended/util/SlateEditor/utils/common';
import { getImportObject } from '../../../store/slateEditorStore/editorSelectors';

import './QuickCommentEditor.less';

const QuickCommentEditor = props => {
  const [commentMsg, setCommentMsg] = useState(props.inputValue || '');
  const [isShowEditorSearch, setIsShowEditorSearch] = useState(false);
  const [startToSearching, setStartToSearching] = React.useState(false);
  const [resultLoading, setResultLoading] = React.useState(false);
  const editorRef = useRef(null);
  const abortController = useRef(new AbortController());

  useEffect(() => {
    if (props.importObj && !isEmpty(props.importObj)) {
      const values = Object.entries(props.importObj);
      const [key, obj] = values[0];

      if (key === props.parentPost.id) {
        handleObjectSelect(obj);
      }
    }
  }, [props.importObj]);

  useEffect(
    () => () => {
      abortController.current.abort();
    },
    [],
  );

  const setEditor = editor => {
    editorRef.current = editor;
  };

  const handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    const { signature } = props;

    if (e.shiftKey) {
      setCommentMsg(prevCommentMsg => `${prevCommentMsg}\n`);
    } else if (commentMsg) {
      const bodyWithSignature = props.isEdit ? commentMsg : `${commentMsg}${signature}`;

      props.onSubmit(props.parentPost, bodyWithSignature).then(() => {
        setCommentMsg('');
        resetEditorState(editorRef.current);
        props.setImportObject({});
      });
    }
  };

  const openSearchAfterClick = useCallback(() => {
    const searchInfo = checkCursorInSearchSlate(editorRef.current, true);
    const nativeSelection = getSelection(window);
    const selectionBoundary = getSelectionRect(nativeSelection);

    props.setCursorCoordinates({
      selectionBoundary,
      selectionState: editorRef.current.selection,
      searchString: searchInfo.searchString,
    });

    setIsShowEditorSearch(true);
  }, [editorRef.current, isShowEditorSearch, props.setCursorCoordinates]);

  const debouncedSearch = useCallback(
    debounce(searchStr => {
      if (abortController.current) {
        abortController.current.abort();
      }

      if (searchStr) {
        setStartToSearching(true);
        setResultLoading(true);
        abortController.current = new AbortController();

        props.searchObjects(searchStr, abortController.current).then(res => {
          if (res.value.result.wobjects) setResultLoading(false);
          if (res.value.result.message) {
            setStartToSearching(false);
            setResultLoading(false);
            setIsShowEditorSearch(false);
          }
        });
      }
    }, 300),
    [props.searchObjects],
  );

  const handleContentChangeSlate = editor => {
    const searchInfo = checkCursorInSearchSlate(editor, isShowEditorSearch);

    if (isShowEditorSearch && !searchInfo.searchString) {
      setIsShowEditorSearch(false);
      setStartToSearching(false);
    }

    if (searchInfo.isNeedOpenSearch) {
      if (typeof window !== 'undefined' && !isShowEditorSearch) {
        const nativeSelection = getSelection(window);
        const selectionBoundary = getSelectionRect(nativeSelection);

        props.setCursorCoordinates({
          selectionBoundary,
          selectionState: editor.selection,
          searchString: searchInfo.searchString,
        });

        setStartToSearching(true);
        setIsShowEditorSearch(true);
      }
    }

    if (isShowEditorSearch) {
      debouncedSearch(searchInfo.searchString);
    }
  };

  const handleMsgChange = body => {
    const newCommentMsg = body.children ? editorStateToMarkdownSlate(body.children) : body;

    setCommentMsg(newCommentMsg);
    handleContentChangeSlate(body);
  };

  const handleObjectSelect = selectedObject => {
    const { beforeRange } = checkCursorInSearchSlate(editorRef.current, false, true);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectUrl(selectedObject.id || selectedObject.author_permlink);

    isEmpty(props.importObj)
      ? Transforms.select(editorRef.current, beforeRange)
      : Transforms.select(editorRef.current, Editor.end(editorRef.current, []));
    insertObject(editorRef.current, url, textReplace, true);
    handleMsgChange(editorRef.current);
    props.setImportObject({});
  };

  const setShowEditorQuickSearch = value => {
    setIsShowEditorSearch(value);
  };

  const { isLoading, isAuth, intl, inputValue } = props;

  return (
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
              id: 'write_comment',
              defaultMessage: 'Write your comment...',
            })}
            parentPost={props.parentPost}
            handleObjectSelect={handleObjectSelect}
            setEditorCb={setEditor}
            ADD_BTN_DIF={24}
            initialBody={inputValue}
            isShowEditorSearch={isShowEditorSearch}
            setShowEditorQuickSearch={setShowEditorQuickSearch}
            openSearchAfterClick={openSearchAfterClick}
            startToSearching={startToSearching}
            isLoading={resultLoading}
          />
          {isLoading ? (
            <Icon
              type="loading"
              className="QuickComment__send-comment QuickComment__send-comment--loader"
            />
          ) : (
            <span role="presentation" onClick={handleSubmit} className="QuickComment__send-comment">
              <img src={'/images/icons/send.svg'} alt="send" />
            </span>
          )}
        </>
      )}
    </div>
  );
};

QuickCommentEditor.propTypes = {
  parentPost: PropTypes.shape(),
  importObj: PropTypes.shape(),
  signature: PropTypes.string,
  isLoading: PropTypes.bool,
  isEdit: PropTypes.bool,
  inputValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  isAuth: PropTypes.bool,
  setCursorCoordinates: PropTypes.func,
  setImportObject: PropTypes.func,
  searchObjects: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

QuickCommentEditor.defaultProps = {
  inputValue: '',
  isLoading: false,
  onSubmit: () => {},
  isAuth: false,
};

const mapDispatchToProps = dispatch => ({
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  setImportObject: data => dispatch(setImportObject(data)),
  searchObjects: (value, ac) =>
    dispatch(searchObjectsAutoCompete(value, '', null, true, undefined, undefined, ac)),
});

export default injectIntl(
  connect(
    state => ({
      isAuth: getIsAuthenticated(state),
      signature: getAuthUserSignature(state),
      importObj: getImportObject(state),
    }),
    mapDispatchToProps,
  )(QuickCommentEditor),
);
