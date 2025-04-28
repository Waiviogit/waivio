import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import OBJECT_TYPE, { featuredObjectTypes } from '../../object/const/objectTypes';
import DnDListItem from './DnDListItem';
import './DnDList.less';

export const getItemStyle = (isDraggingOver, isDragging, draggableStyle, accentColor) => ({
  boxShadow: isDragging ? `0 0 5px ${accentColor}, 0 0 10px ${accentColor}` : 'none',
  opacity: isDraggingOver && !isDragging ? '.65' : 1,
  ...draggableStyle,
});

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

const DnDList = ({
  listItems,
  accentColor = 'lightgreen',
  onChange = () => {},
  wobjType = '',
  sortCustom,
}) => {
  const [items, setItems] = useState(listItems);
  const [expand, setExpand] = useState([]);
  const [include, setInclude] = useState();

  const filterItems = useCallback(i => i.filter(item => item.checkedItemInList), []);

  useEffect(() => {
    const productExpand = !isEmpty(sortCustom?.expand)
      ? sortCustom.expand
      : listItems.map(item => item.id);

    setItems(listItems);
    setExpand(featuredObjectTypes.includes(wobjType) ? sortCustom?.expand || [] : productExpand);
    setInclude(!isEmpty(sortCustom.include) ? sortCustom.include : listItems.map(item => item.id));
  }, [listItems.length]);
  const onCheckboxClick = id => {
    let updatedInclude;

    if (include.includes(id)) {
      updatedInclude = include.filter(itemId => itemId !== id);
    } else {
      updatedInclude = [...include, id];
    }

    setInclude(updatedInclude);

    // Optional: update checked state in the items list as well
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checkedItemInList: !include.includes(id) } : item,
    );

    setItems(updatedItems);

    // Send to parent or external change handler
    onChange({
      include: updatedInclude,
      expand,
    });
  };

  const setOpen = (e, id) => {
    let newExpanded;

    if (expand.includes(id)) {
      newExpanded = expand.filter(expandedId => expandedId !== id); // remove
    } else {
      newExpanded = [...expand, id]; // add
    }

    setExpand(newExpanded);

    onChange({
      expand: newExpanded,
      include,
    });
  };

  const handleDragEnd = useCallback(
    result => {
      if (!result.destination) return;

      const reordered = reorder(items, result.source.index, result.destination.index);
      let updatedList = reordered;

      setItems(reordered);

      if (wobjType === OBJECT_TYPE.LIST) {
        updatedList = filterItems(reordered);
      }

      onChange({
        include: updatedList.map(item => item.id),
        expand,
      });
    },
    [items],
  );

  const toggleItemInSortingList = useCallback(
    e => {
      const updated = items.map(item => ({
        ...item,
        checkedItemInList: item.id === e.target.id ? e.target.checked : item.checkedItemInList,
      }));

      setItems(updated);
      onChange({
        include: updated.filter(i => i.checkedItemInList).map(item => item.id),
      });
    },
    [items, onChange],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div className="dnd-list" ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    className="dnd-list__item"
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDraggingOver,
                      draggableSnapshot.isDragging,
                      draggableProvided.draggableProps.style,
                      accentColor,
                    )}
                  >
                    <DnDListItem
                      include={include}
                      onCheckboxClick={onCheckboxClick}
                      expandedIds={expand}
                      setOpen={setOpen}
                      item={item}
                      toggleItemInSortingList={toggleItemInSortingList}
                    />
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

DnDList.propTypes = {
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      checkedItemInList: PropTypes.bool,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      wobjType: PropTypes.string,
    }),
  ).isRequired,
  accentColor: PropTypes.string,
  sortCustom: PropTypes.arrayOf(),
  onChange: PropTypes.func,
  wobjType: PropTypes.string,
  screenSize: PropTypes.string,
  customSort: PropTypes.shape({
    include: PropTypes.arrayOf(PropTypes.string),
    exclude: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default DnDList;
