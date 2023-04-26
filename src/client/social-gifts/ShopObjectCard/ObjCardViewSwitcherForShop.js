import React from 'react';
import PropTypes from 'prop-types';
import ShopObjectCard from './ShopObjectCard';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';

import './ObjCardListViewSwitcherForShop.less';

const ObjCardListViewSwitcherForShop = ({ wobjects }) => {
  const isWebsite = false;

  if (isWebsite)
    return (
      <div className="ObjCardListViewSwitcherForShop__departmentsList">
        {wobjects?.map(wObject => (
          <ShopObjectCard key={wObject.author_permlink} wObject={wObject} />
        ))}
      </div>
    );

  return (
    <div>
      {wobjects?.map(wObject => (
        <ObjectCardSwitcher key={wObject.author_permlink} wObj={wObject} />
      ))}
    </div>
  );
};

ObjCardListViewSwitcherForShop.propTypes = {
  wobjects: PropTypes.arrayOf(),
};

export default ObjCardListViewSwitcherForShop;
