import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getAuthenticatedUserName } from '../../../reducers';
import { getFollowingUpdates } from '../../../user/userActions';

const itemsCount = 5;
const FollowingUpdates = () => {
  // redux store
  const dispatch = useDispatch();
  const userName = useSelector(getAuthenticatedUserName);

  const dispatchGetFollowingUsersUpdates = () => dispatch(getFollowingUpdates(itemsCount));
  useEffect(dispatchGetFollowingUsersUpdates, [userName]);

  return <div className="collapsible-block SidebarContentBlock__content">followings</div>;
};

FollowingUpdates.propTypes = {};

FollowingUpdates.defaultProps = {};

export default injectIntl(FollowingUpdates);
