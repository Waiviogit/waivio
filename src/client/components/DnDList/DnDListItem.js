import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Icon } from 'antd';
import './DnDListItem.less';

const DnDListItem = ({ item, include, setOpen, expandedIds, onCheckboxClick }) => {
  const isNestedObjType = ['page', 'list', 'newsfeed', 'widget'].includes(item.type);

  return (
    <div className="dnd-list-item">
      <Checkbox
        onClick={() => onCheckboxClick(item.id)}
        defaultChecked
        id={item.id}
        checked={include?.includes(item.id)}
      />

      <div className="dnd-list-content">
        <div className="dnd-list-content__name">{item.name}</div>
        {isNestedObjType && (
          <div className="dnd-list-content__type" onClick={e => setOpen(e, item.id)}>
            <Icon
              style={{ cursor: 'pointer' }}
              size={19}
              type={expandedIds?.includes(item.id) ? 'eye' : 'eye-invisible'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

DnDListItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    wobjType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    checkedItemInList: PropTypes.bool.isRequired,
  }),
  include: PropTypes.arrayOf(),
  expandedIds: PropTypes.arrayOf(),
  onCheckboxClick: PropTypes.func,
  setOpen: PropTypes.func,
};

DnDListItem.defaultProps = {
  screenSize: '',
};

export default DnDListItem;
