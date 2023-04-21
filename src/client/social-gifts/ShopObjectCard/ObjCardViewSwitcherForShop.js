import React from 'react';
import PropTypes from 'prop-types';
import ShopObjectCard from './ShopObjectCard';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';

const ObjCardViewSwitcherForShop = ({ wObject }) => {
  const isWebsite = false;

  if (isWebsite) return <ShopObjectCard wObject={wObject} />;

  return <ObjectCardSwitcher wObj={wObject} />;
};

ObjCardViewSwitcherForShop.propTypes = {
  wObject: PropTypes.shape(),
};

export default ObjCardViewSwitcherForShop;
