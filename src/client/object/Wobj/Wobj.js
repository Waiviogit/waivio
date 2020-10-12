import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { isEmpty } from 'lodash';
import { renderRoutes } from 'react-router-config';
import Error404 from '../../statics/Error404';
import { getObjectName } from '../../helpers/wObjectHelper';
import NotFound from '../../statics/NotFound';
import DEFAULTS from '../const/defaultValues';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import WobjHero from '../WobjHero';
import Affix from '../../components/Utils/Affix';
import LeftObjectProfileSidebar from '../../app/Sidebar/LeftObjectProfileSidebar';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../../components/Sidebar/ObjectsRelated/ObjectsRelated';

const Wobj = {
  render() {
    const {
      authenticated,
      failed,
      authenticatedUserName: userName,
      match,
      wobject,
      isFetching,
      history,
      isEditMode,
      hasLeftSidebar,
      toggleViewEditMode,
      route,
      appendAlbum,
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
          appendAlbum={appendAlbum}
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
                    appendAlbum={appendAlbum}
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
              {renderRoutes(route.routes, {
                isEditMode,
                wobject,
                userName,
                match,
                toggleViewEditMode,
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

Wobj.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  failed: PropTypes.bool,
  authenticatedUserName: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  isFetching: PropTypes.bool,
  history: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  hasLeftSidebar: PropTypes.bool.isRequired,
  toggleViewEditMode: PropTypes.func,
  appendAlbum: PropTypes.func,
};

Wobj.defaultProps = {
  failed: false,
  wobject: {},
  isFetching: false,
  toggleViewEditMode: () => {},
  appendAlbum: () => {},
};
