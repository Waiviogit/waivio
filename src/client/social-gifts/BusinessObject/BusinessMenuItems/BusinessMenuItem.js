import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { has } from 'lodash';

const BusinessMenuItem = ({ item, className }) => {
  const itemBody = JSON.parse(item.body);
  const pageType = ['list', 'page', 'webpage'].includes(itemBody.objectType)
    ? 'checklist'
    : 'object';
  const linkHref = has(itemBody, 'linkToObject')
    ? `/${pageType}/${itemBody.linkToObject}`
    : itemBody.linkToWeb;

  return (
    <div className={className || 'BusinessMenuItems__item'}>
      <Link target={'_blank'} to={linkHref}>
        {itemBody.title}
      </Link>
    </div>
  );
};

BusinessMenuItem.propTypes = {
  item: PropTypes.shape(),
  className: PropTypes.string,
};
export default BusinessMenuItem;
