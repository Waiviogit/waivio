import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEmpty, get } from 'lodash';
import OBJECT_TYPE from '../const/objectTypes';
import {
  clearObjectFromStore,
  getNearbyObjects as getNearbyObjectsAction,
  getObject,
  getObjectFollowers as getObjectFollowersAction,
} from '../../../store/wObjectStore/wobjectsActions';
import {
  getAlbums,
  resetGallery,
  addAlbumToStore,
  clearRelatedPhoto,
} from '../../../store/galleryStore/galleryActions';
import { objectFields } from '../../../common/constants/listOfFields';
import { getObjectName, prepareAlbumData, prepareAlbumToStore } from '../../helpers/wObjectHelper';
import {
  setNestedWobject,
  setCatalogBreadCrumbs,
  getWobjectExpertise as getWobjectExpertiseAction,
  getRelatedWobjects,
} from '../../../store/wObjectStore/wobjActions';
import { appendObject } from '../../../store/appendStore/appendActions';
import Wobj from './Wobj';
import NotFound from '../../statics/NotFound';
import { getIsWaivio, getScreenSize, getWeightValue } from '../../../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getObject as getObjectState,
  getObjectFetchingState,
  getWobjectIsFailed,
  getWobjectIsFatching,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import { getConfiguration } from '../../../store/websiteStore/websiteSelectors';
