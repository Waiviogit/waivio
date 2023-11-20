import React from 'react';
import PropTypes from 'prop-types';

import ShopObjectCard from './ShopObjectCard';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';

import './ObjCardListViewSwitcherForShop.less';

const ObjCardListViewSwitcherForShop = ({ wobjects, isSocial }) => {
  if (isSocial)
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
  isSocial: PropTypes.bool,
};

export default ObjCardListViewSwitcherForShop;
