import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAuthenticatedUser } from '../../reducers';
import Editor from '../../components/Editor_new/Editor';

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

  render() {
    const { draftId, user } = this.props;
    console.log('user > ', user);
    console.log('draft > ', draftId);
    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="rightContainer">
            <div className="right">[drafts block]</div>
          </div>
          <div className="center">
            <Editor />
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
