import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import { useHistory } from 'react-router';

const BusinessMenuItem = ({ item, className }) => {
  const itemBody = JSON.parse(item.body);
  const history = useHistory();
  // eslint-disable-next-line consistent-return
  const getLink = i => {
    const pageType = ['list', 'page', 'webpage'].includes(i.objectType) ? 'checklist' : 'object';

    if (has(i, 'linkToWeb')) {
      if (typeof window !== 'undefined') window.open(i.linkToWeb);
    } else {
      return history.push(`/${pageType}/${i.linkToObject}`);
    }
  };

  return (
    <div className={className || 'BusinessMenuItems__item'}>
      <Link onClick={() => getLink(itemBody)}>{itemBody.title}</Link>
    </div>
  );
};

BusinessMenuItem.propTypes = {
  item: PropTypes.shape(),
  className: PropTypes.string,
};
export default BusinessMenuItem;
