import React from 'react';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import CatalogWrap from '../Catalog/CatalogWrap';
import GroupObjectType from '../GroupObjectType/GroupObjectType';
import ObjectDepartmentsWobjList from '../ObjectTypeShop/ObjectDepartmentsWobjList';
import ObjectFeed from '../ObjectFeed';
import ObjectOfTypeMap from '../ObjectOfTypeMap/ObjectOfTypeMap';
import ObjectOfTypePage from '../ObjectOfTypePage/ObjectOfTypePage';
import ObjectOfTypeWebpage from '../ObjectOfTypeWebpage/ObjectOfTypeWebpage';
import ObjectReviewsAndThreads from '../ObjectReviewsAndThreads/ObjectReviewsAndThreads';
import WidgetPage from '../WidgetPage/WidgetPage';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';

const WobjSwitcherPage = () => {
  const wobject = useSelector(getObject);
  const match = useRouteMatch();

  const getPageComponent = () => {
    switch (wobject.object_type) {
      case 'list':
        return <CatalogWrap />;
      case 'page':
        return <ObjectOfTypePage wobject={wobject} />;
      case 'html':
        return <ObjectOfTypePage wobject={wobject} />;
      case 'newsfeed':
        return <ObjectFeed wobject={wobject} inNewsFeed />;
      case 'widget':
        return <WidgetPage wobject={wobject} />;
      case 'webpage':
        return <ObjectOfTypeWebpage wobject={wobject} />;
      case 'map':
        return <ObjectOfTypeMap wobject={wobject} />;
      case 'shop':
        return <ObjectDepartmentsWobjList wobject={wobject} />;
      case 'group':
        return <GroupObjectType match={match} wobject={wobject} />;

      default:
        return <ObjectReviewsAndThreads wobject={wobject} />;
    }
  };

  return <div>{getPageComponent()}</div>;
};

export default WobjSwitcherPage;
