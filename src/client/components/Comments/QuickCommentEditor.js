import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import withEditor from '../Editor/withEditor';
import Avatar from '../Avatar';
import './QuickCommentEditor.less';

@withEditor
class QuickCommentEditor extends React.Component {
  static propTypes = {
    // parentPost: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    top: PropTypes.bool,
    // isSmall: PropTypes.bool,
    // isLoading: PropTypes.bool,
    // submitted: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    // onImageUpload: PropTypes.func,
    // onImageInvalid: PropTypes.func,
    // onSubmit: PropTypes.func,
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
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      isDisabledSubmit: false,
    };

    this.setInput = this.setInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.input && !this.props.top) {
      this.input.focus();
    }
  }

  setInput(input) {
    this.input = input;
  }

  handleSubmit(e) {
    e.stopPropagation();
    this.setState({ isDisabledSubmit: true });
  }

  render() {
    const { username, inputValue } = this.props;

    // const buttonClass = isLoading ? 'CommentForm__button_disabled' : 'CommentForm__button_primary';

    return (
      <div className="QuickComment">
        <div className="QuickComment__avatar">
          <Avatar username={username} size={34} />
        </div>
        <Input.TextArea autosize={{ minRows: 1, maxRows: 6 }} defaultValue={inputValue} />

        <i className="iconfont icon-picture QuickComment__add-img-icon" />
        {/* <EditorInput */}
        {/* rows={3} */}
        {/* inputRef={this.setInput} */}
        {/* value={body} */}
        {/* onImageUpload={this.props.onImageUpload} */}
        {/* onImageInvalid={this.props.onImageInvalid} */}
        {/* inputId={`${this.props.parentPost.id}-comment-inputfile`} */}
        {/* /> */}

        {/* <button */}
        {/* onClick={this.handleSubmit} */}
        {/* disabled={isLoading} */}
        {/* className={`CommentForm__button ${buttonClass}`} */}
        {/* > */}
        {/* {isLoading && <Icon type="loading" />} */}
        {/* {isLoading ? ( */}
        {/* <FormattedMessage id="comment_send_progress" defaultMessage="Commenting" /> */}
        {/* ) : ( */}
        {/* <FormattedMessage id="comment_send" defaultMessage="Comment" /> */}
        {/* )} */}
        {/* </button> */}
      </div>
    );
  }
}

export default QuickCommentEditor;
