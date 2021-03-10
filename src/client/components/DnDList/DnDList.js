import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import OBJECT_TYPE from '../../object/const/objectTypes';
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

class DnDList extends Component {
  static propTypes = {
    listItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        itemInList: PropTypes.bool,
        content: PropTypes.node,
      }),
    ).isRequired,
    accentColor: PropTypes.string,
    onChange: PropTypes.func,
    wobjType: PropTypes.string,
  };
  static defaultProps = {
    accentColor: 'lightgreen',
    onChange: () => {},
    wobjType: '',
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
    if (prevProps.listItems !== listItems) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ items: listItems });
    }
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(this.state.items, result.source.index, result.destination.index);
    this.setState({
      items,
    });
    let itemsList = items;
    if (this.props.wobjType === OBJECT_TYPE.LIST) {
      itemsList = items.filter(item => item.itemInList);
    }
    this.props.onChange(itemsList.map(item => item.id));
  }

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
                      {item.content}
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

export default DnDList;
