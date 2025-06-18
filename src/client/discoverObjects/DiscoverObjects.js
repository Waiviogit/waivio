import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { isEmpty, trimEnd } from 'lodash';
import { injectIntl } from 'react-intl';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getObjectTypes } from '../../store/objectTypesStore/objectTypesActions';
import {
  getObjectTypeByStateFilters,
  setActiveFilters,
} from '../../store/objectTypeStore/objectTypeActions';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverObjectsContent from './DiscoverObjectsContent';
import ObjectsContainer from '../objects/ObjectsContainer';
import RightSidebar from '../app/Sidebar/RightSidebar';
import { getObjectTypesList } from '../../store/objectTypesStore/objectTypesSelectors';
import { getHelmetIcon, getAppHost, getWebsiteName } from '../../store/appStore/appSelectors';
import { parseTagsFilters } from './helper';

import './DiscoverObjects.less';

const DiscoverObjects = ({ intl, history, match }) => {
  const dispatch = useDispatch();
  const typesList = useSelector(getObjectTypesList, shallowEqual);
  const favicon = useSelector(getHelmetIcon);
  const host = useSelector(getAppHost);
  const siteName = useSelector(getWebsiteName);

  useEffect(() => {
    if (isEmpty(typesList)) dispatch(getObjectTypes());
  }, []);

  const isTypeChosen = Boolean(match.params.typeName);
  const title = `Discover objects - Waivio`;
  const desc = 'All objects are located here. Discover new objects!';
  const image = favicon;
  const canonicalUrl = `https://${host}/discover-objects/${match.params.typeName || ''}${
    history.location.search
  }`;

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
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
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

DiscoverObjects.fetchData = ({ match, store, query }) => {
  const activeTagsFilter = query ? parseTagsFilters(query.toString()) : {};
  const search = query ? query.get('search') : '';
  const searchFilters = {};

  if (search) searchFilters.searchString = trimEnd(search);

  if (activeTagsFilter) store.dispatch(setActiveFilters(activeTagsFilter));

  return Promise.allSettled([
    store.dispatch(getObjectTypes()),
    store.dispatch(getObjectTypeByStateFilters(match.params.typeName)),
  ]);
};

DiscoverObjects.propTypes = {
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(DiscoverObjects);
