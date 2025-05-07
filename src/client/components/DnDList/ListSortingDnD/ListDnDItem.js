import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import OBJECT_TYPE from '../../../object/const/objectTypes';
import '../DnDListItem.less';

const DnDListItem = ({ item, toggleItemInSortingList }) => (
  <div className="dnd-list-item">
    {item.wobjType === OBJECT_TYPE.LIST && (
      <Checkbox
        defaultChecked
        id={item.id}
        onChange={toggleItemInSortingList}
        checked={item.checkedItemInList}
      />
    )}
    <div className="dnd-list-content">
      <div className="dnd-list-content__name">{item.name}</div>
      <div className="dnd-list-content__type">{item.type}</div>
    </div>
  </div>
);

DnDListItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    wobjType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    checkedItemInList: PropTypes.bool.isRequired,
  }),
  toggleItemInSortingList: PropTypes.shape().isRequired,
};

DnDListItem.defaultProps = {
  screenSize: '',
};

export default DnDListItem;
