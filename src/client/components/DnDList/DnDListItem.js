import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import OBJECT_TYPE from '../../object/const/objectTypes';
import './DnDListItem.less';

const DnDListItem = ({
  name,
  type,
  wobjType,
  id,
  toggleItemInSortingList,
  checkedItemInList,
  screenSize,
}) => {
  const isMobile = screenSize === 'xsmall' || 'small';
  const mobileName = name.length < 26 ? name : `${name.slice(0, 20)}...`;

  return (
    <div className="dnd-list-item">
      <div className="dnd-list-item__ckeckbox">
        {wobjType === OBJECT_TYPE.LIST ? (
          <Checkbox
            defaultChecked
            id={id}
            onChange={toggleItemInSortingList}
            checked={checkedItemInList}
          />
        ) : null}
        <div className="dnd-list-item__name">{isMobile ? mobileName : name}</div>
      </div>
      <div className="dnd-list-item__type">{type}</div>
    </div>
  );
};

DnDListItem.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  wobjType: PropTypes.string.isRequired,
  toggleItemInSortingList: PropTypes.shape().isRequired,
  id: PropTypes.string.isRequired,
  checkedItemInList: PropTypes.bool.isRequired,
  screenSize: PropTypes.string,
};

DnDListItem.defaultProps = {
  screenSize: '',
};

export default DnDListItem;
