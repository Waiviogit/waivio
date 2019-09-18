import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
// import DiscoverFiltersSidebar from './DiscoverFiltersSidebar/DiscoverFiltersSidebar';
import DiscoverObjectsContent from './DiscoverObjectsContent';
import ObjectsContainer from '../objects/ObjectsContainer';
import './DiscoverObjects.less';
import ObjectExpertiseByType from '../components/Sidebar/ObjectExpertiseByType/ObjectExpertiseByType';

const DiscoverObjects = ({ intl, history, match }) => {
  const isTypeChosen = Boolean(match.params.typeName);
  const { pathname, search } = history.location;
  console.log('Started!');
  return (
    <div className="shifted">
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'objects_title', defaultMessage: 'Discover objects' })} - Waivio
        </title>
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
              <ObjectExpertiseByType typeName={match.params.typeName} />
            </div>
          </Affix>
        )}
        <div className={`discover-objects${isTypeChosen ? ' center' : ''}`}>
          {match.params.typeName ? (
            <DiscoverObjectsContent
              history={history}
              typeName={match.params.typeName}
              key={pathname + search}
              intl={intl}
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
