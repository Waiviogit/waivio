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
  const [include, setInclude] = useState([]);
  const [exclude, setExclude] = useState([]);

  const filterItems = useCallback(i => i.filter(item => item.checkedItemInList), []);

  useEffect(() => {
    const productExpand = !isEmpty(sortCustom?.expand)
      ? sortCustom.expand
      : listItems.map(item => item.id);

    setItems(
      listItems.sort((a, b) => {
        const indexA = sortCustom?.include?.indexOf(a.id);
        const indexB = sortCustom?.include?.indexOf(b.id);

        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
      }),
    );
    setExpand(featuredObjectTypes?.includes(wobjType) ? sortCustom?.expand || [] : productExpand);
    setInclude(isEmpty(sortCustom) ? listItems.map(item => item.id) : sortCustom.include);
    setExclude(!isEmpty(sortCustom) ? sortCustom.exclude : []);
  }, [listItems.length]);

  const onCheckboxClick = id => {
    let updatedInclude;
    let updatedExclude;

    if (!exclude?.includes(id)) {
      updatedInclude = include.filter(itemId => itemId !== id);
      updatedExclude = [...exclude, id];
    } else {
      updatedExclude = exclude.filter(itemId => itemId !== id);
      updatedInclude = [...include, id];
    }

    setInclude(updatedInclude);
    setExclude(updatedExclude);
    const newInclude = items.filter(item => !updatedExclude?.includes(item.id)).map(i => i.id);

    onChange({
      include: newInclude,
      exclude: updatedExclude,
      expand,
    });
  };

  const setOpen = (e, id) => {
    let newExpanded;

    if (expand?.includes(id)) {
      newExpanded = expand.filter(expandedId => expandedId !== id); // remove
    } else {
      newExpanded = [...expand, id]; // add
    }

    setExpand(newExpanded);

    onChange({
      expand: newExpanded,
      include,
      exclude,
    });
  };

  const handleDragEnd = result => {
    if (!result.destination) return;

    const reordered = reorder(items, result.source.index, result.destination.index);
    let updatedList = reordered;

    setItems(reordered);

    if (wobjType === OBJECT_TYPE.LIST) {
      updatedList = filterItems(reordered);
    }

    const newInclude = updatedList.filter(item => !exclude?.includes(item.id)).map(i => i.id);

    setInclude(newInclude);

    onChange({
      include: newInclude,
      expand,
      exclude,
    });
  };

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
                      exclude={exclude}
                      onCheckboxClick={onCheckboxClick}
                      expandedIds={expand}
                      setOpen={setOpen}
                      item={item}
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
  sortCustom: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func,
  wobjType: PropTypes.string,
  screenSize: PropTypes.string,
  customSort: PropTypes.shape({
    include: PropTypes.arrayOf(PropTypes.string),
    exclude: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default DnDList;
