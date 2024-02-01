import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { debounce } from 'lodash';
import { Transforms } from 'slate';
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
import { setCursorCoordinates } from '../../../store/slateEditorStore/editorActions';
import { searchObjectsAutoCompete } from '../../../store/searchStore/searchActions';
import { insertObject } from '../EditorExtended/util/SlateEditor/utils/common';

import './QuickCommentEditor.less';

@connect(state => ({
  isAuth: getIsAuthenticated(state),
  signature: getAuthUserSignature(state),
}))
class QuickCommentEditor extends React.Component {
  static propTypes = {
    parentPost: PropTypes.shape().isRequired,
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
        });
      }
    }
  };

  debouncedSearch = debounce(searchStr => this.props.searchObjects(searchStr), 150);

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

  handleRemoveImage = () => {
    this.setState({ currentImage: [], imageUploading: false });
  };

  handleCloseModal = () => this.setState({ isModal: false, currentImage: [] });

  handleToggleModal = () => this.setState({ isModal: !this.state.isModal });

  onLoadingImage = value => this.setState({ isLoading: value });

  getImages = image => {
    this.setState({ currentImage: image });
  };

  handleObjectSelect = selectedObject => {
    const { beforeRange } = checkCursorInSearchSlate(this.editor);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectUrl(selectedObject.id || selectedObject.author_permlink);

    Transforms.select(this.editor, beforeRange);
    insertObject(this.editor, url, textReplace, true);
    this.handleMsgChange(this.editor);
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
  searchObjects: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = dispatch => ({
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  searchObjects: value => dispatch(searchObjectsAutoCompete(value, '', null, true)),
});

export default injectIntl(connect(null, mapDispatchToProps)(QuickCommentEditor));
