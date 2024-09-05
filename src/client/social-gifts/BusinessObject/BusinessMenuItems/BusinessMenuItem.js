import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { has, truncate } from 'lodash';
import { useHistory } from 'react-router';
import { isMobile } from '../../../../common/helpers/apiHelpers';

const BusinessMenuItem = ({ item, className }) => {
  const itemBody = JSON.parse(item.body);
  const history = useHistory();
  // eslint-disable-next-line consistent-return
  const getLink = i => {
    if (has(i, 'linkToWeb')) {
      if (typeof window !== 'undefined') window.open(i.linkToWeb);
    } else if (itemBody.objectType === 'shop') {
      return history.push(`/object-shop/${i.linkToObject}`);
    } else {
      return history.push(`/object/${i.linkToObject}`);
    }
  };

  return (
    <div className={className || 'BusinessMenuItems__menu-item'}>
      <Link onClick={() => getLink(itemBody)}>
        {truncate(itemBody.title, { length: isMobile() ? 35 : 20, separator: '…' })}
      </Link>
    </div>
  );
};

BusinessMenuItem.propTypes = {
  item: PropTypes.shape(),
  className: PropTypes.string,
};
export default BusinessMenuItem;
