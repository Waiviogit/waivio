import React from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ObjectFeed from './ObjectFeed';
import IconButton from '../../components/IconButton';
import { handleCreatePost } from '../../../common/helpers/wObjectHelper';
import Loading from '../../components/Icon/Loading';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';
import {
  getObjectFetchingState,
  getWobjectAuthors,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectPosts } from '../../../store/feedStore/feedActions';

const ObjectFeedContainer = ({ history, match, wobject, userName, isPageMode }) => {
  /* redux store */
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isFetching = useSelector(getObjectFetchingState);
  const authors = useSelector(getWobjectAuthors);

  const handleWriteReviewClick = () => {
    handleCreatePost(wobject, authors, history);
  };

  return (
    <React.Fragment>
      {isAuthenticated && !isPageMode && (
        <div className="object-feed__row justify-end">
          <IconButton
            icon={<Icon type="plus-circle" />}
            onClick={handleWriteReviewClick}
            caption={<FormattedMessage id="write_new_review" defaultMessage="Write a new review" />}
          />
        </div>
      )}
      {isFetching ? (
        <Loading />
      ) : (
        <ObjectFeed
          match={match}
          userName={userName}
          history={history}
          handleCreatePost={handleWriteReviewClick}
          wobject={wobject}
        />
      )}
    </React.Fragment>
  );
};

ObjectFeedContainer.propTypes = {
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isPageMode: PropTypes.bool,
};

ObjectFeedContainer.defaultProps = {
  isPageMode: false,
};

ObjectFeedContainer.fetchData = ({ store, match }) =>
  store.dispatch(
    getObjectPosts({
      object: match.params.name,
      username: match.params.name,
      // readLanguages: readLocales,
      limit: 10,
      // newsPermlink: permlink || getNewsPermlink(),
    }),
  );

export default ObjectFeedContainer;
