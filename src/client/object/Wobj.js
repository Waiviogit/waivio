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
} from '../reducers';
import { getObjectInfo } from './wobjectsActions';
import { resetGallery } from '../object/ObjectGallery/galleryActions';
import { getObjectUrl } from '../components/ObjectAvatar';
import Error404 from '../statics/Error404';
import WobjHero from './WobjHero';
import LeftObjectProfileSidebar from '../app/Sidebar/LeftObjectProfileSidebar';
import RightObjectSidebar from '../app/Sidebar/RightObjectSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@withRouter
@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
    wobject: getObjectState(state),
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
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getObjectInfo: () => {},
    wobject: {},
  };

  state = {
    isEditMode: false,
  };

  componentDidMount() {
    const { match, authenticatedUserName } = this.props;
    this.props.getObjectInfo(match.params.name, authenticatedUserName);
  }

  componentWillReceiveProps(nextProps) {
    const { history, match } = this.props;
    if (
      nextProps.wobject.object_type &&
      nextProps.wobject.object_type.toLowerCase() === 'list' &&
      !match.params[0] &&
      !nextProps.match.params[0]
    ) {
      history.push(`${history.location.pathname}/list`);
    }
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;

    if (prevProps.match.params.name !== match.params.name) {
      this.props.getObjectInfo(match.params.name);
    }
  }

  componentWillUnmount() {
    this.props.resetGallery();
  }

  toggleViewEditMode = () => this.setState(prevState => ({ isEditMode: !prevState.isEditMode }));

  render() {
    const { isEditMode } = this.state;
    const { authenticated, failed, authenticatedUserName: userName, wobject, match } = this.props;
    if (failed) return <Error404 />;

    const busyHost = global.postOrigin || 'https://waiviodev.com';
    const desc = `Posts by ${wobject.tag}`;
    const image = getObjectUrl(wobject);
    const canonicalUrl = `${busyHost}/object/${wobject.tag}`;
    const url = `${busyHost}/object/${wobject.tag}`;
    const displayedObjectName = wobject.tag || '';
    const title = `Object - Waivio`;

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
          <meta property="twitter:site" content={'@steemit'} />
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
          <div className="feed-layout container">
            <Affix className="leftContainer leftContainer__user" stickPosition={72}>
              <div className="left">
                <LeftObjectProfileSidebar
                  isEditMode={isEditMode}
                  wobject={wobject}
                  userName={userName}
                />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">
                <RightObjectSidebar username={userName} wobject={wobject} />
              </div>
            </Affix>
            <div className="center">
              {renderRoutes(this.props.route.routes, { isEditMode, wobject, userName, match })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
