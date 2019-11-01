import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import StoryContainer from './StoryContainer';
import StoryLoading from '../components/Story/StoryLoading';
import './Feed.less';

const Feed = ({ content, isFetching, hasMore, loadMoreContent, showPostModal, empty, intl }) => {
  const message = (
    <React.Fragment>
      <div>
        {intl.formatMessage({
          id: 'empty_my_feed',
          defaultMessage: 'Your feed is empty because you are not following any user or topic',
        })}
      </div>
      <Link to="/discover-objects/show_all">
        {intl.formatMessage({
          id: 'objects_title',
          defaultMessage: 'Discover topics',
        })}
      </Link>
    </React.Fragment>
  );

  return empty ? (
    message
  ) : (
    <ReduxInfiniteScroll
      className="Feed"
      loadMore={loadMoreContent}
      loader={<StoryLoading />}
      loadingMore={isFetching}
      hasMore={hasMore}
      elementIsScrollable={false}
      threshold={1500}
    >
      {content.map(id => (
        <StoryContainer key={id} id={id} showPostModal={showPostModal} singlePostVew={false} />
      ))}
    </ReduxInfiniteScroll>
  );
};

Feed.propTypes = {
  showPostModal: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.string),
  isFetching: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMoreContent: PropTypes.func,
  intl: PropTypes.shape().isRequired,
  empty: PropTypes.bool.isRequired,
};

Feed.defaultProps = {
  content: [],
  isFetching: false,
  hasMore: false,
  loadMoreContent: () => {},
  showPostModal: () => {},
};

export default injectIntl(Feed);
