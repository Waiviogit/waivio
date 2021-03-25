import React from 'react';
import PropTypes from 'prop-types';
import { size } from 'lodash';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import StoryContainer from './StoryContainer';
import StoryLoading from '../components/Story/StoryLoading';
import Loading from '../components/Icon/Loading';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';

import './Feed.less';

const Feed = ({
  content,
  isFetching,
  hasMore,
  loadMoreContent,
  showPostModal,
  isGuest,
  history,
  userComments,
  isOwnProfile,
}) => {
  if (
    isGuest &&
    isOwnProfile &&
    !size(content) &&
    !isFetching &&
    !history.location.pathname.includes('blog')
  ) {
    return <QuickPostEditor history={history} />;
  }

  return (
    <ReduxInfiniteScroll
      className="Feed"
      loadMore={loadMoreContent}
      loader={userComments ? <Loading /> : <StoryLoading />}
      loadingMore={isFetching}
      hasMore={hasMore}
      elementIsScrollable={false}
      threshold={1500}
    >
      {content.map(id => (
        <StoryContainer
          key={id}
          id={id}
          showPostModal={showPostModal}
          singlePostVew={false}
          userComments={userComments}
        />
      ))}
    </ReduxInfiniteScroll>
  );
};

Feed.propTypes = {
  showPostModal: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.string),
  isFetching: PropTypes.bool,
  hasMore: PropTypes.bool,
  isGuest: PropTypes.bool,
  loadMoreContent: PropTypes.func,
  history: PropTypes.shape(),
  userComments: PropTypes.bool,
  isOwnProfile: PropTypes.bool,
};

Feed.defaultProps = {
  content: [],
  isFetching: false,
  hasMore: false,
  isGuest: false,
  loadMoreContent: () => {},
  showPostModal: () => {},
  history: {},
  userComments: false,
  isOwnProfile: false,
};

export default Feed;
