import React, { useCallback, useEffect, useState, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { debounce, get, isEmpty, trimEnd } from 'lodash';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Editor, Transforms } from 'slate';
import { Button, Modal } from 'antd';
import { connect, useSelector } from 'react-redux';
import Scroll from 'react-scroll';
import {
  getAuthenticatedUserName,
  getAuthUserSignature,
} from '../../../store/authStore/authSelectors';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import Avatar from '../Avatar';
import EditorSlate from '../EditorExtended/editorSlate';
import { editorStateToMarkdownSlate } from '../EditorExtended/util/editorStateToMarkdown';
import { resetEditorState } from '../EditorExtended/util/SlateEditor/utils/SlateUtilityFunctions';
import { getEditorSlate, getImportObject } from '../../../store/slateEditorStore/editorSelectors';
import {
  setCursorCoordinates,
  setImportObject,
} from '../../../store/slateEditorStore/editorActions';
import { checkCursorInSearchSlate } from '../../../common/helpers/editorHelper';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import objectTypes from '../../object/const/objectTypes';
import { getObjectUrl } from '../../../common/helpers/postHelpers';
import { insertObject } from '../EditorExtended/util/SlateEditor/utils/common';
import { getSelection, getSelectionRect } from '../EditorExtended/util';
import { searchObjectsAutoCompete } from '../../../store/searchStore/searchActions';
import { getCommentDraft, saveCommentDraft } from '../../../waivioApi/ApiClient';

import './CommentForm.less';

const Element = Scroll.Element;

