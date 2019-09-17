import React from 'react';
import PropTypes from 'prop-types';
import './DnDListItem.less';

const DnDListItem = ({ name, type }) => (
  <div className="dnd-list-item">
    <div className="dnd-list-item__name">{name}</div>
    <div className="dnd-list-item__type">{type}</div>
  </div>
);

DnDListItem.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default DnDListItem;
