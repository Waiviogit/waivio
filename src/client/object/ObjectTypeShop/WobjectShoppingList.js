import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getWobjectShopMainFeed } from '../../../waivioApi/ApiClient';
import DepartmentsWobject from './DepartmentsWobject';
import EmptyCampaing from '../../statics/EmptyCampaing';
import ListSwitcher from '../../Shop/ListSwitch/ListSwitcher';

const WobjectShoppingList = ({ wobject }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return has(wobject, 'shopFilter') ? (
    <ListSwitcher
      setVisibleNavig={onOpen}
      userName={authUserName}
      path={`/object/${authorPermlink}/shop`}
      getShopFeed={(userName, authUser, filters, excluded, crumb, skip) =>
        getWobjectShopMainFeed(authorPermlink, authUser, skip)
      }
    >
      {visibleNavig && <DepartmentsWobject visible={visibleNavig} onClose={onClose} />}
    </ListSwitcher>
  ) : (
    <EmptyCampaing emptyMessage={'This shop does not have any products.'} />
  );
};

WobjectShoppingList.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default WobjectShoppingList;
