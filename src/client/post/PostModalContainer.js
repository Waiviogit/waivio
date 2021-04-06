import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as PropTypes from 'prop-types';
import {
  getUser,
  getPostContent,
  isGuestUser,
  getAuthenticatedUserName,
  getPostTags,
  getPostCities,
} from '../store/reducers';
import { getSocialInfoPost as getSocialInfoPostAction } from './postActions';
import { hidePostModal as hidePostModalAction } from '../store/appStore/appActions';
import PostModal from './PostModal';
import { getCurrentShownPost, getShowPostModal } from '../store/appStore/appSelectors';

const PostModalContainer = ({
  showPostModal,
  currentShownPost,
  hidePostModal,
  author,
  shownPostContents,
  getSocialInfoPost,
  isGuest,
  userName,
  postTags,
  postCities,
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
      postTags={postTags}
      postCities={postCities}
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
  postTags: PropTypes.shape(),
  postCities: PropTypes.shape(),
};

PostModalContainer.defaultProps = {
  author: {},
  showPostModal: false,
  currentShownPost: {},
  shownPostContents: {},
  isGuest: false,
  userName: '',
  postTags: [],
  postCities: [],
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
      postTags: getPostTags(state, author, permlink),
      postCities: getPostCities(state, author, permlink),
    };
  },
  {
    hidePostModal: hidePostModalAction,
    getSocialInfoPost: getSocialInfoPostAction,
  },
)(PostModalContainer);
