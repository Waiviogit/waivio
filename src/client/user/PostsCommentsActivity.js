import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tabs } from 'antd';
import EmptyMutedUserProfile from '../statics/MutedContent';
import { getAuthenticatedUserName, isGuestUser } from '../../store/authStore/authSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import UserProfilePosts from './UserComments';
import UserActivity from '../activity/UserActivity';
import UserBlog from './UserBlog/UserBlog';

const PostsCommentsActivity = props => {
  const [activeKey, setActiveKey] = useState(props.match.params[0] || 'posts');
  const { match, authenticatedUserName, user, intl } = props;
  const { name } = match.params;

  const postTabKey = 'posts';

  if (!isEmpty(user.mutedBy) || user.muted)
    return <EmptyMutedUserProfile user={user} authName={authenticatedUserName} />;

  const onTabChange = key => {
    setActiveKey(key);
    postTabKey !== key ? props.history.push(`/@${name}/${key}`) : props.history.push(`/@${name}`);
  };

  return (
    <Tabs defaultActiveKey={activeKey} className={'UserFollowers'} onChange={onTabChange}>
      <Tabs.TabPane
        tab={intl.formatMessage({ id: 'posts', defaultMessage: 'Posts' })}
        key={postTabKey}
      >
        {activeKey === 'posts' && <UserBlog />}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={intl.formatMessage({ id: 'comments', defaultMessage: 'Comments' })}
        key="comments"
      >
        {activeKey === 'comments' && <UserProfilePosts match={match} />}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={intl.formatMessage({ id: 'activity', defaultMessage: 'Activity' })}
        key="activity"
      >
        {activeKey === 'activity' && !props.isGuest && <UserActivity />}
      </Tabs.TabPane>
    </Tabs>
  );
};

PostsCommentsActivity.propTypes = {
  match: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  isGuest: PropTypes.bool,
  authenticatedUserName: PropTypes.string,
  history: PropTypes.shape(),
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
