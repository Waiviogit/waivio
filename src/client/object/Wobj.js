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
  getObject as getObjectState,
  getScreenSize,
  getObjectFetchingState,
  getLocale,
  getWobjectIsFailed,
  getWobjectIsFatching,
} from '../reducers';
import OBJECT_TYPE from './const/objectTypes';
import { clearObjectFromStore, getObject } from './wobjectsActions';
import { getAlbums, resetGallery, addAlbumToStore } from './ObjectGallery/galleryActions';
import Error404 from '../statics/Error404';
import WobjHero from './WobjHero';
import LeftObjectProfileSidebar from '../app/Sidebar/LeftObjectProfileSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import { objectFields } from '../../common/constants/listOfFields';
import ObjectExpertise from '../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../components/Sidebar/ObjectsRelated/ObjectsRelated';
import NotFound from '../statics/NotFound';
import { getObjectName, prepareAlbumData, prepareAlbumToStore } from '../helpers/wObjectHelper';
import DEFAULTS from '../object/const/defaultValues';
import { setCatalogBreadCrumbs, setWobjectForBreadCrumbs } from './wobjActions';
import { appendObject } from './appendActions';

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
  }),
  {
    clearObjectFromStore,
    setCatalogBreadCrumbs,
    setWobjectForBreadCrumbs,
    getObject,
    resetGallery,
    getAlbums,
    appendObject,
    addAlbumToStore,
  },
)
export default class Wobj extends React.Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    match: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    failed: PropTypes.bool,
    isFetching: PropTypes.bool,
    getObject: PropTypes.func.isRequired,
    resetGallery: PropTypes.func.isRequired,
    wobject: PropTypes.shape(),
    clearObjectFromStore: PropTypes.func,
    setWobjectForBreadCrumbs: PropTypes.func,
    setCatalogBreadCrumbs: PropTypes.func,
    locale: PropTypes.string,
    getAlbums: PropTypes.func,
    appendObject: PropTypes.func,
    addAlbumToStore: PropTypes.func,
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
    setWobjectForBreadCrumbs: () => {},
    appendObject: () => {},
    addAlbumToStore: () => {},
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
      hasLeftSidebar: props.match.params[0] !== OBJECT_TYPE.PAGE,
    };
  }

  componentDidMount() {
    const { match, wobject, authenticatedUserName } = this.props;

    if (isEmpty(wobject) || wobject.id !== match.params.name) {
      this.props.getObject(match.params.name, authenticatedUserName);
      this.props.getAlbums(match.params.name);
    }
    if (wobject.albums_count === 0) {
      this.appendAlbum();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params[0] !== this.props.match.params[0]) {
      this.setState({ hasLeftSidebar: nextProps.match.params[0] !== OBJECT_TYPE.PAGE });
    }
  }

  componentDidUpdate(prevProps) {
    const { authenticatedUserName, match, locale } = this.props;
    if (prevProps.match.params.name !== match.params.name || prevProps.locale !== locale) {
      this.props.resetGallery();
      this.props.clearObjectFromStore();
      this.props.setCatalogBreadCrumbs([]);
      this.props.setWobjectForBreadCrumbs({});
      this.props.getObject(match.params.name, authenticatedUserName);
    }
  }

  componentWillUnmount() {
    this.props.clearObjectFromStore();
    this.props.setCatalogBreadCrumbs([]);
    this.props.setWobjectForBreadCrumbs({});
  }

  toggleViewEditMode = () => this.setState(prevState => ({ isEditMode: !prevState.isEditMode }));

  appendAlbum = async () => {
    const formData = {
      galleryAlbum: 'Photos',
    };

    const { authenticatedUserName, wobject } = this.props;
    const data = prepareAlbumData(formData, authenticatedUserName, wobject);
    const album = prepareAlbumToStore(data);

    const { author } = await this.props.appendObject(data);
    await this.props.addAlbumToStore({ ...album, author });
    this.setState(() => ({ currentAlbum: album }));
  };

  render() {
    const { isEditMode, hasLeftSidebar } = this.state;
    const {
      authenticated,
      failed,
      authenticatedUserName: userName,
      match,
      wobject,
      isFetching,
    } = this.props;
    if (failed) return <Error404 />;

    const objectName = getObjectName(wobject);
    if (!objectName && !isFetching) {
      return (
        <div className="main-panel">
          <NotFound
            item={match.params.name}
            title={'there_are_not_object_with_name'}
            titleDefault={'Sorry! There are no object with name {item} on Waivio'}
          />
        </div>
      );
    }
    const waivioHost = global.postOrigin || 'https://www.waivio.com';
    const desc = wobject.description || objectName;
    const image = wobject.avatar || DEFAULTS.AVATAR;
    const canonicalUrl = `https://www.waivio.com/object/${match.params.name}`;
    const url = `${waivioHost}/object/${match.params.name}`;
    const displayedObjectName = objectName;
    const albumsAndImagesCount = wobject.albums_count;
    const { history } = this.props;

    return (
      <div className="main-panel">
        <Helmet>
          <title>{objectName}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta name="og:description" property="description" content={desc} />
          <meta name="og:title" property="og:title" content={objectName} />
          <meta name="og:type" property="og:type" content="article" />
          <meta name="og:url" property="og:url" content={url} />
          <meta name="og:image" property="og:image" content={image} />
          <meta name="og:image:width" property="og:image:width" content="600" />
          <meta name="og:image:height" property="og:image:height" content="600" />
          <meta name="og:description" property="og:description" content={desc} />
          <meta name="og:site_name" property="og:site_name" content="Waivio" />
          <meta
            name="twitter:card"
            property="twitter:card"
            content={image ? 'summary_large_image' : 'summary'}
          />
          <meta name="twitter:site" property="twitter:site" content={'@waivio'} />
          <meta name="twitter:title" property="twitter:title" content={objectName} />
          <meta name="twitter:description" property="twitter:description" content={desc} />
          <meta
            name="twitter:image"
            property="twitter:image"
            content={
              image ||
              'https://waivio.nyc3.digitaloceanspaces.com/1587571702_96367762-1996-4b56-bafe-0793f04a9d79'
            }
          />
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
                stickPosition={72}
              >
                <div className="left">
                  <LeftObjectProfileSidebar
                    isEditMode={isEditMode}
                    wobject={wobject}
                    userName={userName}
                    history={history}
                  />
                </div>
              </Affix>
            )}
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">
                {wobject.author_permlink && (
                  <ObjectExpertise username={userName} wobject={wobject} />
                )}
              </div>
              <div>{wobject.author_permlink && <ObjectsRelated wobject={wobject} />}</div>
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
