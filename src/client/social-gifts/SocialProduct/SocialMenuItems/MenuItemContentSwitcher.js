import React from 'react';
import PropTypes from 'prop-types';
import NestedChecklist from '../../Checklist/NestedChecklist';

const MenuItemContentSwitcher = ({ item }) => {
  const itemBody = JSON.parse(item.body);

  if (['page', 'list', 'newsfeed', 'widget'].includes(itemBody?.objectType || '')) {
    return <NestedChecklist permlink={itemBody.linkToObject} />;
  }

  return null;
};

MenuItemContentSwitcher.propTypes = {
  item: PropTypes.shape().isRequired,
};

export default MenuItemContentSwitcher;
