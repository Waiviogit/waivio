import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { isEmpty } from 'lodash';
import { renderRoutes } from 'react-router-config';
import DEFAULTS from '../const/defaultValues';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import WobjHero from '../WobjHero';
import Affix from '../../components/Utils/Affix';
import LeftObjectProfileSidebar from '../../app/Sidebar/LeftObjectProfileSidebar';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../../components/Sidebar/ObjectsRelated/ObjectsRelated';

const Wobj = ({
  authenticated,
  authenticatedUserName: userName,
  match,
  wobject,
  history,
  isEditMode,
  toggleViewEditMode,
  route,
  appendAlbum,
  handleFollowClick,
  objectName,
}) => {
  const waivioHost = global.postOrigin || 'https://www.waivio.com';
  const image = wobject.avatar || DEFAULTS.AVATAR;
  const canonicalUrl = `https://www.waivio.com/object/${match.params.name}`;
  const url = `${waivioHost}/object/${match.params.name}`;
  const albumsAndImagesCount = wobject.albums_count;
  const displayedObjectName = objectName;
  const desc = wobject.description || objectName;

  return (
    <React.Fragment>
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
          onFollowClick={handleFollowClick}
          toggleViewEditMode={toggleViewEditMode}
          albumsAndImagesCount={albumsAndImagesCount}
          appendAlbum={appendAlbum}
        />
        <div className="shifted">
          <div className="container feed-layout">
            <Affix
              key={match.params.name}
              className="leftContainer leftContainer__wobj"
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
            <Affix className="wobjRightContainer" stickPosition={72}>
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
    </React.Fragment>
  );
};

Wobj.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  authenticatedUserName: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  toggleViewEditMode: PropTypes.func,
  appendAlbum: PropTypes.func,
  handleFollowClick: PropTypes.func,
  objectName: PropTypes.string.isRequired,
};

Wobj.defaultProps = {
  wobject: {},
  toggleViewEditMode: () => {},
  appendAlbum: () => {},
  handleFollowClick: () => {},
};

export default Wobj;
