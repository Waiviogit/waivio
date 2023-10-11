import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Views from '../../../routes/components';
import { getNavigItems } from '../../../store/appStore/appSelectors';
import { getObject } from '../../../store/wObjectStore/wobjectsActions';
import Affix from '../../components/Utils/Affix';
import DepartmentsWobject from '../../object/ObjectTypeShop/DepartmentsWobject';
import WobjectShopFilter from '../../object/ObjectTypeShop/WobjectShopFilter';
import WobjectShoppingList from '../../object/ObjectTypeShop/WobjectShoppingList';
import Wobj from '../../object/Wobj/Wobj';
import NestedChecklist from '../Checklist/NestedChecklist';

const ShopMainForWobject = () => {
  const links = useSelector(getNavigItems);
  const obj = links[0];
  const dispatch = useDispatch();
  const authorPermlink = obj?.permlink;

  useEffect(() => {
    if (!['shop', 'list'].includes(obj?.object_type) && authorPermlink) {
      dispatch(getObject(authorPermlink));
    }
  }, [links]);

  const getFirstPage = () => {
    switch (obj?.object_type) {
      case 'shop':
        return (
          <div className="settings-layout">
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
        );
      case 'list':
        return <NestedChecklist permlink={authorPermlink} />;

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
