import React from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import ObjectFeed from './ObjectFeed';
import { getIsAuthenticated, getObjectFetchingState } from '../../reducers';
import IconButton from '../../components/IconButton';
import { getObjectName } from '../../helpers/wObjectHelper';
import Loading from '../../components/Icon/Loading';

const propTypes = {
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isPageMode: PropTypes.bool,
};

const defaultProps = {
  isPageMode: false,
};

const ObjectFeedContainer = ({ history, match, wobject, userName, isPageMode }) => {
  /* redux store */
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isFetching = useSelector(getObjectFetchingState);

  const handleCreatePost = () => {
    if (wobject && wobject.author_permlink) {
      let redirectUrl = `/editor?object=`;
      redirectUrl += encodeURIComponent(
        `[${wobject.name || wobject.default_name}](${wobject.author_permlink})`,
      );
      if (!isEmpty(wobject.parent)) {
        const parentObject = wobject.parent;
        redirectUrl += `&object=${encodeURIComponent(
          `[${getObjectName(parentObject)}](${parentObject.author_permlink})`,
        )}`;
      }
      history.push(redirectUrl);
    }
  };

  return (
    <React.Fragment>
      {isAuthenticated && !isPageMode && (
        <div className="object-feed__row justify-end">
          <IconButton
            icon={<Icon type="plus-circle" />}
            onClick={handleCreatePost}
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
          handleCreatePost={handleCreatePost}
          wobject={wobject}
        />
      )}
    </React.Fragment>
  );
};

ObjectFeedContainer.propTypes = propTypes;
ObjectFeedContainer.defaultProps = defaultProps;

export default ObjectFeedContainer;
