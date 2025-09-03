import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { showPostModal } from '../../../store/appStore/appActions';
import {
  resetProfileFilters,
  getTiktokPreviewAction,
  getFeedContent,
  getMoreFeedContent,
} from '../../../store/feedStore/feedActions';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  // getFeedFetchedFromState,
} from '../../../common/helpers/stateHelpers';
import { getPosts } from '../../../store/postsStore/postsSelectors';

import Feed from '../../feed/Feed';
import PostModal from '../../post/PostModalContainer';

const JudgePosts = props => {
  const { authorPermlink } = useParams();

  useEffect(() => {
    if (props.authenticatedUserName) {
      props.getFeedContent({
        sortBy: 'judgesPosts',
        category: props.authenticatedUserName,
        limit: 10,
        isJudges: true,
        authorPermlink,
      });
    }
  }, [props.authenticatedUserName]);

  const content = getFeedFromState('judgesPosts', props.authenticatedUserName, props.feed);
  const isFetching = getFeedLoadingFromState(
    'judgesPosts',
    props.authenticatedUserName,
    props.feed,
  );
  // const fetched = getFeedFetchedFromState('judgesPosts', props.authenticatedUserName, props.feed);
  const hasMore = getFeedHasMoreFromState('judgesPosts', props.authenticatedUserName, props.feed);

  const loadMoreContentAction = () =>
    props.getMoreFeedContent({
      sortBy: 'judgesPosts',
      category: props.authenticatedUserName,
      limit: 10,
      isJudges: true,
      authorPermlink,
    });

  if (!props.authenticatedUserName) {
    return (
      <div className="judge-posts">
        <div>Please log in to view judge posts.</div>
      </div>
    );
  }

  return (
    <div className="judge-posts">
      <h2>Judge Posts</h2>
      <p>Review posts that require your judgment as a judge.</p>

      <Feed
        content={content}
        isFetching={isFetching}
        hasMore={hasMore}
        loadMoreContent={loadMoreContentAction}
        showPostModal={props.showPostModal}
        isGuest={false}
      />

      <PostModal userName={props.authenticatedUserName} />
    </div>
  );
};

JudgePosts.propTypes = {
  getFeedContent: PropTypes.func,
  getMoreFeedContent: PropTypes.func,
  showPostModal: PropTypes.bool,
  authenticatedUserName: PropTypes.string,
  feed: PropTypes.shape(),
};

const mapStateToProps = state => ({
  authenticatedUserName: getAuthenticatedUserName(state),
  feed: getFeed(state),
  posts: getPosts(state),
});

const mapDispatchToProps = {
  getFeedContent,
  getMoreFeedContent,
  showPostModal,
  resetProfileFilters,
  getTiktokPreviewAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(JudgePosts);
