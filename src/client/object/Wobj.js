import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {renderRoutes} from 'react-router-config';
import {Helmet} from 'react-helmet';
import _ from 'lodash';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsUserFailed,
  getIsUserLoaded,
  getObject as getObjectState,
  getObjectChartId,
  getScreenSize
} from '../reducers';
import OBJECT_TYPE from './const/objectTypes';
import {getObjectInfo} from './wobjectsActions';
import {resetGallery} from '../object/ObjectGallery/galleryActions';
import Error404 from '../statics/Error404';
import WobjHero from './WobjHero';
import LeftObjectProfileSidebar from '../app/Sidebar/LeftObjectProfileSidebar';
import RightObjectSidebar from '../app/Sidebar/RightObjectSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import {getFieldWithMaxWeight} from './wObjectHelper';
import {objectFields} from '../../common/constants/listOfFields';

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
    chartId: getObjectChartId(state)
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
    const { authenticated, history, match, screenSize } = this.props;
    if (!_.isEmpty(nextProps.wobject) && !match.params[0] && !nextProps.match.params[0]) {
      if (nextProps.wobject.object_type) {
        const pageField = getFieldWithMaxWeight(nextProps.wobject, objectFields.pageContent);
        switch (nextProps.wobject.object_type.toLowerCase()) {
          case OBJECT_TYPE.PAGE:
            if (!pageField && authenticated) {
              this.setState({ isEditMode: true });
            }
            history.replace(`${history.location.pathname}/${OBJECT_TYPE.PAGE}`);
            break;
          case OBJECT_TYPE.LIST:
            history.replace(`${history.location.pathname}/${OBJECT_TYPE.LIST}`);
            break;
          case OBJECT_TYPE.HASHTAG:
            break;
          default:
            if (screenSize !== 'large') {
              history.replace(`${history.location.pathname}/about`);
            }
            break;
        }
      }
    }
    if (nextProps.match.params[0] !== this.props.match.params[0]) {
      this.setState({ hasLeftSidebar: nextProps.match.params[0] !== OBJECT_TYPE.PAGE });
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
    const busyHost = global.postOrigin || 'https://waiviodev.com';
    const desc = `Posts by ${objectName}`;
    const image = getFieldWithMaxWeight(wobject, objectFields.avatar);
    const canonicalUrl = `${busyHost}/object/${wobject.author_permlink}`;
    const url = `${busyHost}/object/${wobject.author_permlink}`;
    const displayedObjectName = objectName || '';
    const title = `Object - ${objectName || wobject.default_name || ''}`;

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
          <div className={`container ${hasLeftSidebar ? 'feed-layout' : 'post-layout'}`}>
            {hasLeftSidebar && (
              <Affix className="leftContainer leftContainer__user" stickPosition={72}>
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
                <RightObjectSidebar username={userName} wobject={wobject} quoteSecurity={chartId.body}/>
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
