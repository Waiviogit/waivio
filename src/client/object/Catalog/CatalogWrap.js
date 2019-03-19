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
import { getObject, getObjectsByIds } from '../../../../src/waivioApi/ApiClient';
import * as wobjectActions from '../../../client/object/wobjectsActions';
import { getLocale } from '../../reducers';
import './CatalogWrap.less';

const getListSorting = wobj => {
  const type = wobj[objectFields.sorting] && wobj[objectFields.sorting].length ? 'custom' : 'rank';
  const order = type === 'custom' ? wobj[objectFields.sorting] : null;
  return { type, order };
};

@withRouter
@injectIntl
@connect(
  state => ({
    locale: getLocale(state),
  }),
  {
    addItemToWobjStore: wobjectActions.addListItem,
  },
)
class CatalogWrap extends React.Component {
  static propTypes = {
    wobject: PropTypes.shape(),
    locale: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    isEditMode: PropTypes.bool.isRequired,
    addItemToWobjStore: PropTypes.func.isRequired,
  };
  static defaultProps = {
    wobject: {},
    locale: 'en-US',
  };

  constructor(props) {
    super(props);
    this.state = this.getNextStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    const newPath = nextProps.location.hash.slice(1);
    const currPath = this.props.location.hash.slice(1);
    const isReloadingPage = nextProps.match.params.name !== this.props.match.params.name;
    if (!isReloadingPage && newPath !== currPath) {
      const nextListPermlink = newPath.split('/').pop() || 'list';
      const currListPermlink = currPath.split('/').pop();
      if (nextListPermlink === 'list') {
        this.setState(this.getNextStateFromProps(nextProps));
      } else if (nextListPermlink !== currListPermlink) {
        this.getObjectFromApi(nextListPermlink, nextProps.location.hash);
      }
    }
    if (!isEqual(this.props.wobject, nextProps.wobject)) {
      this.setState(this.getNextStateFromProps(nextProps));
    }
  }

  getObjectFromApi = (permlink, path) => {
    getObject(permlink).then(res => {
      const listItems =
        (res && res.listItems && res.listItems.map(item => getClientWObj(item))) || [];
      this.setState(prevState => {
        let breadcrumb = [];
        if (prevState.breadcrumb.some(crumb => crumb.path.includes(permlink))) {
          forEach(prevState.breadcrumb, crumb => {
            breadcrumb.push(crumb);
            return !crumb.path.includes(permlink);
          });
        } else {
          breadcrumb = [
            ...prevState.breadcrumb,
            {
              id: res.author_permlink,
              name: getFieldWithMaxWeight(res, objectFields.name),
              path,
            },
          ];
        }
        const sorting = getListSorting(res);
        return {
          sort: sorting.type,
          wobjNested: res,
          listItems: sortListItemsBy(listItems, sorting.type, sorting.order),
          breadcrumb,
        };
      });
    });
  };

  getNextStateFromProps = ({ wobject, location }) => {
    let sorting = {};
    let listItems = [];
    let breadcrumb = [];
    if (wobject && wobject.listItems) {
      sorting = getListSorting(wobject);
      breadcrumb = [
        {
          id: wobject.author_permlink,
          name: getFieldWithMaxWeight(wobject, objectFields.name),
          path: '',
        },
      ];
      if (location.hash) {
        // restore breadcrumbs from url hash
        const permlinks = location.hash.slice(1).split('/');
        const locale = this.props.locale === 'auto' ? 'en-US' : this.props.locale;
        getObjectsByIds({ authorPermlinks: permlinks, locale })
          .then(res =>
            permlinks.map(permlink =>
              getClientWObj(res.find(wobj => wobj.author_permlink === permlink)),
            ),
          )
          .then(res => {
            const crumbs = res.map(obj => ({
              id: obj.id,
              name: obj.name,
              path: `${location.hash.split(obj.id)[0]}${obj.id}`,
            }));
            this.setState({ breadcrumb: [...breadcrumb, ...crumbs] });
          });
        this.getObjectFromApi(permlinks[permlinks.length - 1], location.hash);
      } else {
        listItems = sortListItemsBy(
          wobject.listItems.map(item => getClientWObj(item)),
          sorting.type,
          sorting.order,
        );
      }
    }
    return { sort: sorting.type, listItems, breadcrumb, wobjNested: null };
  };

  handleAddItem = listItem => {
    const { breadcrumb, listItems, sort } = this.state;
    const { wobject } = this.props;
    this.setState({
      listItems: sortListItemsBy(
        [...listItems, listItem],
        sort,
        sort === 'custom' ? wobject[objectFields.sorting] : null,
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
    const { isEditMode, wobject, intl, location } = this.props;
    const currentList = wobjNested || wobject;
    const itemsIdsToOmit = uniq([
      ...listItems.map(item => item.id),
      ...breadcrumb.map(crumb => crumb.id),
    ]);

    const sortSelector =
      currentList &&
      currentList[objectFields.sorting] &&
      currentList[objectFields.sorting].length ? (
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
            {map(breadcrumb, (crumb, index, crumbsArr) => (
              <Breadcrumb.Item key={`crumb-${crumb.name}`}>
                {index && index === crumbsArr.length - 1 ? (
                  <React.Fragment>
                    <span className="CatalogWrap__breadcrumb__link">{crumb.name}</span>
                    <Link
                      className="CatalogWrap__breadcrumb__obj-page-link"
                      to={{ pathname: `/object/${crumb.id}/list` }}
                    >
                      <i className="iconfont icon-send PostModal__icon" />
                    </Link>
                  </React.Fragment>
                ) : (
                  <Link
                    className="CatalogWrap__breadcrumb__link"
                    to={{ pathname: location.pathname, hash: crumb.path }}
                    title={`${intl.formatMessage({ id: 'GoTo', defaultMessage: 'Go to' })} ${
                      crumb.name
                    }`}
                  >
                    {crumb.name}
                  </Link>
                )}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>

        {isEditMode && (
          <div className="CatalogWrap__add-item">
            <AddItemModal
              wobject={currentList}
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
                      ? {
                          pathname: `${location.pathname}`,
                          hash: `${
                            !location.hash
                              ? listItem.id
                              : `${
                                  location.hash.includes(listItem.id)
                                    ? `${location.hash.split(listItem.id)[0]}${listItem.id}`
                                    : `${location.hash}/${listItem.id}`
                                }`
                          }`,
                        }
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
