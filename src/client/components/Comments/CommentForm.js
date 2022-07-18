import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Transforms } from 'slate';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import withEditor from '../Editor/withEditor';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import Avatar from '../Avatar';
import './CommentForm.less';
import EditorSlate from '../EditorExtended/editorSlate';
import { editorStateToMarkdownSlate } from '../EditorExtended/util/editorStateToMarkdown';
import { resetEditorState } from '../EditorExtended/util/SlateEditor/utils/SlateUtilityFunctions';
import { getEditorSlate } from '../../../store/slateEditorStore/editorSelectors';
import { setUpdatedEditorData } from '../../../store/slateEditorStore/editorActions';
import { checkCursorInSearchSlate } from '../../../common/helpers/editorHelper';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import objectTypes from '../../object/const/objectTypes';
import { getObjectUrl } from '../../../common/helpers/postHelpers';
import { insertObject } from '../EditorExtended/util/SlateEditor/utils/common';

const Element = Scroll.Element;

@withEditor
class CommentForm extends React.Component {
  static propTypes = {
    parentPost: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    top: PropTypes.bool,
    isSmall: PropTypes.bool,
    isLoading: PropTypes.bool,
    submitted: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    editor: PropTypes.shape(),
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
      isDisabledSubmit: false,
    };

    this.setInput = this.setInput.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.handleBodyUpdate = this.handleBodyUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.input && !this.props.top) {
      this.input.focus();
    }
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
          this.input.value = body.children;
        }
      },
    );
  }

  handleBodyUpdate(body) {
    this.setBodyAndRender(body);
  }

  handleSubmit(e) {
    e.stopPropagation();
    this.setState({ isDisabledSubmit: true });
    if (this.state.body) {
      const formattedBody = this.state.body.replace(/#([^\s#]+)/g, ' #$1');

      this.props.onSubmit(this.props.parentPost, formattedBody).then(response => {
        if (!_.get(response, 'error', false)) {
          this.setBodyAndRender('');
          const { editor } = this.props;

          resetEditorState(editor);
        }
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
    const { username, isSmall, isLoading } = this.props;
    const { bodyHTML } = this.state;

    const buttonClass = isLoading ? 'CommentForm__button_disabled' : 'CommentForm__button_primary';

    return (
      <div className="CommentForm">
        <Avatar username={username} size={!isSmall ? 40 : 32} />
        <div className="CommentForm__text">
          <Element name="commentFormInputScrollerElement">
            <div className="CommentForm__editor">
              <EditorSlate
                onChange={this.handleBodyUpdate}
                handleObjectSelect={this.handleObjectSelect}
                isComment
              />
            </div>
          </Element>
          <button
            onClick={this.handleSubmit}
            disabled={isLoading}
            className={`CommentForm__button ${buttonClass}`}
          >
            {isLoading && <Icon type="loading" />}
            {isLoading ? (
              <FormattedMessage id="comment_send_progress" defaultMessage="Commenting" />
            ) : (
              <FormattedMessage id="comment_send" defaultMessage="Comment" />
            )}
          </button>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);
