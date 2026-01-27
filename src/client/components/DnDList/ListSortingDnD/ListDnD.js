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
      mode: 'Custom',
      isDisabled: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { listItems, customSort } = this.props;

    if (!isEqual(prevProps.listItems, listItems) || !isEqual(prevProps.customSort, customSort)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ items: listItems });
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
          sortedLists = lists.sort((a, b) => (b.weight || 0) - (a.weight || 0));
          sortedNonLists = nonLists.sort((a, b) => (b.weight || 0) - (a.weight || 0));
          break;
        case 'by-name-asc':
          sortedLists = lists.sort((a, b) => {
            const nameA = (a.name || a.default_name || '').toString();
            const nameB = (b.name || b.default_name || '').toString();

            return nameA.localeCompare(nameB);
          });
          sortedNonLists = nonLists.sort((a, b) => {
            const nameA = (a.name || a.default_name || '').toString();
            const nameB = (b.name || b.default_name || '').toString();

            return nameA.localeCompare(nameB);
          });
          break;
        case 'by-name-desc':
          sortedLists = lists.sort((a, b) => {
            const nameA = (a.name || a.default_name || '').toString();
            const nameB = (b.name || b.default_name || '').toString();

            return nameB.localeCompare(nameA);
          });
          sortedNonLists = nonLists.sort((a, b) => {
            const nameA = (a.name || a.default_name || '').toString();
            const nameB = (b.name || b.default_name || '').toString();

            return nameB.localeCompare(nameA);
          });
          break;
        default:
          sortedLists = lists;
          sortedNonLists = nonLists;
      }

      return [...sortedLists, ...sortedNonLists];
    }

    switch (sortType) {
      case 'recency':
        return sortedItems.sort((a, b) => new Date(a.addedAt || 0) - new Date(b.addedAt || 0));
      case 'reverse_recency':
        return sortedItems.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
      default:
        return sortedItems;
    }
  };

  handleSortChange = (sortType = 'recency') => {
    const { items } = this.state;
    const { customSort, onChange } = this.props;

    const sortedItems = this.sortItems(items, sortType);

    this.setState({
      items: sortedItems,
      sort: sortType,
    });

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

  handleModeChange = mode => {
    const { listItems, customSort } = this.props;

    if (mode === 'Auto') {
      const excludedIds = customSort?.exclude || [];
      const allEnabled = listItems.map(i => ({
        ...i,
        checkedItemInList: !excludedIds.includes(i.id),
      }));

      this.setState(
        {
          mode,
          items: this.sortItems(allEnabled, 'recency'),
          sort: 'recency',
          isDisabled: true,
        },
        () => {
          this.handleSortChange('recency');
        },
      );
    } else {
      this.setState({
        mode,
        items: listItems,
        isDisabled: false,
      });
    }
  };

  onDragEnd(result) {
    const { isDisabled } = this.state;

    if (isDisabled || !result.destination) return;

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
    const { items, sort } = this.state;

    const itemsList = items.map(item => ({
      ...item,
      checkedItemInList: item.id === e.target.id ? e.target.checked : item.checkedItemInList,
    }));

    this.setState({ items: itemsList });
    this.props.onChange({
      exclude: itemsList.filter(i => !i.checkedItemInList).map(item => item.id),
      include:
        sort === 'custom' ? itemsList.filter(i => i.checkedItemInList).map(item => item.id) : [],
      sortType: sort,
    });
  };

  render() {
    const { mode, items, isDisabled } = this.state;

    return (
      <div className="dnd-list-container">
        <div className={classNames('ant-form-item-label AppendForm__appendTitles', {})}>Mode</div>
        <Select placeholder="Select sorting mode" value={mode} onSelect={this.handleModeChange}>
          {['Custom', 'Auto'].map(type => (
            <Select.Option key={type}>{type}</Select.Option>
          ))}
        </Select>

        {mode === 'Auto' && (
          <>
            <div className={classNames('ant-form-item-label AppendForm__appendTitles', {})}>
              Sort by
            </div>
            <Select
              onChange={this.handleSortChange}
              value={this.state.sort || 'recency'}
              placeholder="Select sorting"
            >
              <Select.Option key="reverse_recency">
                <FormattedMessage id="newest_first" defaultMessage="Newest first" />
              </Select.Option>
              <Select.Option key="recency">
                <FormattedMessage id="oldest_first" defaultMessage="Oldest first" />
              </Select.Option>
              <Select.Option key="rank">
                <FormattedMessage id="rank" defaultMessage="Rank" />
              </Select.Option>
              <Select.Option key="by-name-asc">
                <FormattedMessage id="by-name-asc" defaultMessage="A..Z" />
              </Select.Option>
              <Select.Option key="by-name-desc">
                <FormattedMessage id="by-name-desc" defaultMessage="Z..A" />
              </Select.Option>
            </Select>
          </>
        )}

        <br />

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" isDropDisabled={isDisabled}>
            {(provided, snapshot) => (
              <div className="dnd-list" ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={isDisabled}
                  >
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
                          isDisabled={isDisabled}
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
