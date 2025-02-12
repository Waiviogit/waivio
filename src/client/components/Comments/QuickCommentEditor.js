import React from 'react';
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

import './QuickCommentEditor.less';
import { getImportObject } from '../../../store/slateEditorStore/editorSelectors';

@connect(
  state => ({
    isAuth: getIsAuthenticated(state),
    signature: getAuthUserSignature(state),
    importObj: getImportObject(state),
  }),
  { setImportObject },
)
class QuickCommentEditor extends React.Component {
  static propTypes = {
    parentPost: PropTypes.shape().isRequired,
    importObj: PropTypes.shape(),
    signature: PropTypes.string,
    isLoading: PropTypes.bool,
    isEdit: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    isAuth: PropTypes.bool,
  };

  static defaultProps = {
    inputValue: '',
    isLoading: false,
    onSubmit: () => {},
    isAuth: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      isDisabledSubmit: false,
      currentImage: [],
      imageUploading: false,
      commentMsg: props.inputValue || '',
      isModal: false,
      isLoadingImage: false,
      isShowEditorSearch: false,
    };

    this.abortController = new AbortController();
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.importObj &&
      !isEmpty(this.props.importObj) &&
      this.props.importObj !== prevProps.importObj
    ) {
      const values = Object.entries(this.props.importObj);
      const [key, obj] = values[0];

      if (key === this.props.parentPost.id) {
        this.handleObjectSelect(obj);
      }
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  setEditor = editor => {
    this.editor = editor;
  };

  setShowEditorSearch = isShowEditorSearch => {
    this.setState({ isShowEditorSearch });
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    const { signature } = this.props;

    if (e.shiftKey) {
      this.setState(prevState => ({ commentMsg: `${prevState.commentMsg}\n` }));
    } else {
      const { commentMsg } = this.state;

      this.setState({ isDisabledSubmit: true });

      if (commentMsg) {
        const bodyWithSignature = this.props.isEdit ? commentMsg : `${commentMsg}${signature}`;

        this.props.onSubmit(this.props.parentPost, bodyWithSignature).then(() => {
          this.setState({ commentMsg: '', currentImage: [] });
          resetEditorState(this.editor);
          this.props.setImportObject({});
        });
      }
    }
  };

  debouncedSearch = debounce(searchStr => {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    this.props.searchObjects(searchStr, this.abortController);
  }, 150);

  handleContentChangeSlate = debounce(editor => {
    const searchInfo = checkCursorInSearchSlate(editor);

    if (searchInfo.isNeedOpenSearch) {
      if (typeof window !== 'undefined' && !this.state.isShowEditorSearch) {
        const nativeSelection = getSelection(window);
        const selectionBoundary = getSelectionRect(nativeSelection);

        this.props.setCursorCoordinates({
          selectionBoundary,
          selectionState: editor.selection,
          searchString: searchInfo.searchString,
        });
        this.setShowEditorSearch(true);
      }
      this.debouncedSearch(searchInfo.searchString);
    } else if (this.state.isShowEditorSearch) {
      this.setShowEditorSearch(false);
    }
  }, 350);

  handleMsgChange = body => {
    const commentMsg = body.children ? editorStateToMarkdownSlate(body.children) : body;

    this.setState({ commentMsg });
    this.handleContentChangeSlate(body);
  };

  handleObjectSelect = selectedObject => {
    const { beforeRange } = checkCursorInSearchSlate(this.editor);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectUrl(selectedObject.id || selectedObject.author_permlink);

    isEmpty(this.props.importObj)
      ? Transforms.select(this.editor, beforeRange)
      : Transforms.select(this.editor, Editor.end(this.editor, []));
    insertObject(this.editor, url, textReplace, true);
    this.handleMsgChange(this.editor);
    this.props.setImportObject({});
  };

  render() {
    const { isLoading, isAuth, intl, inputValue } = this.props;

    return (
      <div className="QuickComment">
        {isAuth && (
          <>
            <EditorSlate
              small
              isComment
              isQuickComment
              editorEnabled
              onChange={this.handleMsgChange}
              minHeight="auto"
              initialPosTopBtn="-14px"
              placeholder={intl.formatMessage({
                id: 'write_comment',
                defaultMessage: 'Write your comment...',
              })}
              parentPost={this.props.parentPost}
              handleObjectSelect={this.handleObjectSelect}
              setEditorCb={this.setEditor}
              ADD_BTN_DIF={24}
              initialBody={inputValue}
              isShowEditorSearch={this.state.isShowEditorSearch}
              setShowEditorSearch={this.setShowEditorSearch}
            />
            {isLoading ? (
              <Icon
                type="loading"
                className="QuickComment__send-comment QuickComment__send-comment--loader"
              />
            ) : (
              <span
                role="presentation"
                onClick={this.handleSubmit}
                className="QuickComment__send-comment"
              >
                <img src={'/images/icons/send.svg'} alt="send" />
              </span>
            )}
          </>
        )}
      </div>
    );
  }
}

QuickCommentEditor.propTypes = {
  setCursorCoordinates: PropTypes.func,
  setImportObject: PropTypes.func,
  searchObjects: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = dispatch => ({
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  searchObjects: (value, ac) =>
    dispatch(searchObjectsAutoCompete(value, '', null, true, undefined, undefined, ac)),
});

export default injectIntl(connect(null, mapDispatchToProps)(QuickCommentEditor));
