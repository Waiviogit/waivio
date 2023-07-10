import React, { useEffect } from 'react';
import { isEmpty, uniq } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { getFeed } from '../../../../store/feedStore/feedSelectors';
import { getPosts } from '../../../../store/postsStore/postsSelectors';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../../common/helpers/stateHelpers';
import { preparationPostList } from '../../FeedMasonry/helpers';
import { getMoreObjectPosts, getObjectPosts } from '../../../../store/feedStore/feedActions';

import Loading from '../../../components/Icon/Loading';
import FeedMasonry from '../../FeedMasonry/FeedMasonry';
import { handleCreatePost } from '../../../../common/helpers/wObjectHelper';
import './SocialProductReviews.less';

const SocialProductReviews = ({ wobject, authors }) => {
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const dispatch = useDispatch();
  const history = useHistory();
  const { name } = useParams();
  const postsIds = uniq(getFeedFromState('objectPosts', name, feed));
  const hasMore = getFeedHasMoreFromState('objectPosts', name, feed);
  const isFetching = getFeedLoadingFromState('objectPosts', name, feed);
  const posts = preparationPostList(postsIds, postsList);
  const handleWriteReviewClick = () => {
    handleCreatePost(wobject, authors, history);
  };

  const getPostsList = () => {
    dispatch(
      getObjectPosts({
        object: name,
        username: name,
        limit: 20,
      }),
    );
  };

  useEffect(() => {
    getPostsList();
  }, [name]);

  const loadMore = () =>
    dispatch(
      getMoreObjectPosts({
        username: name,
        authorPermlink: name,
        limit: 20,
        skip: posts?.length,
      }),
    );

  if (isEmpty(posts) && isFetching) return <Loading />;

  return (
    <div>
      <div className="SocialProductReviews__container">
        <div className="SocialProductReviews__heading">User reviews</div>
        <button className="SocialProductReviews__link" onClick={handleWriteReviewClick}>
          <FormattedMessage id="write_review" defaultMessage="Write review" />
        </button>
      </div>
      <FeedMasonry posts={posts} hasMore={hasMore} loadMore={loadMore} loading={isFetching} />
    </div>
  );
};

SocialProductReviews.propTypes = {
  wobject: PropTypes.shape().isRequired,
  authors: PropTypes.arrayOf().isRequired,
};
export default SocialProductReviews;
