import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, isEqual, map, forEach, uniq } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import CatalogItem from './CatalogItem';
import { getFieldWithMaxWeight, sortListItemsBy } from '../wObjectHelper';
import { getClientWObj, getServerWObj } from '../../adapters';
import { objectFields } from '../../../common/constants/listOfFields';
import AddItemModal from './AddItemModal/AddItemModal';
import SortSelector from '../../components/SortSelector/SortSelector';
import { getObject } from '../../../../src/waivioApi/ApiClient';
import * as wobjectActions from '../../../client/object/wobjectsActions';
import './CatalogWrap.less';

@withRouter
@injectIntl
@connect(
  null,
  {
    addItemToWobjStore: wobjectActions.addListItem,
  },
)
class CatalogWrap extends React.Component {
  static propTypes = {
    wobject: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    isEditMode: PropTypes.bool.isRequired,
    addItemToWobjStore: PropTypes.func.isRequired,
  };
  static defaultProps = {
    wobject: {},
  };

  constructor(props) {
    super(props);
    this.state = this.getNextStateFromProps(props);
  }

  componentDidMount() {
    const { match, history } = this.props;
    if (this.props.match.params.itemId) {
      history.push(`/object/${match.params.name}/list`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.match, this.props.match)) {
      const nextTarget = nextProps.match.url.split('/').pop();
      if (nextTarget === 'list') {
        this.setState(this.getNextStateFromProps(nextProps));
      } else if (nextTarget !== this.props.match.params.itemId) {
        getObject(nextTarget).then(res => {
          const listItems =
            (res && res.listItems && res.listItems.map(item => getClientWObj(item))) || [];
          this.setState(prevState => {
            let breadcrumb = [];
            if (prevState.breadcrumb.some(crumb => crumb.link.includes(nextTarget))) {
              forEach(prevState.breadcrumb, crumb => {
                breadcrumb.push(crumb);
                return !crumb.link.includes(nextTarget);
              });
            } else {
              breadcrumb = [
                ...prevState.breadcrumb,
                {
                  id: res.author_permlink,
                  name: getFieldWithMaxWeight(res, objectFields.name),
                  link: nextProps.match.url,
                },
              ];
            }
            return {
              wobjNested: res,
              listItems: sortListItemsBy(listItems, this.state.sort),
              breadcrumb,
            };
          });
        });
      }
    }
    if (!isEqual(this.props.wobject, nextProps.wobject)) {
      this.setState(this.getNextStateFromProps(nextProps));
    }
  }

  getNextStateFromProps = ({ wobject, match }) => {
    let state = { listItems: [], wobjNested: null, breadcrumb: [] };
    if (!isEmpty(wobject)) {
      let nextSort;
      if (this.state && this.state.sort) {
        nextSort = this.state.sort;
      } else {
        nextSort =
          wobject[objectFields.sorting] && wobject[objectFields.sorting].length ? 'custom' : 'rank';
      }
      const customSortOrder = nextSort === 'custom' ? wobject[objectFields.sorting] : null;
      const listItems =
        wobject.listItems &&
        sortListItemsBy(
          wobject.listItems.map(item => getClientWObj(item)),
          nextSort,
          customSortOrder,
        );
      state = {
        sort: nextSort,
        listItems,
        wobjNested: null,
        breadcrumb: [
          {
            id: wobject.author_permlink,
            name: getFieldWithMaxWeight(wobject, objectFields.name),
            link: match.url,
          },
        ],
      };
    }
    return state;
  };

  handleAddItem = listItem => {
    const { breadcrumb, listItems } = this.state;
    this.setState({
      listItems: sortListItemsBy(
        [...listItems, listItem],
        this.state.sort,
        this.state.sort === 'custom' ? this.props.wobject[objectFields.sorting] : null,
      ),
    });
    if (breadcrumb.length === 1) {
      this.props.addItemToWobjStore(getServerWObj(listItem));
    }
  };

