import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as PropTypes from 'prop-types';
import { getSocialInfoPost as getSocialInfoPostAction } from '../../store/postsStore/postActions';
import { hidePostModal as hidePostModalAction } from '../../store/appStore/appActions';
import PostModal from './PostModal';
import {
  getCurrentShownPost,
  getShowPostModal,
  getWebsiteColors,
} from '../../store/appStore/appSelectors';
import { getAuthenticatedUserName, isGuestUser } from '../../store/authStore/authSelectors';
import { getPostContent } from '../../store/postsStore/postsSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import { addPayoutForActiveVotes } from '../../common/helpers';
import { getTokenRatesInUSD } from '../../store/walletStore/walletSelectors';
import { initialColors } from '../websites/constants/colors';

const PostModalContainer = ({
  showPostModal,
  currentShownPost,
  hidePostModal,
  author,
  shownPostContents,
  getSocialInfoPost,
  isGuest,
  userName,
  mainColor,
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
      mainColor={mainColor}
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
  mainColor: PropTypes.string,
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
    const getContent = getPostContent(permlink, author);
    const post = getContent(state);
    const waivRates = getTokenRatesInUSD(state, 'WAIV');
    const userName = getAuthenticatedUserName(state);
    const colors = getWebsiteColors(state);
    const mainColor = colors?.mapMarkerBody || initialColors.marker;

    return {
      showPostModal: getShowPostModal(state),
      author: getUser(state, author),
      currentShownPost,
      shownPostContents: {
        ...post,
        active_votes: addPayoutForActiveVotes(post, waivRates),
      },
      isGuest: isGuestUser(state),
      userName,
      mainColor,
    };
  },
  {
    hidePostModal: hidePostModalAction,
    getSocialInfoPost: getSocialInfoPostAction,
  },
)(PostModalContainer);
