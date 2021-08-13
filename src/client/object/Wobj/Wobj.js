import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get, isEmpty, round, reduce } from 'lodash';
import { renderRoutes } from 'react-router-config';
import DEFAULTS from '../const/defaultValues';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import WobjHero from '../WobjHero';
import Affix from '../../components/Utils/Affix';
import LeftObjectProfileSidebar from '../../app/Sidebar/LeftObjectProfileSidebar';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../../components/Sidebar/ObjectsRelated/index';
import { getObjectAvatar, getObjectType, hasType, parseAddress } from '../../helpers/wObjectHelper';
import OBJECT_TYPE from '../const/objectTypes';
import { formColumnsField } from '../../../common/constants/listOfFields';
import WobjectSidebarFollowers from '../../app/Sidebar/ObjectInfoExperts/WobjectSidebarFollowers';
import WobjectNearby from '../../app/Sidebar/ObjectInfoExperts/WobjectNearby';
import Seo from '../../SEO/Seo';

const Wobj = ({
  authenticated,
  authenticatedUserName: userName,
  match,
  wobject,
  history,
  isEditMode,
  toggleViewEditMode,
  route,
  handleFollowClick,
  objectName,
  appendAlbum,
  isWaivio,
  supportedObjectTypes,
  weightValue,
}) => {
  const image = getObjectAvatar(wobject) || DEFAULTS.AVATAR;
  const albumsAndImagesCount = wobject.albums_count;
  const address = parseAddress(wobject);
  const titleText = isWaivio ? `${objectName} - ${address || ''}` : objectName;
  const rank = hasType(wobject, 'restaurant') ? `Restaurant rank: ${round(weightValue, 2)}.` : '';

  const tagCategories = reduce(
    wobject.tagCategory,
    (acc, curr) => {
      const currentCategory = !isEmpty(curr.items)
        ? `${curr.body}: ${curr.items.map(item => item.body).join(', ')}`
        : '';

      return acc ? `${acc}. ${currentCategory}` : currentCategory;
    },
    '',
  );

  const desc = `${objectName}. ${rank} ${parseAddress(wobject) || ''} ${wobject.description ||
    ''} ${tagCategories}`;
  const formsList = get(wobject, 'form', []);
  const currentForm = formsList.find(item => item.permlink === match.params.itemId);
  const currentColumn = get(currentForm, 'column', '');
  const middleRightColumn = currentColumn === formColumnsField.middleRight;
  const entireColumn = currentColumn === formColumnsField.entire;
  const leftSidebarClassList = classNames('leftContainer leftContainer__wobj', {
    'leftContainer--left': entireColumn,
  });
  const rightSidebarClassList = classNames('wobjRightContainer', {
    'wobjRightContainer--right':
      hasType(wobject, OBJECT_TYPE.PAGE) || middleRightColumn || entireColumn,
  });
  const centerClassList = classNames('center', {
    'center--page': hasType(wobject, OBJECT_TYPE.PAGE),
    'center--middleForm': middleRightColumn,
    'center--fullForm': entireColumn,
  });

  useEffect(() => {
    if (!isWaivio) {
      const objectType = getObjectType(wobject);

      if (!isEmpty(wobject) && supportedObjectTypes.includes(objectType) && window.gtag)
        window.gtag('event', `view_${objectType}`);
    }
  }, [wobject.author_permlink]);

  return (
    <div className="main-panel">
      <Seo image={image} desc={desc} title={titleText} params={`/object/${match.params.name}`} />
      <ScrollToTopOnMount />
      <WobjHero
        isEditMode={isEditMode}
        authenticated={authenticated}
        isFetching={isEmpty(wobject)}
        wobject={wobject}
        username={objectName}
        onFollowClick={handleFollowClick}
        toggleViewEditMode={toggleViewEditMode}
        albumsAndImagesCount={albumsAndImagesCount}
        appendAlbum={appendAlbum}
      />
      <div className="shifted">
        <div className="container feed-layout">
          <Affix key={match.params.name} className={leftSidebarClassList} stickPosition={72}>
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
          {wobject.author_permlink && (
            <Affix className={rightSidebarClassList} stickPosition={72}>
              <ObjectExpertise wobject={wobject} />
              {wobject.map && <WobjectNearby wobject={wobject} />}
              <ObjectsRelated wobject={wobject} />
              <WobjectSidebarFollowers wobject={wobject} />
            </Affix>
          )}
          <div className={centerClassList}>
            {renderRoutes(route.routes, {
              isEditMode,
              wobject,
              userName,
              match,
              toggleViewEditMode,
              appendAlbum,
              currentForm,
              route,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

Wobj.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  authenticatedUserName: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  supportedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  isEditMode: PropTypes.bool.isRequired,
  isWaivio: PropTypes.bool.isRequired,
  toggleViewEditMode: PropTypes.func,
  handleFollowClick: PropTypes.func,
  objectName: PropTypes.string.isRequired,
  weightValue: PropTypes.number.isRequired,
  appendAlbum: PropTypes.func,
};

Wobj.defaultProps = {
  wobject: {},
  toggleViewEditMode: () => {},
  handleFollowClick: () => {},
  appendAlbum: () => {},
  supportedObjectTypes: [],
};

export default Wobj;