import { getRate, getRewardFund } from '../../../store/appStore/appActions';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    loaded: getWobjectIsFatching(state),
    failed: getWobjectIsFailed(state),
    locale: getLocale(state),
    wobject: getObjectState(state),
    isFetching: getObjectFetchingState(state),
    screenSize: getScreenSize(state),
    isWaivio: getIsWaivio(state),
    supportedObjectTypes: get(getConfiguration(state), 'supported_object_types'),
    weightValue: getWeightValue(state, getObjectState(state).weight),
  }),
  {
    clearObjectFromStore,
    setCatalogBreadCrumbs,
    setNestedWobject,
    getObject,
    resetGallery,
    getAlbums,
    appendObject,
    addAlbumToStore,
    clearRelatedPhoto,
    getNearbyObjects: getNearbyObjectsAction,
    getWobjectExpertise: getWobjectExpertiseAction,
    getObjectFollowers: getObjectFollowersAction,
    getRelatedWobjects,
  },
)
export default class WobjectContainer extends React.Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    match: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape({
      hash: PropTypes.string,
    }).isRequired,
    failed: PropTypes.bool,
    isFetching: PropTypes.bool,
    getObject: PropTypes.func.isRequired,
    weightValue: PropTypes.number.isRequired,
    supportedObjectTypes: PropTypes.arrayOf(PropTypes.string),
    isWaivio: PropTypes.bool.isRequired,
    resetGallery: PropTypes.func.isRequired,
    wobject: PropTypes.shape(),
    clearObjectFromStore: PropTypes.func,
    setNestedWobject: PropTypes.func,
    setCatalogBreadCrumbs: PropTypes.func,
    locale: PropTypes.string,
    getAlbums: PropTypes.func,
    appendObject: PropTypes.func,
    addAlbumToStore: PropTypes.func,
    clearRelatedPhoto: PropTypes.func,
    getNearbyObjects: PropTypes.func.isRequired,
    getWobjectExpertise: PropTypes.func.isRequired,
    getObjectFollowers: PropTypes.func.isRequired,
    getRelatedWobjects: PropTypes.func.isRequired,
  };

  static defaultProps = {
    getAlbums: () => {},
    authenticatedUserName: '',
    locale: '',
    loaded: false,
    failed: false,
    isFetching: false,
    supportedObjectTypes: [],
    wobject: {},
    clearObjectFromStore: () => {},
    setCatalogBreadCrumbs: () => {},
    setNestedWobject: () => {},
    appendObject: () => {},
    addAlbumToStore: () => {},
    getRelatedAlbum: () => {},
    clearRelatedPhoto: () => {},
  };

  static fetchData({ store, match }) {
    return Promise.all([
      store.dispatch(getObject(match.params.name)),
      store.dispatch(getObjectFollowersAction({ object: match.params.name, skip: 0, limit: 5 })),
      store.dispatch(getRate()),
      store.dispatch(getRewardFund()),
      store.dispatch(getNearbyObjectsAction(match.params.name)),
      store.dispatch(
        getWobjectExpertiseAction(
          match.params[1] === 'newsFilter' ? { newsFilter: match.params.itemId } : {},
          match.params.name,
        ),
      ),
    ]);
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditMode:
        props.wobject.type === OBJECT_TYPE.PAGE &&
        props.authenticated &&
        !props.wobject[objectFields.pageContent],
    };
  }

  componentDidMount() {
    const { match, wobject, authenticatedUserName } = this.props;
    const newsFilter = match.params[1] === 'newsFilter' ? { newsFilter: match.params.itemId } : {};

    if (isEmpty(wobject) || wobject.id !== match.params.name) {
      this.props.getObject(match.params.name, authenticatedUserName);
      this.props.getAlbums(match.params.name);
      this.props.getNearbyObjects(match.params.name);
      this.props.getWobjectExpertise(newsFilter, match.params.name);
      this.props.getObjectFollowers({
        object: match.params.name,
        skip: 0,
        limit: 5,
        userName: authenticatedUserName,
      });
      this.props.getRelatedWobjects(match.params.name);
    }
  }

  componentDidUpdate(prevProps) {
    const { authenticatedUserName, match, locale } = this.props;
    const newsFilter = match.params[1] === 'newsFilter' ? { newsFilter: match.params.itemId } : {};

    if (prevProps.match.params.name !== match.params.name || prevProps.locale !== locale) {
      this.props.resetGallery();
      this.props.clearObjectFromStore();
      this.props.setCatalogBreadCrumbs([]);
      this.props.setNestedWobject({});
      this.props.getObject(match.params.name, authenticatedUserName);
      this.props.getRelatedWobjects(match.params.name);
      this.props.getWobjectExpertise(newsFilter, match.params.name);
      this.props.getObjectFollowers({
        object: match.params.name,
        skip: 0,
        limit: 5,
        userName: authenticatedUserName,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearObjectFromStore();
    this.props.setCatalogBreadCrumbs([]);
    this.props.setNestedWobject({});
    this.props.clearRelatedPhoto();
  }

  toggleViewEditMode = () => this.setState(prevState => ({ isEditMode: !prevState.isEditMode }));

  appendAlbum = () => {
    const formData = {
      galleryAlbum: 'Photos',
    };

    const { authenticatedUserName, wobject } = this.props;
    const data = prepareAlbumData(formData, authenticatedUserName, wobject);
    const album = prepareAlbumToStore(data);

    const { author } = this.props.appendObject(data);

    this.props.addAlbumToStore({ ...album, author });
  };

  render() {
    const {
      route,
      authenticated,
      failed,
      authenticatedUserName,
      match,
      wobject,
      isFetching,
      history,
    } = this.props;
    const { isEditMode } = this.state;
    const objectName = getObjectName(wobject);

    if (failed)
      return (
        <div className="main-panel">
          <NotFound
            item={match.params.name}
            title={'there_are_not_object_with_name'}
            titleDefault={'Sorry! There are no object with name {item} on Waivio'}
          />
        </div>
      );

    return (
      <Wobj
        route={route}
        authenticated={authenticated}
        failed={failed}
        authenticatedUserName={authenticatedUserName}
        match={match}
        wobject={wobject}
        isFetching={isFetching}
        history={history}
        isEditMode={isEditMode}
        toggleViewEditMode={this.toggleViewEditMode}
        objectName={objectName}
        appendAlbum={this.appendAlbum}
        isWaivio={this.props.isWaivio}
        supportedObjectTypes={this.props.supportedObjectTypes}
        weightValue={this.props.weightValue}
      />
    );
  }
}
