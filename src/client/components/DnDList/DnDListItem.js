import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import OBJECT_TYPE from '../../object/const/objectTypes';
import './DnDListItem.less';

const DnDListItem = ({ name, type, wobjType, id, toggleItemInSortingList, itemInList }) => (
  <div className="dnd-list-item">
    <div className="dnd-list-item__ckeckbox">
      {wobjType === OBJECT_TYPE.LIST ? (
        <Checkbox defaultChecked id={id} onChange={toggleItemInSortingList} checked={itemInList} />
      ) : null}
      <div className="dnd-list-item__name">{name}</div>
    </div>
    <div className="dnd-list-item__type">{type}</div>
  </div>
);

DnDListItem.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  wobjType: PropTypes.string.isRequired,
  toggleItemInSortingList: PropTypes.shape().isRequired,
  id: PropTypes.string.isRequired,
  itemInList: PropTypes.bool.isRequired,
};

export default DnDListItem;