const CommentForm = props => {
  const [body, setBody] = useState('');
  const [bodyHTML, setHTML] = useState('');
  const [isShowEditorSearch, setIsShowEditorSearch] = useState(false);
  const [prevSearch, setPrevSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  const [draft, setDraft] = useState('');
  const importObj = useSelector(getImportObject);
  const abortControllerRef = useRef(null);

  const parent = props.isEdit ? props.currentComment : props.parentPost;
  const getPermlink = () => {
    if (props.isReply) return `${parent?.permlink}-reply`;

    return props.isEdit ? `${parent?.permlink}-edit` : parent?.permlink;
  };

  useLayoutEffect(() => {
    getCommentDraft(props.username, parent?.author, getPermlink()).then(res => {
      if (res.message) {
        setInit(true);

        return res;
      }

      if (props.isEdit) {
        if (res.body) {
          Modal.confirm({
            title: props.intl.formatMessage({
              id: 'comment_draft',
              defaultMessage: 'Comment draft',
            }),
            content: (
              <div style={{ whiteSpace: 'pre-line' }}>
                {props.intl.formatMessage({
                  id: 'comment_draft_message',
                  defaultMessage:
                    'You have one draft with unsaved changes.\n Do you want to continue editing?',
                })}
              </div>
            ),
            onOk: () => {
              setInit(true);
              setDraft(res?.body);
            },
            onCancel: () => setInit(true),
            okText: props.intl.formatMessage({ defaultMessage: 'Continue', id: 'continue' }),
            cancelText: props.intl.formatMessage({ defaultMessage: 'Discard', id: 'discard' }),
          });
        } else {
          setInit(true);
        }
      } else {
        setInit(true);
        setDraft(res?.body);
      }

      return res;
    });
  }, []);

  useEffect(() => {
    if ((!props.isLoading && props.inputValue !== '') || props.submitted) {
      setBodyAndRender(props.inputValue);
    }
  }, [props.isLoading, props.inputValue, props.submitted]);

  useEffect(() => {
    if (!isEmpty(importObj)) {
      const values = Object.entries(importObj);
      const [key, obj] = values[0];

      if (key === props.parentPost.id) {
        handleObjectSelect(obj);
      }
    }
  }, [importObj]);

  const setBodyAndRender = value => {
    const markdownBody = value.children ? editorStateToMarkdownSlate(value.children) : value;
    const bodyWithSignature = props.isEdit ? markdownBody : `${markdownBody}${props.signature}`;

    if (
      (props.isEdit &&
        Boolean(props.inputValue) &&
        trimEnd(props.inputValue) !== trimEnd(bodyWithSignature)) ||
      !props.isEdit
    )
      debouncedDraftSave(markdownBody);

    setBody(bodyWithSignature);
    setHTML(remarkable.render(bodyWithSignature));
  };

  const setShowEditorSearch = value => setIsShowEditorSearch(value);

  const debouncedSearch = useCallback(
    debounce(searchStr => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      props.searchObjects(searchStr, abortControllerRef.current);
    }, 300),
    [],
  );

  const debouncedDraftSave = useCallback(
    debounce(markdownBody => {
      if (init) saveCommentDraft(props.username, parent?.author, getPermlink(), markdownBody);
    }, 300),
    [props.username, props.parentPost, init],
  );

  const handleContentChangeSlate = debounce(editor => {
    const searchInfo = checkCursorInSearchSlate(editor, isShowEditorSearch);

    if (isShowEditorSearch && !searchInfo.searchString) setShowEditorSearch(false);

    if (searchInfo.isNeedOpenSearch && !isShowEditorSearch) {
      if (typeof window !== 'undefined') {
        const nativeSelection = getSelection(window);
        const selectionBoundary = getSelectionRect(nativeSelection);

        props.setCursorCoordinates({
          selectionBoundary,
          selectionState: editor.selection,
          searchString: searchInfo.searchString,
        });
        setShowEditorSearch(true);
      }
    }

    if (isShowEditorSearch) {
      setPrevSearch(searchInfo.searchString);

      if (prevSearch !== searchInfo.searchString) {
        debouncedSearch(searchInfo.searchString);
      }
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
          const { editor } = props;

          debouncedDraftSave('');
          setBody('');
          setHTML('');
          resetEditorState(editor);
          props.setImportObject({});
        }
        setLoading(false);
      });
    }
  };

  const handleObjectSelect = selectedObject => {
    const { editor } = props;
    const { beforeRange } = checkCursorInSearchSlate(editor) || {};
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectUrl(selectedObject.id || selectedObject.author_permlink);

    try {
      const rangeToSelect = isEmpty(importObj) ? beforeRange : Editor.end(editor, []);

      if (rangeToSelect) {
        Transforms.select(editor, rangeToSelect);
      }

      insertObject(editor, url, textReplace, true);
      props.setImportObject({});
    } catch (error) {
      console.error('Error during object selection:', error);
    }
  };

  const { username, isSmall, isEdit, isThread } = props;
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
        <FormattedMessage
          id={isThread ? 'update' : 'comment_update_send'}
          defaultMessage={isThread ? 'Update' : 'Update comment'}
        />
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
            {init && (
              <EditorSlate
                parentPost={props.parentPost}
                onChange={handleBodyUpdate}
                handleObjectSelect={handleObjectSelect}
                isCommentEdit={props.isEdit}
                isComment
                editorEnabled
                initialPosTopBtn={props.isEdit ? '3.5px' : '11.5px'}
                isShowEditorSearch={isShowEditorSearch}
                setShowEditorSearch={setShowEditorSearch}
                initialBody={draft || props.inputValue}
                small={props.isEdit}
              />
            )}
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
  currentComment: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  // top: PropTypes.bool,
  isSmall: PropTypes.bool,
  isReply: PropTypes.bool,
  isLoading: PropTypes.bool,
  submitted: PropTypes.bool,
  inputValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  setImportObject: PropTypes.func,
  editor: PropTypes.shape(),
  parentPost: PropTypes.shape(),
  signature: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  setCursorCoordinates: PropTypes.func,
  searchObjects: PropTypes.func,
  isEdit: PropTypes.bool,
  isThread: PropTypes.bool,
  onClose: PropTypes.func,
};

CommentForm.defaultProps = {
  top: false,
  isSmall: false,
  isLoading: false,
  isReply: false,
  submitted: false,
  inputValue: '',
  onSubmit: () => {},
  editor: {},
};

const mapStateToProps = store => ({
  editor: getEditorSlate(store),
  username: getAuthenticatedUserName(store),
  signature: getAuthUserSignature(store),
});

const mapDispatchToProps = dispatch => ({
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  setImportObject: data => dispatch(setImportObject(data)),
  searchObjects: (value, ac) =>
    dispatch(searchObjectsAutoCompete(value, '', null, true, false, undefined, ac)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CommentForm)));
