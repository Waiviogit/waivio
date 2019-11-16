import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import * as store from '../../../reducers';
import {
  getFollowingUpdates,
  getFollowingObjectsUpdatesMore,
  getFollowingUsersUpdatesMore,
} from '../../../user/userActions';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import { getClientWObj } from '../../../adapters';
import Loading from '../../Icon/Loading';

const itemsCount = 3;
const usersSection = 'People';
function buildFollowingUpdatesMenuConfig(updates) {
  const config = {};
  const { usersUpdates, objectsUpdates } = updates;

  if (usersUpdates.users && usersUpdates.users.length) {
    config[usersSection] = {
      name: usersSection,
      intlId: 'people',
      isCollapsible: true,
      isCollapsed: !usersUpdates.users[0].last_posts_count,
      hasMore: usersUpdates.hasMore,
      items: usersUpdates.users.map(followingUser => ({
        name: `@${followingUser.name}`,
        intlId: `@${followingUser.name}`,
        meta: followingUser.last_posts_count > 0 ? followingUser.last_posts_count : '',
        linkTo: `/@${followingUser.name}`,
      })),
    };
  }

  if (!isEmpty(objectsUpdates)) {
    Object.values(objectsUpdates).forEach(objectsGroup => {
      const { object_type: objType, related_wobjects: objects, hasMore } = objectsGroup;
      config[objType] = {
        name: objType,
        intlId: objType,
        isCollapsible: true,
        isCollapsed: !(objects[0] && objects[0].last_posts_count),
        hasMore,
        items: objects.map(followingObject => {
          const clientObj = getClientWObj(followingObject);
          return {
            name: clientObj.name,
            intlId: clientObj.name,
            meta: clientObj.last_posts_count > 0 ? clientObj.last_posts_count : '',
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

  // local state
  const [menuConfig, updateMenu] = useState({});

  useEffect(() => dispatch(getFollowingUpdates(itemsCount)), [userName]);
  useEffect(() => updateMenu(buildFollowingUpdatesMenuConfig(followingUpdates)), [
    followingUpdates,
  ]);

  const loadMoreUpdates = menuSectionName => () => {
    if (menuSectionName === usersSection) {
      dispatch(getFollowingUsersUpdatesMore(itemsCount));
    } else {
      dispatch(getFollowingObjectsUpdatesMore(menuSectionName, itemsCount));
    }
  };
  return (
    !isEmpty(menuConfig) &&
    (followingUpdates.isFetching ? (
      <Loading />
    ) : (
      <SidebarMenu menuConfig={menuConfig} loadMore={loadMoreUpdates} />
    ))
  );
};

FollowingUpdates.propTypes = {};

FollowingUpdates.defaultProps = {};

export default FollowingUpdates;
