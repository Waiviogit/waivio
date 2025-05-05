import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { isEqual } from 'lodash';
import OBJECT_TYPE from '../../../object/const/objectTypes';
import '../DnDList.less';
import ListDnDItem from './ListDnDItem';

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

class ListDnD extends Component {
  static propTypes = {
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
    onChange: PropTypes.func,
    wobjType: PropTypes.string,
    screenSize: PropTypes.string,
    customSort: PropTypes.shape({
      include: PropTypes.arrayOf(PropTypes.string),
      exclude: PropTypes.arrayOf(PropTypes.string),
    }),
  };
  static defaultProps = {
    accentColor: 'lightgreen',
    onChange: () => {},
    wobjType: '',
    screenSize: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      items: props.listItems,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { listItems } = this.props;

    if (!isEqual(prevProps.listItems, listItems)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        items: listItems,
      });
    }
  }

  filterItems = items => items.filter(item => item.checkedItemInList);

  onDragEnd(result) {
    if (!result.destination) return;

    const items = reorder(this.state.items, result.source.index, result.destination.index);
    let itemsList = items;

    this.setState({ items });

    if (this.props.wobjType === OBJECT_TYPE.LIST) itemsList = this.filterItems(items);

    this.props.onChange({
      include: itemsList.map(item => item.id),
      exclude:
        this.props.wobjType === OBJECT_TYPE.LIST
          ? items.filter(i => !i.checkedItemInList).map(item => item.id)
          : [],
    });
  }

  toggleItemInSortingList = e => {
    const { items } = this.state;
    const itemsList = items.map(item => ({
      ...item,
      checkedItemInList: item.id === e.target.id ? e.target.checked : item.checkedItemInList,
    }));

    this.setState({ items: itemsList });
    this.props.onChange({
      exclude: itemsList.filter(i => !i.checkedItemInList).map(item => item.id),
      include: itemsList.filter(i => i.checkedItemInList).map(item => item.id),
    });
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div className="dnd-list" ref={provided.innerRef}>
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(druggableProvided, druggableSnapshot) => (
                    <div
                      className="dnd-list__item"
                      ref={druggableProvided.innerRef}
                      {...druggableProvided.draggableProps}
                      {...druggableProvided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDraggingOver,
                        druggableSnapshot.isDragging,
                        druggableProvided.draggableProps.style,
                        this.props.accentColor,
                      )}
                    >
                      <ListDnDItem
                        item={item}
                        toggleItemInSortingList={this.toggleItemInSortingList}
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
  }
}

export default ListDnD;
