import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import OBJECT_TYPE from '../../object/const/objectTypes';
import './DnDListItem.less';

const DnDListItem = ({ name, type, wobjType, id, toggleItemInSortingList, checkedItemInList }) => (
  <div className="dnd-list-item">
    {wobjType === OBJECT_TYPE.LIST && (
      <Checkbox
        defaultChecked
        id={id}
        onChange={toggleItemInSortingList}
        checked={checkedItemInList}
      />
    )}
    <div className="dnd-list-content">
      <div className="dnd-list-content__name">{name}</div>
      <div className="dnd-list-content__type">{type}</div>
    </div>
  </div>
);

DnDListItem.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  wobjType: PropTypes.string.isRequired,
  toggleItemInSortingList: PropTypes.shape().isRequired,
  id: PropTypes.string.isRequired,
  checkedItemInList: PropTypes.bool.isRequired,
};

DnDListItem.defaultProps = {
  screenSize: '',
};

export default DnDListItem;
