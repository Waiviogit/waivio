import React from 'react';
import { renderRoutes } from 'react-router-config';
import classNames from 'classnames';
import { get, isEmpty, isNil } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import WobjHero from '../WobjHero';
import Affix from '../../components/Utils/Affix';
import LeftObjectProfileSidebar from '../../app/Sidebar/LeftObjectProfileSidebar';
import WobjectShopFilter from '../ObjectTypeShop/WobjectShopFilter';
import ObjectsRelated from '../../components/Sidebar/ObjectsRelated/index';
import ObjectsAddOn from '../../components/Sidebar/ObjectsAddOn/ObjectsAddOn';
import ObjectsSimilar from '../../components/Sidebar/ObjectsSimilar/ObjectsSimilar';
import ObjectReference from '../../components/Sidebar/ObjectReference/ObjectReference';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import WobjectNearby from '../../app/Sidebar/ObjectInfoExperts/WobjectNearby';
import WobjectSidebarFollowers from '../../app/Sidebar/ObjectInfoExperts/WobjectSidebarFollowers';
import { hasType } from '../../../common/helpers/wObjectHelper';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { formColumnsField } from '../../../common/constants/listOfFields';
import OBJECT_TYPE from '../const/objectTypes';

const WobjectView = ({
  authenticatedUserName,
  match,
  wobject,
  history,
  isEditMode,
  toggleViewEditMode,
  route,
  handleFollowClick,
  appendAlbum,
  nestedWobject,
}) => {
  const referenceWobjType = ['business', 'person'].includes(wobject.object_type) && !isMobile();
  const albumsAndImagesCount = wobject.albums_count;
  const formsList = get(wobject, 'form', []);
  const currentForm = formsList?.find(item => item?.permlink === match.params.parentName) || {};
  const currentWobject = history.location.hash ? nestedWobject : wobject;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);
  const isWidgetPage = isNil(match.params[0]) && match.params[1] === 'widget';
  const currentColumn = get(currentForm, 'column', '');
  const currentWidgetColumn = get(widgetForm, 'column', '');
  const middleRightColumn =
    currentColumn === formColumnsField.middleRight ||
    (currentWidgetColumn === formColumnsField.middleRight && isWidgetPage);
  const entireColumn =
    currentColumn === formColumnsField.entire ||
    (currentWidgetColumn === formColumnsField.entire && isWidgetPage);
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

  return (
    <React.Fragment>
      <WobjHero
        isEditMode={isEditMode}
        authenticated={authenticatedUserName}
        isFetching={isEmpty(wobject)}
        wobject={wobject}
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
                userName={authenticatedUserName}
                history={history}
                appendAlbum={appendAlbum}
              />
            </div>
          </Affix>
          {wobject.author_permlink && (
            <Affix className={rightSidebarClassList} stickPosition={72}>
              {match.url.includes('/shop') ? (
                <WobjectShopFilter />
              ) : (
                <React.Fragment>
                  <ObjectsRelated />
                  <ObjectsAddOn wobject={wobject} />
                  <ObjectsSimilar wobject={wobject} />
                  {referenceWobjType && <ObjectReference wobject={wobject} />}
                  <ObjectExpertise wobject={wobject} />
                  {wobject.map && <WobjectNearby wobject={wobject} />}
                  <WobjectSidebarFollowers wobject={wobject} />
                </React.Fragment>
              )}
            </Affix>
          )}
          <div className={centerClassList}>
            {renderRoutes(route.routes, {
              isEditMode,
              wobject,
              authenticatedUserName,
              match,
              toggleViewEditMode,
              appendAlbum,
              currentForm,
              route,
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

WobjectView.propTypes = {
  authenticatedUserName: PropTypes.string,
  match: PropTypes.shape(),
  wobject: PropTypes.shape(),
  history: PropTypes.shape(),
  isEditMode: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  route: PropTypes.shape(),
  handleFollowClick: PropTypes.func,
  appendAlbum: PropTypes.func,
  nestedWobject: PropTypes.string,
};

export default withRouter(WobjectView);
