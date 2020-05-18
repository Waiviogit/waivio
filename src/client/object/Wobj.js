import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import { isEmpty } from 'lodash';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsUserFailed,
  getIsUserLoaded,
  getObject as getObjectState,
  getObjectAlbums,
  getScreenSize,
  getObjectFetchingState,
} from '../reducers';
import OBJECT_TYPE from './const/objectTypes';
import { clearObjectFromStore, getObject, getObjectInfo } from './wobjectsActions';
import { resetGallery } from '../object/ObjectGallery/galleryActions';
import Error404 from '../statics/Error404';
import WobjHero from './WobjHero';
import LeftObjectProfileSidebar from '../app/Sidebar/LeftObjectProfileSidebar';
import RightObjectSidebar from '../app/Sidebar/RightObjectSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import { getInitialUrl } from './wObjectHelper';
import { objectFields } from '../../common/constants/listOfFields';
import ObjectsRelated from '../components/Sidebar/ObjectsRelated/ObjectsRelated';
import NotFound from '../statics/NotFound';
import defaults from '../object/const/defaultValues';

@withRouter
@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
    wobject: getObjectState(state),
    screenSize: getScreenSize(state),
    albums: getObjectAlbums(state),
    isFetching: getObjectFetchingState(state),
  }),
  {
    clearObjectFromStore,
    getObjectInfo,
    resetGallery,
  },
)
export default class Wobj extends React.Component {
  static fetchData({ store, match }) {
    return store.dispatch(getObject(match.params.name));
  }

  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    match: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    failed: PropTypes.bool,
    getObjectInfo: PropTypes.func,
    resetGallery: PropTypes.func.isRequired,
    wobject: PropTypes.shape(),
    screenSize: PropTypes.string,
    clearObjectFromStore: PropTypes.func,
    albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getObjectInfo: () => {},
    wobject: {},
    screenSize: 'large',
    clearObjectFromStore: () => {},
    isFetching: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditMode:
        props.wobject.type === OBJECT_TYPE.PAGE &&
        props.authenticated &&
        !props.wobject[objectFields.pageContent],
      hasLeftSidebar: props.match.params[0] !== OBJECT_TYPE.PAGE,
    };
  }

  componentDidMount() {
    const { authenticatedUserName, match, wobject } = this.props;
    if (isEmpty(wobject)) {
      this.props.getObjectInfo(match.params.name, authenticatedUserName);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated, history, screenSize, wobject } = this.props;
    if (nextProps.wobject.id !== wobject.id && !nextProps.match.params[0]) {
      const nextUrl = getInitialUrl(nextProps.wobject, screenSize, history.location);
      if (nextUrl !== history.location.pathname) history.replace(nextUrl);
    }
    if (nextProps.match.params[0] !== this.props.match.params[0]) {
      const nextState = { hasLeftSidebar: nextProps.match.params[0] !== OBJECT_TYPE.PAGE };
      if (
        nextProps.wobject.type === OBJECT_TYPE.PAGE &&
        authenticated &&
        !nextProps.wobject[objectFields.pageContent]
      ) {
        nextState.isEditMode = true;
      }
      this.setState(nextState);
    }
  }

  componentDidUpdate(prevProps) {
    const { authenticatedUserName, match } = this.props;
    if (prevProps.match.params.name !== match.params.name) {
      this.props.getObjectInfo(match.params.name, authenticatedUserName);
      this.setState({ isEditMode: false });
    }
  }

  componentWillUnmount() {
    this.props.resetGallery();
    this.props.clearObjectFromStore();
  }

  toggleViewEditMode = isEditMode => {
    if (typeof isEditMode === 'boolean') {
      this.setState({ isEditMode });
    } else {
      this.setState(prevState => ({ isEditMode: !prevState.isEditMode }));
    }
  };

  render() {
    const { isEditMode, hasLeftSidebar } = this.state;
    const {
      authenticated,
      failed,
      authenticatedUserName: userName,
      match,
      wobject,
      albums,
      isFetching,
    } = this.props;
    if (failed) return <Error404 />;

    const objectName = wobject.name || wobject.default_name || '';
    if (!objectName && !isFetching)
      return (
        <div className="main-panel">
          <NotFound
            item={match.params.name}
            title={'there_are_not_object_with_name'}
            titleDefault={'Sorry! There are no object with name {item} on InvestArena'}
          />
        </div>
      );
    const waivioHost = global.postOrigin || 'https://investarena.waiviodev.com';
    const desc = `${objectName || ''}`;
    const image = wobject.avatar;
    const canonicalUrl = `${waivioHost}/object/${match.params.name}`;
    const url = `${waivioHost}/object/${match.params.name}`;
    const displayedObjectName = objectName || '';
    let albumsAndImagesCount;
    if (!isEmpty(albums)) {
      albumsAndImagesCount =
        albums.length - 1 + albums.reduce((acc, curr) => acc + curr.items.length, 0);
    }

    return (
      <div className="main-panel">
        <Helmet>
          <title>{objectName}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={objectName} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="InvestArena" />
          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@investArena'} />
          <meta property="twitter:title" content={objectName} />
          <meta property="twitter:description" content={desc} />
          <meta property="twitter:image" content={image || defaults.AVATAR} />
        </Helmet>
        <ScrollToTopOnMount />
        <WobjHero
          isEditMode={isEditMode}
          authenticated={authenticated}
          isFetching={isEmpty(wobject)}
          wobject={wobject}
          username={displayedObjectName}
          onFollowClick={this.handleFollowClick}
          toggleViewEditMode={this.toggleViewEditMode}
          albumsAndImagesCount={albumsAndImagesCount}
        />
        <div className="shifted">
          <div className={`container ${hasLeftSidebar ? 'feed-layout' : 'post-layout'}`}>
            {hasLeftSidebar && (
              <Affix
                key={match.params.name}
                className="leftContainer leftContainer__user"
                stickPosition={116}
              >
                <div className="left">
                  <LeftObjectProfileSidebar
                    isEditMode={isEditMode}
                    wobject={wobject}
                    userName={userName}
                  />
                </div>
              </Affix>
            )}
            <Affix className="rightContainer" stickPosition={116}>
              <div className="right">
                <RightObjectSidebar
                  username={userName}
                  wobject={wobject}
                  quoteSecurity={wobject.chartid || ''}
                />
              </div>
              <div>
                <ObjectsRelated wobject={wobject} />
              </div>
            </Affix>
            <div className="center">
              {renderRoutes(this.props.route.routes, {
                isEditMode,
                wobject,
                userName,
                match,
                toggleViewEditMode: this.toggleViewEditMode,
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
