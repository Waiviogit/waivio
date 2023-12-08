import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { uniq } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThreadsEditor from './ThreadsEditor/ThreadsEditor';
import { showPostModal } from '../../../store/appStore/appActions';
import PostModal from '../../post/PostModalContainer';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import { getMoreThreadsContent, getThreadsContent } from '../../../store/feedStore/feedActions';
import { isGuestUser } from '../../../store/authStore/authSelectors';
import Feed from '../../feed/Feed';

const limit = 10;

const ObjectThreads = props => {
  const { name } = useParams();
  const isFetching = getFeedLoadingFromState('threads', name, props.feed);
  const objectFeed = getFeedFromState('threads', name, props.feed);
  const hasMore = getFeedHasMoreFromState('threads', name, props.feed);
  const threads = uniq(objectFeed);

  const loadMoreThreads = () => {
    props.getMoreThreadsContent(name, limit);
  };

  useEffect(() => {
    props.getThreadsContent(name, 0, limit);
  }, []);

  return (
    <div>
      <ThreadsEditor />
      <div>
        <Feed
          isThread
          content={threads}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreThreads}
          showPostModal={post => props.showPostModal(post)}
          isGuest={props.isGuest}
        />
        <PostModal />
      </div>
    </div>
  );
};

ObjectThreads.propTypes = {
  feed: PropTypes.shape(),
  getThreadsContent: PropTypes.func,
  getMoreThreadsContent: PropTypes.func,
  showPostModal: PropTypes.func,
  isGuest: PropTypes.bool,
};

export default connect(
  state => ({
    feed: getFeed(state),
    isGuest: isGuestUser(state),
  }),
  {
    getThreadsContent,
    getMoreThreadsContent,
    showPostModal,
  },
)(ObjectThreads);
