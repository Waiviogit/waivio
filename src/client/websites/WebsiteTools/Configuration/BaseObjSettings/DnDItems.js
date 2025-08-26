import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Checkbox } from 'antd';
import { getItemStyle, reorder } from '../../../../components/DnDList/DnDList';
import { getWebsiteConfiguration } from '../../../../../store/appStore/appSelectors';
import { initialColors } from '../../../constants/colors';

const DnDItems = ({ sortedTabs, filters, changeTabFilters, setSortedTabs }) => {
  const config = useSelector(getWebsiteConfiguration);
  const color = config?.colors?.mapMarkerBody || initialColors.marker;
  const onDragEnd = result => {
    setSortedTabs(reorder(sortedTabs, result.source.index, result.destination.index));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tabs-list">
        {provided => (
          <div className="dnd-list" ref={provided.innerRef} {...provided.droppableProps}>
            {sortedTabs.map((tab, index) => (
              <Draggable key={tab} draggableId={tab} index={index}>
                {/* eslint-disable-next-line no-shadow */}
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="dnd-list__item"
                    style={getItemStyle(
                      provided.isDraggingOver,
                      snapshot.isDragging,
                      provided.draggableProps.style,
                      color,
                    )}
                  >
                    <div className="dnd-list-item-settings">
                      <Checkbox
                        onChange={e => changeTabFilters(e, tab)}
                        checked={!filters?.includes(tab)}
                      />
                      <div className="dnd-list-content__tab">
                        <div className="dnd-list-content__name">{tab}</div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

DnDItems.propTypes = {
  sortedTabs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  changeTabFilters: PropTypes.func.isRequired,
  setSortedTabs: PropTypes.func.isRequired,
};
export default DnDItems;
