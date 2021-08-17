import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getObjectTypes } from '../../store/objectTypesStore/objectTypesActions';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverObjectsContent from './DiscoverObjectsContent';
import ObjectsContainer from '../objects/ObjectsContainer';
import RightSidebar from '../app/Sidebar/RightSidebar';
import { getObjectTypesList } from '../../store/objectTypesStore/objectTypesSelectors';
import { getHelmetIcon } from '../../store/appStore/appSelectors';

import './DiscoverObjects.less';

const DiscoverObjects = ({ intl, history, match }) => {
  const dispatch = useDispatch();
  const typesList = useSelector(getObjectTypesList, shallowEqual);
  const favicon = useSelector(getHelmetIcon);

  useEffect(() => {
    if (isEmpty(typesList)) dispatch(getObjectTypes());
  }, []);

  const isTypeChosen = Boolean(match.params.typeName);
  const title = `Discover objects - Waivio`;
  const desc = 'All objects are located here. Discover new objects!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';
  const canonicalUrl = 'https://www.waivio.com/rewards/all';

  return (
    <div className="shifted">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content="Waivio" />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <div className="feed-layout container">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        {isTypeChosen && (
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <RightSidebar />
            </div>
          </Affix>
        )}
        <div className={`discover-objects${isTypeChosen ? ' center' : ''}`}>
          {match.params.typeName ? (
            <DiscoverObjectsContent
              history={history}
              match={match}
              location={history.location}
              typeName={match.params.typeName}
              intl={intl}
              key={match.params.typeName}
            />
          ) : (
            <ObjectsContainer />
          )}
        </div>
      </div>
    </div>
  );
};

DiscoverObjects.propTypes = {
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(DiscoverObjects);
