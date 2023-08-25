import React from 'react';
import PropTypes from 'prop-types';
import _, { debounce } from 'lodash';
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
import {
  setCursorCoordinates,
  setUpdatedEditorData,
} from '../../../store/slateEditorStore/editorActions';
import { checkCursorInSearchSlate } from '../../../common/helpers/editorHelper';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import objectTypes from '../../object/const/objectTypes';
import { getObjectUrl } from '../../../common/helpers/postHelpers';
import { insertObject } from '../EditorExtended/util/SlateEditor/utils/common';
import { getSelection, getSelectionRect } from '../EditorExtended/util';
import { searchObjectsAutoCompete } from '../../../store/searchStore/searchActions';

import './CommentForm.less';

const Element = Scroll.Element;

@withEditor
class CommentForm extends React.Component {
  static propTypes = {
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

  static defaultProps = {
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

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      bodyHTML: '',
      isShowEditorSearch: false,
      loading: false,
    };

    this.setInput = this.setInput.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.handleBodyUpdate = this.handleBodyUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ((!nextProps.isLoading && nextProps.inputValue !== '') || nextProps.submitted) {
      this.setBodyAndRender(nextProps.inputValue);
    }
  }

  setEditor = editor => {
    this.setState({ editor });
  };

  setInput(input) {
    this.input = input;
  }

  setBodyAndRender(body) {
    const markdownBody = body.children ? editorStateToMarkdownSlate(body.children) : body;

    this.setState(
      {
        body: markdownBody,
        bodyHTML: remarkable.render(markdownBody),
      },
      () => {
        if (this.input) {
          this.input.value = null;
        }
      },
    );
  }

  setShowEditorSearch = isShowEditorSearch => {
    this.setState({ isShowEditorSearch });
  };

  debouncedSearch = debounce(searchStr => this.props.searchObjects(searchStr), 150);

  handleContentChangeSlate = debounce(editor => {
    const searchInfo = checkCursorInSearchSlate(editor);

    if (searchInfo.isNeedOpenSearch) {
      if (!this.state.isShowEditorSearch) {
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

  handleBodyUpdate(body) {
    this.setBodyAndRender(body);
    this.handleContentChangeSlate(body);
  }

  handleSubmit(e) {
    e.stopPropagation();
    this.setState({ loading: true });
    if (this.state.body) {
      const formattedBody = this.state.body.replace(/\\(#.)+/g, '$1');

      this.props.onSubmit(this.props.parentPost, formattedBody).then(response => {
        if (!_.get(response, 'error', false)) {
          this.setBodyAndRender('');
          const { editor } = this.props;

          resetEditorState(editor);
        }
        this.setState({ loading: false });
      });
    }
  }

  handleObjectSelect = selectedObject => {
    const { editor } = this.props;
    const { beforeRange } = checkCursorInSearchSlate(editor);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectUrl(selectedObject.id || selectedObject.author_permlink);

    Transforms.select(editor, beforeRange);
    insertObject(editor, url, textReplace, true);
  };

  render() {
    const { username, isSmall, isEdit } = this.props;
    const { bodyHTML, loading } = this.state;
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
        {!this.props.isEdit && <Avatar username={username} size={!isSmall ? 40 : 32} />}
        <div className="CommentForm__text">
          <Element name="commentFormInputScrollerElement">
            <div className="CommentForm__editor">
              <EditorSlate
                onChange={this.handleBodyUpdate}
                handleObjectSelect={this.handleObjectSelect}
                isComment
                editorEnabled
                initialPosTopBtn="11.5px"
                isShowEditorSearch={this.state.isShowEditorSearch}
                setShowEditorSearch={this.setShowEditorSearch}
                initialBody={this.props.inputValue}
                small={this.props.isEdit}
              />
            </div>
          </Element>
          <Button onClick={this.handleSubmit} disabled={loading} loading={loading} type={'primary'}>
            {getButtonText()}
          </Button>
          {isEdit && (
            <Button type="link" onClick={this.props.onClose}>
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
  }
}

const mapStateToProps = store => ({
  editor: getEditorSlate(store),
});

const mapDispatchToProps = dispatch => ({
  setUpdatedEditorData: data => dispatch(setUpdatedEditorData(data)),
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  searchObjects: value => dispatch(searchObjectsAutoCompete(value, '', null, true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);
