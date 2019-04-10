import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAuthenticatedUser } from '../../reducers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';

@withRouter
@connect((state, props) => ({
  user: getAuthenticatedUser(state),
  draftId: new URLSearchParams(props.location.search).get('draft'),
}))
class EditPost extends Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    draftId: PropTypes.string,
  };
  static defaultProps = {
    draftId: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      content: '',
    };
    this.handleChangeContent = this.handleChangeContent.bind(this);
  }

  handleChangeContent(content) {
    this.setState({ content });
  }

  render() {
    const { content } = this.state;
    const { draftId, user } = this.props;
    console.log('user > ', user); // todo: remove this
    console.log('draft > ', draftId);
    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor
              onChange={this.handleChangeContent}
              onAddObject={obj => console.log('postEdit.onAddObject > >\n ', obj)}
            />
            <PostPreviewModal content={content} />
          </div>
          <div className="rightContainer">
            <div className="right">[drafts block]</div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
