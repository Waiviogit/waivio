import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Tabs } from 'antd';
import EmptyMutedUserProfile from '../../statics/MutedContent';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import { getUser } from '../../../store/usersStore/usersSelectors';
import UserProfilePosts from '../UserComments';
import UserActivity from '../../activity/UserActivity';
import UserBlog from '../UserBlog/UserBlog';
import Threads from '../../Threads/Threads';

const PostsCommentsActivity = props => {
  const { match, authenticatedUserName, user, intl } = props;
  const { name, 0: tab = 'posts' } = match.params;

  if (!isEmpty(user.mutedBy) || user.muted)
    return <EmptyMutedUserProfile user={user} authName={authenticatedUserName} />;

  return (
    <Tabs defaultActiveKey={tab} className={'UserFollowers'} activeKey={tab}>
      <Tabs.TabPane
        tab={
          <Link to={`/@${name}`}>
            {intl.formatMessage({ id: 'posts', defaultMessage: 'Posts' })}
          </Link>
        }
        key={'posts'}
      >
        {tab === 'posts' && <UserBlog />}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Link to={`/@${name}/threads`}>
            {intl.formatMessage({ id: 'threads', defaultMessage: 'Threads' })}
          </Link>
        }
        key="threads"
      >
        {tab === 'threads' && <Threads isUser />}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Link to={`/@${name}/comments`}>
            {intl.formatMessage({ id: 'comments', defaultMessage: 'Comments' })}
          </Link>
        }
        key="comments"
      >
        {tab === 'comments' && <UserProfilePosts match={match} />}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Link to={`/@${name}/activity`}>
            {intl.formatMessage({ id: 'activity', defaultMessage: 'Activity' })}
          </Link>
        }
        key="activity"
      >
        {tab === 'activity' && !props.isGuest && <UserActivity />}
      </Tabs.TabPane>
    </Tabs>
  );
};

PostsCommentsActivity.propTypes = {
  match: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  isGuest: PropTypes.bool,
  authenticatedUserName: PropTypes.string,
  user: PropTypes.shape(),
};

PostsCommentsActivity.defaultProps = {
  limit: 10,
  isGuest: false,
  user: {},
};

export default connect((state, ownProps) => ({
  authenticatedUserName: getAuthenticatedUserName(state),
  isGuest: isGuestUser(state),
  user: getUser(state, ownProps.match.params.name),
}))(injectIntl(withRouter(PostsCommentsActivity)));
