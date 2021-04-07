import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import { getLocale } from '../../store/reducers';
import OBJECT_TYPE from '../const/objectTypes';
import { clearObjectFromStore, getObject } from '../../store/wObjectStore/wobjectsActions';
import {
  getAlbums,
  resetGallery,
  addAlbumToStore,
  clearRelatedPhoto,
} from '../ObjectGallery/galleryActions';
import { objectFields } from '../../../common/constants/listOfFields';
import { getObjectName, prepareAlbumData, prepareAlbumToStore } from '../../helpers/wObjectHelper';
import { setCatalogBreadCrumbs, setNestedWobject } from '../../store/wObjectStore/wobjActions';
import { appendObject } from '../appendActions';
import Wobj from './Wobj';
import NotFound from '../../statics/NotFound';
import { getHelmetIcon, getScreenSize } from '../../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../store/authStore/authSelectors';
import {
  getObject as getObjectState,
  getObjectFetchingState,
  getWobjectIsFailed,
  getWobjectIsFatching,
} from '../../store/wObjectStore/wObjectSelectors';

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
    helmetIcon: getHelmetIcon(state),
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
    resetGallery: PropTypes.func.isRequired,
    wobject: PropTypes.shape(),
    clearObjectFromStore: PropTypes.func,
    setNestedWobject: PropTypes.func,
    setCatalogBreadCrumbs: PropTypes.func,
    locale: PropTypes.string,
    helmetIcon: PropTypes.string.isRequired,
    getAlbums: PropTypes.func,
    appendObject: PropTypes.func,
    addAlbumToStore: PropTypes.func,
    clearRelatedPhoto: PropTypes.func,
  };

  static defaultProps = {
    getAlbums: () => {},
    authenticatedUserName: '',
    locale: '',
    loaded: false,
    failed: false,
    isFetching: false,
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
    return store.dispatch(getObject(match.params.name, getAuthenticatedUserName(store.getState())));
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

    if (isEmpty(wobject) || wobject.id !== match.params.name) {
      this.props.getObject(match.params.name, authenticatedUserName);
      this.props.getAlbums(match.params.name);
    }
  }

  componentDidUpdate(prevProps) {
    const { authenticatedUserName, match, locale } = this.props;

    if (prevProps.match.params.name !== match.params.name || prevProps.locale !== locale) {
      this.props.resetGallery();
      this.props.clearObjectFromStore();
      this.props.setCatalogBreadCrumbs([]);
      this.props.setNestedWobject({});
      this.props.getObject(match.params.name, authenticatedUserName);
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
      <React.Fragment>
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
          helmetIcon={this.props.helmetIcon}
        />
      </React.Fragment>
    );
  }
}
