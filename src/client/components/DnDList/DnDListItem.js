import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Icon, Tooltip } from 'antd';
import './DnDListItem.less';

const DnDListItem = ({ item, exclude, setOpen, expandedIds, onCheckboxClick }) => {
  const isNestedObjType = ['page', 'list', 'newsfeed', 'widget'].includes(item.type);
  const isOpen = expandedIds?.includes(item.id);

  return (
    <div className="dnd-list-item">
      <Checkbox
        onClick={() => onCheckboxClick(item.id)}
        defaultChecked
        id={item.id}
        checked={!exclude?.includes(item.id)}
      />

      <div className="dnd-list-content">
        <div className="dnd-list-content__name">{item.name}</div>
        {isNestedObjType && (
          <div className="dnd-list-content__type" onClick={e => setOpen(e, item.id)}>
            <Tooltip
              title={isOpen ? 'Collapse on social sites' : 'Expand on social sites'}
              overlayClassName="HeartButtonContainer"
              overlayStyle={{ top: '10px' }}
              placement={'topLeft'}
            >
              <Icon
                style={{ cursor: 'pointer' }}
                size={19}
                type={isOpen ? 'eye' : 'eye-invisible'}
              />
            </Tooltip>
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
  exclude: PropTypes.arrayOf(),
  expandedIds: PropTypes.arrayOf(),
  onCheckboxClick: PropTypes.func,
  setOpen: PropTypes.func,
};

DnDListItem.defaultProps = {
  screenSize: '',
};

export default DnDListItem;
