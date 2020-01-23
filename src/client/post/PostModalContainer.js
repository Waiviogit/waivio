import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as PropTypes from 'prop-types';
import { getShowPostModal, getCurrentShownPost, getUser, getPostContent } from '../reducers';
import { hidePostModal as hidePostModalAction } from '../app/appActions';
import PostModal from './PostModal';

const PostModalContainer = ({
  showPostModal,
  currentShownPost,
  hidePostModal,
  author,
  shownPostContents,
}) =>
  showPostModal && (
    <PostModal
      showPostModal={showPostModal}
      currentShownPost={currentShownPost}
      hidePostModal={hidePostModal}
      author={author}
      shownPostContents={shownPostContents}
    />
  );

PostModalContainer.propTypes = {
  hidePostModal: PropTypes.func.isRequired,
  author: PropTypes.string.isRequired,
  showPostModal: PropTypes.bool,
  currentShownPost: PropTypes.shape(),
  shownPostContents: PropTypes.bool,
};

PostModalContainer.defaultProps = {
  showPostModal: false,
  currentShownPost: {},
  shownPostContents: false,
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
      shownPostContents: getPostContent(state, author, permlink),
    };
  },
  {
    hidePostModal: hidePostModalAction,
  },
)(PostModalContainer);
