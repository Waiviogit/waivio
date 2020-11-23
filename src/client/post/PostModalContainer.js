import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as PropTypes from 'prop-types';
import {
  getShowPostModal,
  getCurrentShownPost,
  getUser,
  getPostContent,
  isGuestUser,
  getAuthenticatedUserName,
} from '../reducers';
import { getSocialInfoPost as getSocialInfoPostAction } from './postActions';
import { hidePostModal as hidePostModalAction } from '../app/appActions';
import PostModal from './PostModal';

const PostModalContainer = ({
  showPostModal,
  currentShownPost,
  hidePostModal,
  author,
  shownPostContents,
  getSocialInfoPost,
  isGuest,
  userName,
}) =>
  showPostModal && (
    <PostModal
      showPostModal={showPostModal}
      currentShownPost={currentShownPost}
      hidePostModal={hidePostModal}
      author={author}
      shownPostContents={shownPostContents}
      getSocialInfoPost={getSocialInfoPost}
      isGuest={isGuest}
      username={userName}
    />
  );

PostModalContainer.propTypes = {
  hidePostModal: PropTypes.func.isRequired,
  author: PropTypes.shape().isRequired,
  showPostModal: PropTypes.bool,
  currentShownPost: PropTypes.shape(),
  shownPostContents: PropTypes.shape(),
  getSocialInfoPost: PropTypes.func.isRequired,
  isGuest: PropTypes.bool,
  userName: PropTypes.string,
};

PostModalContainer.defaultProps = {
  author: {},
  showPostModal: false,
  currentShownPost: {},
  shownPostContents: {},
  isGuest: false,
  userName: '',
};

export default connect(
  state => {
    const currentShownPost = getCurrentShownPost(state);
    const author = get(currentShownPost, 'author');
    const permlink = get(currentShownPost, 'permlink');
    return {
      showPostModal: getShowPostModal(state),
      author: getUser(state, author),
      currentShownPost,
      shownPostContents: getPostContent(state, permlink, author),
      isGuest: isGuestUser(state),
      userName: getAuthenticatedUserName(state),
    };
  },
  {
    hidePostModal: hidePostModalAction,
    getSocialInfoPost: getSocialInfoPostAction,
  },
)(PostModalContainer);