  handleSortChange = sort => {
    const sortOrder = this.props.wobject && this.props.wobject[objectFields.sorting];
    const listItems = sortListItemsBy(this.state.listItems, sort, sortOrder);
    this.setState({ sort, listItems });
  };

  render() {
    const { sort, wobjNested, listItems, breadcrumb } = this.state;
    const { isEditMode, wobject, intl, match } = this.props;
    const listBaseUrl = `/object/${match.params.name}/list`;
    const itemsIdsToOmit = uniq([
      ...listItems.map(item => item.id),
      ...breadcrumb.map(crumb => crumb.id),
    ]);

    const sortSelector =
      wobject && wobject[objectFields.sorting] && wobject[objectFields.sorting].length ? (
        <SortSelector sort={sort} onChange={this.handleSortChange}>
          <SortSelector.Item key="custom">
            <FormattedMessage id="custom" defaultMessage="Custom" />
          </SortSelector.Item>
          <SortSelector.Item key="rank">
            <FormattedMessage id="rank" defaultMessage="Rank" />
          </SortSelector.Item>
          <SortSelector.Item key="by-name-asc">
            <FormattedMessage id="by-name-asc" defaultMessage="a . . z">
              {msg => msg.toUpperCase()}
            </FormattedMessage>
          </SortSelector.Item>
          <SortSelector.Item key="by-name-desc">
            <FormattedMessage id="by-name-desc" defaultMessage="z . . a">
              {msg => msg.toUpperCase()}
            </FormattedMessage>
          </SortSelector.Item>
        </SortSelector>
      ) : (
        <SortSelector sort={sort} onChange={this.handleSortChange}>
          <SortSelector.Item key="rank">
            <FormattedMessage id="rank" defaultMessage="Rank" />
          </SortSelector.Item>
          <SortSelector.Item key="by-name-asc">
            <FormattedMessage id="by-name-asc" defaultMessage="a . . z">
              {msg => msg.toUpperCase()}
            </FormattedMessage>
          </SortSelector.Item>
          <SortSelector.Item key="by-name-desc">
            <FormattedMessage id="by-name-desc" defaultMessage="z . . a">
              {msg => msg.toUpperCase()}
            </FormattedMessage>
          </SortSelector.Item>
        </SortSelector>
      );

    return (
      <div>
        <div className="CatalogWrap__breadcrumb">
          <Breadcrumb separator={'>'}>
            {map(breadcrumb, crumb => (
              <Breadcrumb.Item key={`crumb-${crumb.name}`}>
                <Link
                  className="CatalogWrap__breadcrumb__link"
                  to={{ pathname: crumb.link }}
                  title={`${intl.formatMessage({ id: 'GoTo', defaultMessage: 'Go to' })} ${
                    crumb.name
                  }`}
                >
                  {crumb.name}
                </Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>

        {isEditMode && (
          <div className="CatalogWrap__add-item">
            <AddItemModal
              wobject={wobjNested || wobject}
              itemsIdsToOmit={itemsIdsToOmit}
              onAddItem={this.handleAddItem}
            />
          </div>
        )}

        <div className="CatalogWrap__sort">{sortSelector}</div>

        <div className="CatalogWrap">
          {listItems.length ? (
            <div>
              {!isEmpty(listItems) ? (
                map(listItems, listItem => {
                  const linkTo =
                    listItem.type === 'list'
                      ? { pathname: `${listBaseUrl}/${listItem.id}` }
                      : { pathname: `/object/${listItem.id}` };
                  return (
                    <div key={`category-${listItem.id}`}>
                      <Link
                        to={linkTo}
                        title={`${intl.formatMessage({
                          id: 'GoTo',
                          defaultMessage: 'Go to',
                        })} ${listItem.name}`}
                      >
                        <CatalogItem wobject={listItem} />
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div>
                  {intl.formatMessage({
                    id: 'emptyList',
                    defaultMessage: 'This list is empty',
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {intl.formatMessage({ id: 'emptyList', defaultMessage: 'This list is empty' })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CatalogWrap;
