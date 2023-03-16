import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ShopList from '../../Shop/ShopList/ShopList';
import { getWobjectShopMainFeed } from '../../../waivioApi/ApiClient';
import DepartmentsWobject from './DepartmentsWobject';

const WobjectShoppingList = () => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return (
    <ShopList
      setVisibleNavig={onOpen}
      userName={authUserName}
      path={`/object/${authorPermlink}/shop`}
      getShopFeed={(userName, authUser, filter, excluded, crumb, skip, path) =>
        getWobjectShopMainFeed(authorPermlink, authUser, skip, path)
      }
    >
      {visibleNavig && <DepartmentsWobject visible={visibleNavig} onClose={onClose} />}
    </ShopList>
  );
};

WobjectShoppingList.propTypes = {};

export default WobjectShoppingList;
