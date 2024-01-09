import React from 'react';
import { Tabs } from 'antd';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import ObjectFeed from '../ObjectFeed';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import Threads from '../../Threads/Threads';

const ObjectReviewsAndThreads = ({ intl, match }) => {
  const wobject = useSelector(getObject);
  const tabName = match.params?.[0];

  return (
    <Tabs defaultActiveKey={tabName} className={'UserFollowers'}>
      <Tabs.TabPane
        className="UserFollowing__item"
        tab={
          <Link to={`/object/${wobject.author_permlink}/reviews`}>
            {intl.formatMessage({
              id: 'posts',
              defaultMessage: 'Posts',
            })}{' '}
          </Link>
        }
        key="reviews"
      >
        <ObjectFeed />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Link to={`/object/${wobject.author_permlink}/threads`}>
            {intl.formatMessage({ id: 'threads', defaultMessage: 'Threads' })}
          </Link>
        }
        key="threads"
        className="UserFollowing__item"
      >
        {tabName === 'threads' && <Threads isUser={false} />}
      </Tabs.TabPane>
    </Tabs>
  );
};

ObjectReviewsAndThreads.propTypes = {
  intl: PropTypes.shape(),
  match: PropTypes.shape(),
};

export default withRouter(injectIntl(ObjectReviewsAndThreads));
