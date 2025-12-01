import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

import ObjCardListViewSwitcherForShop from '../../../social-gifts/ShopObjectCard/ObjCardViewSwitcherForShop';

const ClassicShopListView = ({ dep, getPath, isSocial, wobjectsWithAd, intl }) => (
  <div className="ShopList__departments">
    <Link to={getPath(dep.department)} className="ShopList__departments-title">
      {dep.department} <Icon size={12} type="right" />
    </Link>
    <ObjCardListViewSwitcherForShop isSocial={isSocial} wobjects={wobjectsWithAd} />
    {dep.hasMore && (
      <Link className="ShopList__showMore" to={getPath(dep.department)}>
        {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })} {dep.department}
      </Link>
    )}
  </div>
);

ClassicShopListView.propTypes = {
  dep: PropTypes.shape({
    department: PropTypes.string,
    hasMore: PropTypes.bool,
    wobjects: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  getPath: PropTypes.func.isRequired,
  isSocial: PropTypes.bool,
  wobjectsWithAd: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape(), PropTypes.node])),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default ClassicShopListView;
