import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

import ObjCardListViewSwitcherForShop from '../../../social-gifts/ShopObjectCard/ObjCardViewSwitcherForShop';
import '../ShopList.clean.less';

const CleanShopListView = ({ dep, getPath, isSocial, wobjectsWithAd, intl }) => (
  <div className="ShopListClean__departments">
    <div className="ShopListClean__departments-header">
      <Link to={getPath(dep.department)} className="ShopListClean__departments-title">
        {dep.department} <Icon size={12} type="right" />
      </Link>
      {dep.hasMore && (
        <Link className="ShopListClean__showMore" to={getPath(dep.department)}>
          {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })} {dep.department}
        </Link>
      )}
    </div>
    <ObjCardListViewSwitcherForShop isSocial={isSocial} wobjects={wobjectsWithAd} />
  </div>
);

CleanShopListView.propTypes = {
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

export default CleanShopListView;
