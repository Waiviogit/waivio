import { Breadcrumb, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { get, has, isEmpty, isEqual, map, forEach, uniq } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  getFieldWithMaxWeight,
  getListItems,
  getListItemLink,
  sortListItemsBy,
} from '../wObjectHelper';
import { getClientWObj, getServerWObj } from '../../adapters';
import { objectFields } from '../../../common/constants/listOfFields';
import OBJ_TYPE from '../const/objectTypes';
import AddItemModal from './AddItemModal/AddItemModal';
import SortSelector from '../../components/SortSelector/SortSelector';
import { getObject, getObjectsByIds } from '../../../../src/waivioApi/ApiClient';
import * as wobjectActions from '../../../client/object/wobjectsActions';
import {
  getSuitableLanguage,
  getAuthenticatedUserName,
  getPendingUpdate,
  getIsLoaded,
  getFilteredObjectsMap,
} from '../../reducers';
import ObjectCardView from '../../objectCard/ObjectCardView';
import CategoryItemView from './CategoryItemView/CategoryItemView';
import { hasType } from '../../helpers/wObjectHelper';
import BodyContainer from '../../containers/Story/BodyContainer';
import Loading from '../../components/Icon/Loading';
import * as apiConfig from '../../../waivioApi/config.json';
import {
  assignProposition,
  declineProposition,
  pendingUpdateSuccess,
} from '../../user/userActions';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { preparePropositionReqData } from '../../rewards/rewardsHelper';
import Proposition from '../../rewards/Proposition/Proposition';
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
    locale: getSuitableLanguage(state),
    loaded: getIsLoaded(state),
    username: getAuthenticatedUserName(state),
    wobjects: getFilteredObjectsMap(state),
    pendingUpdate: getPendingUpdate(state),
  }),
  {
    addItemToWobjStore: wobjectActions.addListItem,
    assignProposition,
    declineProposition,
    pendingUpdateSuccess,
  },
)
class CatalogWrap extends React.Component {
  static propTypes = {
    /* from decorators */
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    /* from connect */
    locale: PropTypes.string,
    addItemToWobjStore: PropTypes.func.isRequired,
    /* passed props */
    wobject: PropTypes.shape(),
    history: PropTypes.shape().isRequired,
    isEditMode: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    assignProposition: PropTypes.func.isRequired,
    declineProposition: PropTypes.func.isRequired,
  };
  static defaultProps = {
    wobject: {},
    locale: 'en-US',
  };

  constructor(props) {
    super(props);
    this.state = this.getNextStateFromProps(props, true);
  }

  state = {
    loadingAssignDiscard: false,
    propositions: [],
    sort: 'reward',
    isAssign: false,
    loadingPropositions: false,
  };

  componentDidMount() {
    const { username, match } = this.props;
    const { sort } = this.state;
    const requiredObject = match.params.name;
    this.getPropositions({ username, match, requiredObject, sort });
  }

  componentWillReceiveProps(nextProps) {
    const newPath = nextProps.location.hash.slice(1);
    const currPath = this.props.location.hash.slice(1);
    const isReloadingPage = nextProps.match.params.name !== this.props.match.params.name;
    if (!isReloadingPage && newPath !== currPath) {
      const nextListPermlink = newPath.split('/').pop() || 'list';
      const currListPermlink = currPath.split('/').pop();
      const isTopLevelList = newPath.split('/').length === 1;
      if (nextListPermlink === 'list' || isTopLevelList) {
        this.setState(this.getNextStateFromProps(nextProps));
      } else if (nextListPermlink !== currListPermlink) {
        this.getObjectFromApi(nextListPermlink, nextProps.location.hash);
      }
    }
    if (!isEqual(this.props.wobject.author_permlink, nextProps.wobject.author_permlink)) {
      this.setState(this.getNextStateFromProps(nextProps));
    }
  }

