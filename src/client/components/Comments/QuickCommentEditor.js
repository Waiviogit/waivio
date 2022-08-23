import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { get } from 'lodash';
import { Transforms } from 'slate';
import withEditor from '../Editor/withEditor';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

import './QuickCommentEditor.less';
import EditorSlate from '../EditorExtended/editorSlate';
import { editorStateToMarkdownSlate } from '../EditorExtended/util/editorStateToMarkdown';
import { checkCursorInSearchSlate } from '../../../common/helpers/editorHelper';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import objectTypes from '../../object/const/objectTypes';
import { getObjectUrl } from '../../../common/helpers/postHelpers';
import { insertObject } from '../EditorExtended/util/SlateEditor/utils/common';
import { getEditorSlate } from '../../../store/slateEditorStore/editorSelectors';
import { resetEditorState } from '../EditorExtended/util/SlateEditor/utils/SlateUtilityFunctions';

@withEditor
@connect(state => ({
  isAuth: getIsAuthenticated(state),
}))
class QuickCommentEditor extends React.Component {
  static propTypes = {
    parentPost: PropTypes.shape().isRequired,
    isLoading: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    isAuth: PropTypes.bool,
  };

  static defaultProps = {
    inputValue: '',
    isLoading: false,
    onImageUpload: () => {},
    onImageInvalid: () => {},
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
    };
  }

  setEditor = editor => {
    this.editor = editor;
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      this.setState(prevState => ({ commentMsg: `${prevState.commentMsg}\n` }));
    } else {
      const { commentMsg } = this.state;

      this.setState({ isDisabledSubmit: true });

      if (commentMsg) {
        this.props.onSubmit(this.props.parentPost, commentMsg.trim()).then(response => {
          if (!get(response, 'error', false)) {
            this.setState({ commentMsg: '', currentImage: [] });

            resetEditorState(this.editor);
          }
        });
      }
    }
  };

  handleMsgChange = body => {
    const commentMsg = body.children ? editorStateToMarkdownSlate(body.children) : body;

    this.setState({ commentMsg });
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
  };

  render() {
    const { isLoading, isAuth } = this.props;

    return (
      <React.Fragment>
        {isAuth && (
          <>
            <EditorSlate
              small
              isComment
              editorEnabled
              onChange={this.handleMsgChange}
              minHeight="auto"
              initialPosTopBtn="-10.5px"
              placeholder="Write your comment..."
              handleObjectSelect={this.handleObjectSelect}
              setEditorCb={this.setEditor}
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  editor: getEditorSlate(store),
});

export default connect(mapStateToProps)(QuickCommentEditor);
