import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import Helmet from 'react-helmet';
import { isEmpty, get } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  getHelmetIcon,
  getMainObj,
  getShopSettings,
  getSiteName,
} from '../../../store/appStore/appSelectors';
import { getObjectPosts } from '../../../store/feedStore/feedActions';
import Affix from '../../components/Utils/Affix';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';
import DepartmentsMobile from '../../Shop/ShopDepartments/DepartmentsMobile';
import DepartmentsUser from '../../Shop/ShopDepartments/DepartmentsUser';
import UserFilters from '../../Shop/ShopFilters/UserFilters';
import UserShoppingList from '../../Shop/ShopList/UserShoppingList';
import ShopMainForWobject from '../ShopMainForWobject/ShopMainForWobject';
import { useSeoInfo } from '../../../hooks/useSeoInfo';

import './ShopSwitcher.less';
import { getWebsiteConfigForSSR, setMainObj } from '../../../store/appStore/appActions';
import { getObject as getObjectAction } from '../../../store/wObjectStore/wobjectsActions';
import { getObject } from '../../../waivioApi/ApiClient';
import { parseJSON } from '../../../common/helpers/parseJSON';
import {
  getUserDepartments,
  getUserShopList,
  getWobjectDepartments,
  getWobjectsShopList,
} from '../../../store/shopStore/shopActions';

const ShopSwitcher = ({ intl }) => {
  const shopSettings = useSelector(getShopSettings);
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const [visible, setVisible] = useState();
  const [visibleFilter, setVisibleFilter] = useState();
  const title = siteName;
  const desc = mainObj?.description;
  const { canonicalUrl } = useSeoInfo();

  const firstPage = () => {
    switch (shopSettings?.type) {
      case 'user':
        return (
          <div className="shifted">
            <div className="feed-layout container Shop shifted">
              <Affix className="leftContainer" stickPosition={77}>
                <div className="left">
                  <DepartmentsUser name={shopSettings?.value} isSocial />
                  <UserFilters name={shopSettings?.value} />
                </div>
              </Affix>
              <div className="center center--withoutRigth">
                <h3 className={'ShopSwitcher__breadCrumbs'}>
                  {intl.formatMessage({ id: 'departments', defaultMessage: 'Departments' })}
                </h3>
                <DepartmentsMobile
                  type={shopSettings?.type}
                  visible={visible}
                  setVisible={vis => setVisible(vis)}
                  name={shopSettings?.value}
                  isSocial
                />
                <FiltersForMobile
                  setVisible={vis => setVisibleFilter(vis)}
                  visible={visibleFilter}
                  type={shopSettings?.type}
                  user={shopSettings?.value}
                />
                <UserShoppingList name={shopSettings?.value} isSocial />
              </div>
            </div>
          </div>
        );
      case 'object':
        return <ShopMainForWobject />;

      default:
        return <Skeleton active />;
    }
  };

  return (
    <div className={'ShopSwitcher'}>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:image" content={favicon} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={favicon} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={favicon} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      {firstPage()}
    </div>
  );
};

ShopSwitcher.fetchData = async ({ store, req }) => {
  const config = await store.dispatch(getWebsiteConfigForSSR(req.headers.host));
  const shopSettings = config.action.payload?.shopSettings;
  const promiseArray = [store.dispatch(setMainObj(shopSettings))];

  if (shopSettings?.type === 'object') {
    let wobj = { linkToObject: shopSettings?.value };
    const wobject = await getObject(shopSettings?.value);

    if (!isEmpty(wobject?.menuItem)) {
      const customSort = get(wobject, 'sortCustom.include', []);
      const menuItemPermlink = wobject?.menuItem.reduce((acc, curr) => {
        const item = parseJSON(curr?.body);

        return item?.linkToObject ? [...acc, item] : acc;
      }, []);
      const menuItems = !isEmpty(customSort)
        ? customSort.reduce((acc, curr) => {
            const findObj = wobject?.menuItem.find(item => item.permlink === curr);
            const item = parseJSON(findObj?.body);

            return findObj ? [...acc, item] : acc;
          }, [])
        : menuItemPermlink;

      wobj = menuItems[0];
    }
    promiseArray.push(
      store.dispatch(getObjectAction(wobj?.linkToObject)).then(response =>
        store.dispatch(
          getObjectPosts({
            object: wobj?.linkToObject,
            username: wobj?.linkToObject,
            limit: 20,
            newsPermlink: response?.newsFeed?.permlink,
          }),
        ),
      ),
    );
    if (wobj?.objectType) {
      promiseArray.push(store.dispatch(getWobjectDepartments(wobj?.linkToObject)));
      promiseArray.push(store.dispatch(getWobjectsShopList(wobj?.linkToObject)));
    }
  } else {
    promiseArray.push(store.dispatch(getUserDepartments(shopSettings?.value)));
    promiseArray.push(store.dispatch(getUserShopList(shopSettings?.value)));
  }

  return Promise.allSettled(promiseArray);
};

ShopSwitcher.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ShopSwitcher);
