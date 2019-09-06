import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getIsUserFailed,
  getIsUserLoaded,
  getAuthenticatedUserName,
  getObject as getObjectState,
  getObjectChartId,
  getScreenSize,
} from '../reducers';
import OBJECT_TYPE from './const/objectTypes';
import { getObject, getObjectInfo } from './wobjectsActions';
import { resetGallery } from '../object/ObjectGallery/galleryActions';
import Error404 from '../statics/Error404';
import WobjHero from './WobjHero';
import LeftObjectProfileSidebar from '../app/Sidebar/LeftObjectProfileSidebar';
import RightObjectSidebar from '../app/Sidebar/RightObjectSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import { getFieldWithMaxWeight, getInitialUrl } from './wObjectHelper';
import { objectFields } from '../../common/constants/listOfFields';

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
    chartId: getObjectChartId(state),
  }),
  {
    getObjectInfo,
    resetGallery,
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
    getObjectInfo: PropTypes.func,
    resetGallery: PropTypes.func.isRequired,
    wobject: PropTypes.shape(),
    screenSize: PropTypes.string,
    chartId: PropTypes.shape(),
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getObjectInfo: () => {},
    wobject: {},
    screenSize: 'large',
    chartId: {},
  };

  static fetchData({ store, match }) {
    return store.dispatch(getObject(match.params.name));
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditMode: false,
      hasLeftSidebar: props.match.params[0] !== OBJECT_TYPE.PAGE,
    };
  }

  componentDidMount() {
    const { match, authenticatedUserName } = this.props;
    this.props.getObjectInfo(match.params.name, authenticatedUserName);
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated, history, match, screenSize, wobject } = this.props;
    if (wobject.id !== nextProps.wobject.id && !match.params[0] && !nextProps.match.params[0]) {
      history.replace(getInitialUrl(nextProps.wobject, screenSize, history.location));
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
    const { match, authenticatedUserName } = this.props;

    if (prevProps.match.params.name !== match.params.name) {
      this.props.getObjectInfo(match.params.name, authenticatedUserName);
    }
  }

  componentWillUnmount() {
    this.props.resetGallery();
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
      wobject,
      match,
      chartId,
    } = this.props;
    if (failed) return <Error404 />;

    const objectName = getFieldWithMaxWeight(wobject, objectFields.name);
    const waivioHost = global.postOrigin || 'https://investarena.waiviodev.com';
    const desc = `${objectName || ''}`;
    const image = getFieldWithMaxWeight(wobject, objectFields.avatar);
    const canonicalUrl = `${waivioHost}/object/${match.params.name}`;
    const url = `${waivioHost}/object/${match.params.name}`;
    const displayedObjectName = objectName || '';
    const title = `${objectName || wobject.default_name || ''}`;

    return (
      <div className="main-panel">
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Waivio" />
          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@waivio'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={
              image ||
              'https://cdn.steemitimages.com/DQmVRiHgKNWhWpDXSmD7ZK4G48mYkLMPcoNT8VzgXNWZ8aN/image.png'
            }
          />
        </Helmet>
        <ScrollToTopOnMount />
        <WobjHero
          isEditMode={isEditMode}
          authenticated={authenticated}
          isFetching={_.isEmpty(wobject)}
          wobject={wobject}
          username={displayedObjectName}
          onFollowClick={this.handleFollowClick}
          toggleViewEditMode={this.toggleViewEditMode}
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
                  />
                </div>
              </Affix>
            )}
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">
                {wobject.author_permlink && <RightObjectSidebar
                  username={userName}
                  wobject={wobject}
                  quoteSecurity={chartId.body || ""}
                />}
              </div>
            </Affix>
            <div className="center">
              {renderRoutes(this.props.route.routes, {
                isEditMode,
                wobject,
                userName,
                match,
                chartId,
                toggleViewEditMode: this.toggleViewEditMode,
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
