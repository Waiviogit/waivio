import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import OBJECT_TYPE from '../../../object/const/objectTypes';
import SortSelector from '../../SortSelector/SortSelector';
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
      sort: 'custom',
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
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

  sortItems = (items, sortType) => {
    const sortedItems = [...items];

    switch (sortType) {
      case 'recency':
        return sortedItems.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);

          return dateA - dateB;
        });
      case 'reverse_recency':
        return sortedItems.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);

          return dateB - dateA;
        });
      case 'rank':
        return sortedItems.sort((a, b) => {
          const rankA = a.weight || 0;
          const rankB = b.weight || 0;

          return rankB - rankA;
        });
      case 'by-name-asc':
        return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
      case 'by-name-desc':
        return sortedItems.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sortedItems;
    }
  };

  handleSortChange = sortType => {
    const { items } = this.state;
    const sortedItems = this.sortItems(items, sortType);

    this.setState({
      items: sortedItems,
      sort: sortType,
    });

    const { onChange, wobjType } = this.props;
    let itemsList = sortedItems;

    if (wobjType === OBJECT_TYPE.LIST) {
      itemsList = this.filterItems(sortedItems);
    }

    onChange({
      include: itemsList.map(item => item.id),
      exclude:
        wobjType === OBJECT_TYPE.LIST
          ? sortedItems.filter(i => !i.checkedItemInList).map(item => item.id)
          : [],
    });
  };

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
    const { sort } = this.state;

    return (
      <div className="dnd-list-container">
        <div className="dnd-list-header">
          <SortSelector sort={sort} onChange={this.handleSortChange}>
            <SortSelector.Item key="recency">
              <FormattedMessage id="recency" defaultMessage="Recency" />
            </SortSelector.Item>
            <SortSelector.Item key="rank">
              <FormattedMessage id="rank" defaultMessage="Rank" />
            </SortSelector.Item>
            <SortSelector.Item key="by-name-asc">
              <FormattedMessage id="by-name-asc" defaultMessage="A..Z">
                {msg => msg.toUpperCase()}
              </FormattedMessage>
            </SortSelector.Item>
            <SortSelector.Item key="by-name-desc">
              <FormattedMessage id="by-name-desc" defaultMessage="Z..A">
                {msg => msg.toUpperCase()}
              </FormattedMessage>
            </SortSelector.Item>
            <SortSelector.Item key="reverse_recency">
              <FormattedMessage id="reverse_recency" defaultMessage="Reverse recency" />
            </SortSelector.Item>
          </SortSelector>
        </div>
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
      </div>
    );
  }
}

export default ListDnD;
