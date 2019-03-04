import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'none',
  width: '100%',
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'none',
  border: `2px solid ${isDragging ? 'orange' : 'white'}`,
  ...draggableStyle,
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class CustomSort extends Component {
  static propTypes = {
    listItems: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      items: props.listItems,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(this.state.items, result.source.index, result.destination.index);

    this.setState({
      items,
    });

    this.props.onChange(items.map(item => item.id));
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(druggableProvided, druggableSnapshot) => (
                    <div
                      ref={druggableProvided.innerRef}
                      {...druggableProvided.draggableProps}
                      {...druggableProvided.dragHandleProps}
                      style={getItemStyle(
                        druggableSnapshot.isDragging,
                        druggableProvided.draggableProps.style,
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

export default CustomSort;
