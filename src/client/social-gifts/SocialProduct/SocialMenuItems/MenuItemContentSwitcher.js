import React from 'react';
import PropTypes from 'prop-types';
import Checklist from '../../Checklist/Checklist';

const MenuItemContentSwitcher = ({ item }) => {
  const itemBody = JSON.parse(item.body);

  const getContentLayout = () => {
    if (['page', 'list', 'newsfeed', 'widget'].includes(itemBody.objectType)) {
      return <Checklist isSocialProduct permlink={itemBody.linkToObject} hideBreadCrumbs />;
    }

    return null;
  };

  return getContentLayout();
};

MenuItemContentSwitcher.propTypes = {
  item: PropTypes.shape().isRequired,
};

export default MenuItemContentSwitcher;
