import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as store from '../../../reducers';
import { getFollowingUpdates } from '../../../user/userActions';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import { getClientWObj } from '../../../adapters';
import Loading from '../../Icon/Loading';

const itemsCount = 5;
function buildFollowingUpdatesMenuConfig(updates) {
  const config = {};
  const { usersUpdates, objectsUpdates } = updates;

  if (usersUpdates.users && usersUpdates.users.length) {
    config.People = {
      name: 'People',
      intlId: 'people',
      isCollapsible: true,
      isCollapsed: Boolean(usersUpdates.users[0].last_posts_count),
      items: usersUpdates.users.map(followingUser => ({
        name: `@${followingUser.name}`,
        intlId: `@${followingUser.name}`,
        linkTo: `/@${followingUser.name}`,
      })),
    };
  }

  if (objectsUpdates && objectsUpdates.length) {
    objectsUpdates.forEach(objectsGroup => {
      const { object_type: objType, related_wobjects: objects } = objectsGroup;
      config[objType] = {
        name: objType,
        intlId: objType,
        isCollapsible: true,
        isCollapsed: false,
        items: objects.map(followingObject => {
          const clientObj = getClientWObj(followingObject);
          return {
            name: clientObj.name,
            intlId: clientObj.name,
            linkTo: `/object/${clientObj.id}`,
          };
        }),
      };
    });
  }

  return config;
}

const FollowingUpdates = () => {
  // redux store
  const dispatch = useDispatch();
  const followingUpdates = useSelector(store.getFollowingUpdates);
  const userName = useSelector(store.getAuthenticatedUserName);

  const dispatchGetFollowingUsersUpdates = () => dispatch(getFollowingUpdates(itemsCount));
  useEffect(dispatchGetFollowingUsersUpdates, [userName]);

  const menuConfig = buildFollowingUpdatesMenuConfig(followingUpdates);

  return followingUpdates.isFetching ? <Loading /> : <SidebarMenu menuConfig={menuConfig} />;
};

FollowingUpdates.propTypes = {};

FollowingUpdates.defaultProps = {};

export default FollowingUpdates;