  getObjectFromApi = (permlink, path) => {
    this.setState({ loading: true });
    getObject(permlink)
      .then(res => {
        const listItems =
          (res &&
            res.listItems &&
            res.listItems.map(item => getClientWObj(item, this.props.locale))) ||
          [];
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
            wobjNested: getClientWObj(res, this.props.locale),
            listItems: sortListItemsBy(listItems, sorting.type, sorting.order),
            breadcrumb,
            loading: false,
          };
        });
      })
      .catch(() => this.setState({ loading: false }));
  };

  getNextStateFromProps = ({ wobject, location }, isInitialState = false) => {
    let sorting = {};
    let sortedItems = [];
    const breadcrumb = [];
    const items = getListItems(wobject);
    if (items && items.length) {
      sorting = getListSorting(wobject);
      if (wobject.object_type === OBJ_TYPE.LIST) {
        breadcrumb.push({
          id: wobject.author_permlink,
          name: getFieldWithMaxWeight(wobject, objectFields.name),
          path: '',
        });
      }
      if (location.hash) {
        if (!isInitialState) this.setState({ loading: true });
        // restore breadcrumbs from url hash
        const permlinks = location.hash.slice(1).split('/');
        const { locale } = this.props;
        getObjectsByIds({ authorPermlinks: permlinks, locale })
          .then(res =>
            permlinks.map(permlink =>
              getClientWObj(
                res.wobjects.find(wobj => wobj.author_permlink === permlink),
                locale,
              ),
            ),
          )
          .then(res => {
            const crumbs = res.map(obj => ({
              id: obj.id,
              name: obj.name,
              path: `${location.hash.split(obj.id)[0]}${obj.id}`,
            }));
            if (!isInitialState) this.setState({ breadcrumb: [...breadcrumb, ...crumbs] });
            this.getObjectFromApi(permlinks[permlinks.length - 1], location.hash);
          });
      } else {
        sortedItems = sortListItemsBy(
          items.map(item => getClientWObj(item, this.props.locale)),
          sorting.type,
          sorting.order,
        );
      }
    }
    return { sort: sorting.type, listItems: sortedItems, breadcrumb, wobjNested: null };
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
    if (wobject.object_type === OBJ_TYPE.LIST && breadcrumb.length === 1) {
      this.props.addItemToWobjStore(getServerWObj(listItem));
    }
  };

  handleSortChange = sort => {
    const sortOrder = this.props.wobject && this.props.wobject[objectFields.sorting];
    const listItems = sortListItemsBy(this.state.listItems, sort, sortOrder);
    this.setState({ sort, listItems });
  };

  getPropositions = ({ username, match, requiredObject, sort }) => {
    this.setState({ loadingPropositions: true });
    ApiClient.getPropositions(
      preparePropositionReqData({
        username,
        match,
        requiredObject,
        sort,
      }),
    ).then(data => {
      this.setState({
        propositions: data.campaigns,
        hasMore: data.hasMore,
        sponsors: data.sponsors,
        sort,
        loadingCampaigns: false,
        loadingPropositions: false,
      });
    });
  };

  renderProposition = propositions =>
    map(propositions, proposition =>
      map(
        proposition.objects,
        wobj =>
          wobj.object &&
          wobj.object.author_permlink && (
            <Proposition
              proposition={proposition}
              wobj={wobj.object}
              assignCommentPermlink={wobj.permlink}
              assignProposition={this.assignPropositionHandler}
              discardProposition={this.discardProposition}
              authorizedUserName={this.props.username}
              loading={this.state.loadingAssignDiscard}
              key={`${wobj.object.author_permlink}`}
              assigned={wobj.assigned}
              history={this.props.history}
              isAssign={this.state.isAssign}
            />
          ),
      ),
    );

  getListRow = (listItem, campaignObjects) => {
    const { propositions } = this.state;
    const linkTo = getListItemLink(listItem, this.props.location);
    const isList = listItem.type === OBJ_TYPE.LIST;
    let item;
    if (isList) {
      item = <CategoryItemView wObject={listItem} pathNameAvatar={linkTo} />;
    } else if (campaignObjects.includes(listItem.id)) {
      item = this.renderProposition(propositions);
    } else {
      item = <ObjectCardView wObject={listItem} options={{ pathNameAvatar: linkTo }} />;
    }
    return <div key={`category-${listItem.id}`}>{item}</div>;
  };

  getMenuList = () => {
    const { listItems, breadcrumb, propositions } = this.state;
    const actualListItems = listItems && listItems.filter(list => list.status);

    if (isEmpty(actualListItems) && !isEmpty(breadcrumb)) {
      return (
        <div>
          {this.props.intl.formatMessage({
            id: 'emptyList',
            defaultMessage: 'This list is empty',
          })}
        </div>
      );
    }
    const campaignObjects = map(propositions, item =>
      get(item, 'objects[0].object.author_permlink'),
    );

    return map(actualListItems, listItem => this.getListRow(listItem, campaignObjects));
  };

  // Propositions
  assignPropositionHandler = ({
    companyAuthor,
    companyPermlink,
    resPermlink,
    objPermlink,
    companyId,
    proposition,
    proposedWobj,
  }) => {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    this.setState({ loadingAssignDiscard: true });
    return this.props
      .assignProposition({
        companyAuthor,
        companyPermlink,
        objPermlink,
        resPermlink,
        appName,
        proposition,
        proposedWobj,
      })
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'assigned_successfully_update',
            defaultMessage: 'Assigned successfully. Your new reservation will be available soon.',
          }),
        );
        // eslint-disable-next-line no-unreachable
        const updatedPropositions = this.updateProposition(
          companyId,
          true,
          objPermlink,
          companyAuthor,
        );
        this.setState({
          propositions: updatedPropositions,
          loadingAssignDiscard: false,
          isAssign: true,
        });
        return { isAssign: true };
      })
      .catch(e => {
        this.setState({ loadingAssignDiscard: false, isAssign: false });
        throw e;
      });
  };

  updateProposition = (propsId, isAssign, objPermlink, companyAuthor) =>
    this.state.propositions.map(proposition => {
      // eslint-disable-next-line no-underscore-dangle
      if (proposition._id === propsId) {
        proposition.objects.forEach((object, index) => {
          if (object.object.author_permlink === objPermlink) {
            // eslint-disable-next-line no-param-reassign
            proposition.objects[index].assigned = isAssign;
          } else {
            // eslint-disable-next-line no-param-reassign
            proposition.objects[index].assigned = null;
          }
        });
      }
      // eslint-disable-next-line no-underscore-dangle
      if (proposition.guide.name === companyAuthor && proposition._id !== propsId) {
        // eslint-disable-next-line no-param-reassign
        proposition.isReservedSiblingObj = true;
      }
      return proposition;
    });

  discardProposition = ({
    companyAuthor,
    companyPermlink,
    companyId,
    objPermlink,
    unreservationPermlink,
    reservationPermlink,
  }) => {
    this.setState({ loadingAssignDiscard: true });
    return this.props
      .declineProposition({
        companyAuthor,
        companyPermlink,
        companyId,
        objPermlink,
        unreservationPermlink,
        reservationPermlink,
      })
      .then(() => {
        const updatedPropositions = this.updateProposition(companyId, false, objPermlink);
        this.setState({
          propositions: updatedPropositions,
          loadingAssignDiscard: false,
          isAssign: false,
        });
        return { isAssign: false };
      })
      .catch(e => {
        console.log(e.toString());
        message.error(e.error_description);
        this.setState({ loadingAssignDiscard: false, isAssign: true });
      });
  };
  // END Propositions

  render() {
    const { sort, wobjNested, listItems, breadcrumb, loading, loadingPropositions } = this.state;
    const { isEditMode, wobject, intl, location } = this.props;
    const currWobject = wobjNested || wobject;
    const itemsIdsToOmit = uniq([
      ...listItems.map(item => item.id),
      ...breadcrumb.map(crumb => crumb.id),
    ]);
    const isListObject =
      hasType(currWobject, OBJ_TYPE.LIST) || (!wobjNested && has(wobject, 'menuItems'));

    const sortSelector =
      currWobject &&
      currWobject[objectFields.sorting] &&
      currWobject[objectFields.sorting].length ? (
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
                {(index || !hasType(wobject, OBJ_TYPE.LIST)) && index === crumbsArr.length - 1 ? (
                  <React.Fragment>
                    <span className="CatalogWrap__breadcrumb__link">{crumb.name}</span>
                    <Link
                      className="CatalogWrap__breadcrumb__obj-page-link"
                      to={{ pathname: `/object/${crumb.id}` }}
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
          {get(wobjNested, [objectFields.title], undefined) ? (
            <div className="fw5 pt3">{wobjNested.title}</div>
          ) : null}
        </div>

        {isEditMode && (
          <div className="CatalogWrap__add-item">
            <AddItemModal
              wobject={currWobject}
              itemsIdsToOmit={itemsIdsToOmit}
              onAddItem={this.handleAddItem}
            />
          </div>
        )}

        {(isListObject && loading) || loadingPropositions ? (
          <Loading />
        ) : (
          <React.Fragment>
            <div className="CatalogWrap__sort">{sortSelector}</div>
            <div className="CatalogWrap">
              <div>{this.getMenuList()}</div>
            </div>
          </React.Fragment>
        )}
        {hasType(currWobject, OBJ_TYPE.PAGE) && !isEmpty(wobjNested) && (
          <BodyContainer full body={getFieldWithMaxWeight(currWobject, objectFields.pageContent)} />
        )}
      </div>
    );
  }
}

export default CatalogWrap;
