import React from 'react';
import { useSelector } from 'react-redux';
import Views from '../../../routes/components';
import { getObject as getObjectState } from '../../../store/wObjectStore/wObjectSelectors';
import Affix from '../../components/Utils/Affix';
import DepartmentsWobject from '../../object/ObjectTypeShop/DepartmentsWobject';
import WobjectShopFilter from '../../object/ObjectTypeShop/WobjectShopFilter';
import WobjectShoppingList from '../../object/ObjectTypeShop/WobjectShoppingList';
import Wobj from '../../object/Wobj/Wobj';

const ShopMainForWobject = () => {
  const obj = useSelector(getObjectState);
  const getFirstPage = () => {
    switch (obj?.object_type) {
      case 'shop':
        return (
          <div className="settings-layout">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <DepartmentsWobject name={obj?.author_permlink} />
                <WobjectShopFilter name={obj?.author_permlink} />
              </div>
            </Affix>
            <div className="center">
              <WobjectShoppingList name={obj?.author_permlink} isSocial />
            </div>
          </div>
        );

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
