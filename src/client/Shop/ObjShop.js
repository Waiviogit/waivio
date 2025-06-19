import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { setGoogleTagEvent } from '../../common/helpers';

import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';

import RightSidebar from '../app/Sidebar/RightSidebar';
import { getHelmetIcon, getMainObj, getSiteName } from '../../store/appStore/appSelectors';
import {
  getGlobalDepartments,
  getUserDepartments,
  getUserShopList,
  getWobjectDepartments,
  getWobjectsShopList,
  resetBreadCrumb,
} from '../../store/shopStore/shopActions';
import { useSeoInfo } from '../../hooks/useSeoInfo';
import { getUserShopSchema } from '../../common/helpers/shopHelper';
import ObjectDepartmentsWobjList from '../object/ObjectTypeShop/ObjectDepartmentsWobjList';

const ObjShop = isSocial => {
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const dispatch = useDispatch();
  const title = `Shop`;
  const desc = isSocial ? mainObj?.description : 'Find and buy easily. Shop with pleasure!';
  const { canonicalUrl } = useSeoInfo();

  useEffect(() => {
    setGoogleTagEvent('view_mainshop');

    return () => dispatch(resetBreadCrumb());
  }, []);

  return (
    <div className="shifted">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={`@${siteName}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={favicon} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={favicon} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={favicon} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <div className="feed-layout container Shop">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div
          className={classNames('center', {
            'center--withoutRigth': isSocial,
          })}
        >
          <ObjectDepartmentsWobjList isSocial={isSocial} />
        </div>
        {!isSocial && (
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <RightSidebar />
            </div>
          </Affix>
        )}
      </div>
    </div>
  );
};

ObjShop.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.shape(),
    isSocial: PropTypes.bool,
  }),
};

ObjShop.fetchData = ({ store, match, url }) => {
  if (match.params[0] === 'user-shop') {
    const schema = getUserShopSchema(url);

    return Promise.allSettled([
      store.dispatch(getUserDepartments(match.params.name, schema)),
      store.dispatch(getUserShopList(match.params.name, schema)),
    ]);
  }

  if (match.params[0] === 'object-shop') {
    return Promise.allSettled([
      store.dispatch(getWobjectDepartments(match.params.name)),
      store.dispatch(getWobjectsShopList(match.params.name)),
    ]);
  }

  return store.dispatch(getGlobalDepartments(match.params.name));
};

export default withRouter(ObjShop);
