import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getUser,
  getIsUserFailed,
  getIsUserLoaded,
  getAuthenticatedUserName,
} from '../reducers';
import { getObject } from './wobjectsActions';
import { getObjectUrl } from '../components/ObjectAvatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
  }),
  {
    getObject,
  },
)
export default class Wobj extends React.Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    // authenticatedUser: PropTypes.shape().isRequired,
    // authenticatedUserName: PropTypes.string,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    loaded: PropTypes.bool,
    failed: PropTypes.bool,
    getObject: PropTypes.func,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getObject: () => {},
  };

  state = {
    wobject: {},
  };

  componentDidMount() {
    const { user } = this.props;
    if (!user.id && !user.failed) {
      this.props.getObject(this.props.match.params.name).then(wobject => {
        this.setState({ wobject });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.props.getObject(this.props.match.params.name).then(wobject => {
        this.setState({ wobject }, () => {
          console.log(wobject);
        });
      });
    }
  }

  render() {
    const { authenticated, loaded, failed } = this.props;
    if (failed) return <Error404 />;

    const { wobject: { value } } = this.state;

    if (!value) return 'Loading...';

    const { user } = this.props;

    const busyHost = global.postOrigin || 'https://busy.org';
    const desc = `Posts by ${value.tag}`;
    const image = getObjectUrl(value);
    const canonicalUrl = `${busyHost}/object/@${value.tag}`;
    const url = `${busyHost}/object/@${value.tag}`;
    const displayedUsername = value.tag || '';
    const hasCover = !!value.cover_image;
    const title = `${displayedUsername} - Waivio`;

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
          <meta property="og:site_name" content="Busy" />

          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={image || 'https://steemit.com/images/steemit-twshare.png'}
          />
        </Helmet>
        <ScrollToTopOnMount />
        {user && (
          <UserHero
            authenticated={authenticated}
            user={user}
            wobject={value}
            username={displayedUsername}
            coverImage={value.cover_image}
            hasCover={hasCover}
            onFollowClick={this.handleFollowClick}
          />
        )}
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer leftContainer__user" stickPosition={72}>
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">{loaded && <RightSidebar key={user.name} />}</div>
            </Affix>
            {loaded && <div className="center">{renderRoutes(this.props.route.routes)}</div>}
          </div>
        </div>
      </div>
    );
  }
}
