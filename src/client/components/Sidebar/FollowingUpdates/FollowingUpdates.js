import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  getFollowingObjectsUpdatesMore,
  getFollowingUpdates,
  getFollowingUsersUpdatesMore,
} from '../../../store/userStore/userActions';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import Loading from '../../Icon/Loading';
import { getObjectName } from '../../../helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import * as userSelectors from '../../../store/userStore/userSelectors';

const itemsCount = 5;
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
        linkTo: `/user-blog/@${followingUser.name}`,
        isUntranslatable: true,
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
          const name = getObjectName(followingObject) || followingObject.author_permlink;
          const intlId = followingObject.author_permlink;
          const meta = followingObject.last_posts_count > 0 ? followingObject.last_posts_count : '';
          const linkTo = `/feed/${followingObject.author_permlink}?category=${followingObject.object_type}&name=${followingObject.name}`;

          return {
            name,
            intlId,
            meta,
            linkTo,
            isUntranslatable: true,
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
  const followingUpdates = useSelector(userSelectors.getFollowingUpdates);
  const userName = useSelector(getAuthenticatedUserName);

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
