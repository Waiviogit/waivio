import React, { useEffect } from 'react';
import { isEmpty, uniq } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
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
import {
  getLastPermlinksFromHash,
  getObjectName,
  handleCreatePost,
} from '../../../../common/helpers/wObjectHelper';
import './SocialProductReviews.less';
import { getIsAuthenticated } from '../../../../store/authStore/authSelectors';
import {
  getCurrentHost,
  getUsedLocale,
  getWebsiteColors,
  getWebsiteName,
} from '../../../../store/appStore/appSelectors';
import { initialColors } from '../../../websites/constants/colors';

const SocialProductReviews = ({ wobject, authors, intl }) => {
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const isAuthUser = useSelector(getIsAuthenticated);
  const dispatch = useDispatch();
  const history = useHistory();
  const { name } = useParams();
  const objName =
    history.location.hash && wobject.object_type !== 'restaurant'
      ? getLastPermlinksFromHash(history.location.hash)
      : name;
  const postsIds = uniq(getFeedFromState('objectPosts', objName, feed));
  const hasMore = getFeedHasMoreFromState('objectPosts', objName, feed);
  const isFetching = getFeedLoadingFromState('objectPosts', objName, feed);
  const posts = preparationPostList(postsIds, postsList);
  const host = useSelector(getCurrentHost);
  const colors = useSelector(getWebsiteColors);
  const websiteName = useSelector(getWebsiteName);
  const color = colors?.mapMarkerBody || initialColors.marker;
  const usedLocale = useSelector(getUsedLocale);
  const handleWriteReviewClick = () => {
    if (!isAuthUser) {
      history.push(
        `/sign-in?host=${host}&backUrl=${host}/object/${wobject.author_permlink}&color=${color}&usedLocale=${usedLocale}&websiteName=${websiteName}`,
      );
    } else {
      handleCreatePost(wobject, authors, history);
    }
  };

  const getPostsList = () => {
    dispatch(
      getObjectPosts({
        object: objName,
        username: objName,
        limit: 20,
      }),
    );
  };

  useEffect(() => {
    getPostsList();
  }, [objName]);

  const loadMore = () =>
    dispatch(
      getMoreObjectPosts({
        username: objName,
        authorPermlink: objName,
        limit: 20,
        skip: posts?.length,
      }),
    );

  if (isEmpty(posts) && isFetching) return <Loading />;

  return (
    <div>
      <div className="SocialProductReviews__container">
        <div className="SocialProductReviews__heading">
          {intl.formatMessage({ id: 'user_reviews', defaultMessage: 'User reviews' })}
        </div>
        <button className="SocialProductReviews__link" onClick={handleWriteReviewClick}>
          <FormattedMessage id="write_review" defaultMessage="Write review" />
        </button>
      </div>
      <FeedMasonry
        objName={getObjectName(wobject)}
        emptyLable={intl.formatMessage({
          id: 'empty_object_profile',
          defaultMessage: 'Be the first to write a review',
        })}
        posts={posts}
        hasMore={hasMore}
        loadMore={loadMore}
        loading={isFetching}
        writeReview={handleWriteReviewClick}
      />
    </div>
  );
};

SocialProductReviews.propTypes = {
  wobject: PropTypes.shape({
    object_type: PropTypes.string,
    author_permlink: PropTypes.string,
  }).isRequired,
  authors: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};
export default injectIntl(SocialProductReviews);
