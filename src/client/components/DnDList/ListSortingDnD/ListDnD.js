import { Select } from 'antd';
import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { isList } from '../../../../common/helpers/wObjectHelper';
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
    mode: 'Custom',
  };

  constructor(props) {
    super(props);
    this.state = {
      items: props.listItems,
      sort: '',
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { listItems, customSort } = this.props;

    if (!isEqual(prevProps.listItems, listItems) || !isEqual(prevProps.customSort, customSort)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        items: listItems,
      });
    }
  }

  filterItems = items => items.filter(item => item.checkedItemInList);

  sortItems = (items, sortType) => {
    const sortedItems = [...items];

    if (['rank', 'by-name-asc', 'by-name-desc'].includes(sortType)) {
      const lists = sortedItems.filter(item => isList(item));
      const nonLists = sortedItems.filter(item => !isList(item));

      let sortedLists;
      let sortedNonLists;

      switch (sortType) {
        case 'rank':
          sortedLists = lists.sort((a, b) => {
            const rankA = a.weight || 0;
            const rankB = b.weight || 0;

            return rankB - rankA;
          });
          sortedNonLists = nonLists.sort((a, b) => {
            const rankA = a.weight || 0;
            const rankB = b.weight || 0;

            return rankB - rankA;
          });
          break;
        case 'by-name-asc':
          sortedLists = lists.sort((a, b) => a.name.localeCompare(b.name));
          sortedNonLists = nonLists.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'by-name-desc':
          sortedLists = lists.sort((a, b) => b.name.localeCompare(a.name));
          sortedNonLists = nonLists.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          sortedLists = lists;
          sortedNonLists = nonLists;
      }

      return [...sortedLists, ...sortedNonLists];
    }

    switch (sortType) {
      case 'recency':
        return sortedItems.sort((a, b) => {
          const dateA = new Date(a.addedAt || 0);
          const dateB = new Date(b.addedAt || 0);

          return dateA - dateB;
        });
      case 'reverse_recency':
        return sortedItems.sort((a, b) => {
          const dateA = new Date(a.addedAt || 0);
          const dateB = new Date(b.addedAt || 0);

          return dateB - dateA;
        });
      default:
        return sortedItems;
    }
  };

  handleSortChange = (sortType = 'recency') => {
    const { items } = this.state;
    const { customSort } = this.props;

    const sortedItems = this.sortItems(items, sortType);

    this.setState({
      items: sortedItems,
      sort: sortType,
    });

    const {
      onChange,
      // wobjType
    } = this.props;
    // const itemsList = sortedItems;

    // if (wobjType === OBJECT_TYPE.LIST) {
    //   itemsList = this.filterItems(sortedItems);
    // }

    const currentInclude = customSort?.include || [];
    const currentExclude = customSort?.exclude || [];
    const newInclude = sortedItems
      .filter(item => currentInclude.includes(item.id))
      .map(item => item.id);

    const newExclude = sortedItems
      .filter(item => currentExclude.includes(item.id))
      .map(item => item.id);

    onChange({
      include: sortType === 'custom' ? newInclude : [],
      exclude: newExclude,
      sortType,
    });
  };

  onDragEnd(result) {
    if (!result.destination) return;

    const items = reorder(this.state.items, result.source.index, result.destination.index);
    const { customSort } = this.props;

    this.setState({
      items,
      sort: 'custom',
    });

    const currentInclude = customSort?.include || [];
    const currentExclude = customSort?.exclude || [];

    const newInclude =
      currentInclude.length > 0
        ? items.filter(item => currentInclude.includes(item.id)).map(item => item.id)
        : items.map(item => item.id);

    const newExclude = items.filter(item => currentExclude.includes(item.id)).map(item => item.id);

    this.props.onChange({
      include: newInclude,
      exclude: newExclude,
      sortType: 'custom',
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
      include:
        this.state.sort === 'custom'
          ? itemsList.filter(i => i.checkedItemInList).map(item => item.id)
          : [],
      sortType: this.state.sort,
    });
  };

  render() {
    return (
      <div className="dnd-list-container">
        <div className={classNames('ant-form-item-label AppendForm__appendTitles', {})}>Mode</div>
        <Select
          placeholder={'Select sorting'}
          defaultValue={'Custom'}
          onSelect={mode => this.setState({ mode })}
        >
          {['Custom', 'Auto'].map(type => (
            <Select.Option key={type}>{type}</Select.Option>
          ))}
        </Select>
        {this.state.mode === 'Auto' && (
          <>
            <div className={classNames('ant-form-item-label AppendForm__appendTitles', {})}>
              Sort by
            </div>
            <Select
              onChange={this.handleSortChange}
              defaultValue={'recency'}
              placeholder={'Select sorting'}
            >
              <Select.Option key="recency">
                <FormattedMessage id="recency" defaultMessage="Recency" />
              </Select.Option>
              <Select.Option key="reverse_recency">
                <FormattedMessage id="reverse_recency" defaultMessage="Reverse recency" />
              </Select.Option>
              <Select.Option key="rank">
                <FormattedMessage id="rank" defaultMessage="Rank" />
              </Select.Option>
              <Select.Option key="by-name-asc">
                <FormattedMessage id="by-name-asc" defaultMessage="A..Z">
                  {msg => msg.toUpperCase()}
                </FormattedMessage>
              </Select.Option>
              <Select.Option key="by-name-desc">
                <FormattedMessage id="by-name-desc" defaultMessage="Z..A">
                  {msg => msg.toUpperCase()}
                </FormattedMessage>
              </Select.Option>
            </Select>
          </>
        )}
        <br />
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
