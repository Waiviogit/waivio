import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Views from '../../../routes/components';
import { getNavigItems } from '../../../store/appStore/appSelectors';
import { getObject } from '../../../store/wObjectStore/wobjectsActions';
import { getObject as getObjectState } from '../../../store/wObjectStore/wObjectSelectors';
import Affix from '../../components/Utils/Affix';
import DepartmentsWobject from '../../object/ObjectTypeShop/DepartmentsWobject';
import WobjectShopFilter from '../../object/ObjectTypeShop/WobjectShopFilter';
import WobjectShoppingList from '../../object/ObjectTypeShop/WobjectShoppingList';
import Wobj from '../../object/Wobj/Wobj';
import ActiveCampaignList from '../ActiveCampaignList/ActiveCampaignList';
import Checklist from '../Checklist/Checklist';
import { getAlbums } from '../../../store/galleryStore/galleryActions';
import WebsiteBody from '../../websites/WebsiteLayoutComponents/Body/WebsiteBody';
import NewDiscover from '../NewDiscover/NewDiscover';

const ShopMainForWobject = () => {
  const links = useSelector(getNavigItems);
  const objState = useSelector(getObjectState);
  const objType = (links[0] || objState)?.object_type;
  const dispatch = useDispatch();
  const authorPermlink = links[0]?.permlink || objState.author_permlink;

  useEffect(() => {
    if (!['shop', 'list', 'page', 'map', 'newsfeed'].includes(objType || '') && authorPermlink) {
      dispatch(getObject(authorPermlink));
      dispatch(getAlbums(authorPermlink));
    }
  }, [links]);

  const getFirstPage = () => {
    if (links[0]?.link?.includes('/active-campaigns')) return <ActiveCampaignList />;
    if (links[0]?.link?.includes('/discover-objects')) {
      const type = links[0]?.link
        ?.split('/')
        .filter(Boolean)
        .slice(-1)[0];

      return <NewDiscover initialType={type} />;
    }

    switch (objType) {
      case 'shop':
        return (
          <div className="shifted">
            <div className="feed-layout container Shop shifted">
              <Affix className="leftContainer" stickPosition={77}>
                <div className="left">
                  <DepartmentsWobject name={authorPermlink} />
                  <WobjectShopFilter name={authorPermlink} />
                </div>
              </Affix>
              <div className="center">
                <WobjectShoppingList name={authorPermlink} isSocial />
              </div>
            </div>
          </div>
        );
      case 'list':
      case 'page':
      case 'newsfeed':
        return <Checklist permlink={authorPermlink} isMain />;
      case 'map':
        return <WebsiteBody permlink={authorPermlink} isSocial />;

      default:
        return (
          <Wobj
            isSocial
            route={{
              routes: [
                {
                  path: [''],
                  exact: true,
                  component: Views.ObjectPageFeed,
                },
              ],
            }}
          />
        );
    }
  };

  return getFirstPage();
};

ShopMainForWobject.propTypes = {};

export default ShopMainForWobject;
