import React from 'react';
import { useSelector } from 'react-redux';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import ObjectReviewsAndThreads from '../ObjectReviewsAndThreads/ObjectReviewsAndThreads';
import CatalogWrap from '../Catalog/CatalogWrap';
import ObjectOfTypePage from '../ObjectOfTypePage/ObjectOfTypePage';
import GroupObjectType from '../GroupObjectType/GroupObjectType';
import ObjectOfTypeMap from '../ObjectOfTypeMap/ObjectOfTypeMap';
import ObjectOfTypeWebpage from '../ObjectOfTypeWebpage/ObjectOfTypeWebpage';
import ObjectFeed from '../ObjectFeed';
import ObjectDepartmentsWobjList from '../ObjectTypeShop/ObjectDepartmentsWobjList';
import WidgetPage from '../WidgetPage/WidgetPage';

const WobjSwitcherPage = () => {
  const wobject = useSelector(getObject);

  const getPageComponent = () => {
    switch (wobject.object_type) {
      case 'list':
        return <CatalogWrap />;
      case 'page':
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
        return <GroupObjectType wobject={wobject} />;

      default:
        return <ObjectReviewsAndThreads wobject={wobject} />;
    }
  };

  return <div>{getPageComponent()}</div>;
};

export default WobjSwitcherPage;
