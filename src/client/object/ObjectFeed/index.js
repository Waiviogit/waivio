import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ObjectFeed from './ObjectFeed';
import IconButton from '../../components/IconButton';
import { handleCreatePost } from '../../../common/helpers/wObjectHelper';
import Loading from '../../components/Icon/Loading';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getObject as getObjectState,
  getObjectFetchingState,
  getWobjectAuthors,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectPosts } from '../../../store/feedStore/feedActions';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { getObject } from '../../../waivioApi/ApiClient';

const ObjectFeedContainer = ({
  history,
  match,
  wobject,
  userName,
  isPageMode,
  intl,
  inNewsFeed,
}) => {
  const [nestedWobj, setNestedWobj] = useState({});
  const isAuthenticated = useSelector(getIsAuthenticated);
  const locale = useSelector(getUsedLocale);
  const authUserName = useSelector(getAuthenticatedUserName);
  const isFetching = useSelector(getObjectFetchingState);
  const authors = useSelector(getWobjectAuthors);
  const handleWriteReviewClick = () => {
    handleCreatePost(wobject, authors, history);
  };

  useEffect(() => {
    if (match?.params?.parentName && match?.params?.name) {
      getObject(match?.params?.parentName, authUserName, locale).then(res => setNestedWobj(res));
    }
  }, [match?.params?.parentName, match?.params?.name]);

  return (
    <React.Fragment>
      {isAuthenticated && !isPageMode && (
        <>
          {match?.params?.parentName ? (
            <CatalogBreadcrumb wobject={nestedWobj} intl={intl} />
          ) : (
            <div className="object-feed__row justify-end">
              <IconButton
                icon={<Icon type="plus-circle" />}
                onClick={handleWriteReviewClick}
                caption={
                  <FormattedMessage id="write_new_review" defaultMessage="Write a new review" />
                }
              />
            </div>
          )}
        </>
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
          inNewsFeed={inNewsFeed}
        />
      )}
    </React.Fragment>
  );
};

ObjectFeedContainer.propTypes = {
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  intl: PropTypes.shape(),
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isPageMode: PropTypes.bool,
  inNewsFeed: PropTypes.bool,
};

ObjectFeedContainer.defaultProps = {
  isPageMode: false,
};
const mapStateToProps = state => ({
  wobject: getObjectState(state),
  userName: getAuthenticatedUserName(state),
});

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

export default connect(mapStateToProps, null)(withRouter(injectIntl(ObjectFeedContainer)));
