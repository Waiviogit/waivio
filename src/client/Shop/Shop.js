import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import classNames from 'classnames';

import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';

import RightSidebar from '../app/Sidebar/RightSidebar';
import { getHelmetIcon, getMainObj, getSiteName } from '../../store/appStore/appSelectors';
import { resetBreadCrumb } from '../../store/shopStore/shopActions';

const Shop = ({ route }) => {
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const dispatch = useDispatch();
  const title = `Shop - ${siteName}`;
  const desc = route.isSocial ? mainObj?.description : 'Find and buy easily. Shop with pleasure!';

  useEffect(() => () => dispatch(resetBreadCrumb()), []);

  return (
    <div className="shifted">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={favicon} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={favicon} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content="Waivio" />
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
            'center--withoutRigth': route.isSocial,
          })}
        >
          {renderRoutes(route.routes, {
            isSocial: route.isSocial,
          })}
        </div>
        {!route.isSocial && (
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

Shop.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.shape(),
    isSocial: PropTypes.bool,
  }),
};

export default withRouter(Shop);
