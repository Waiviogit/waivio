import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getObjectTypesList } from '../reducers';
import { getObjectTypes } from '../objectTypes/objectTypesActions';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverObjectsContent from './DiscoverObjectsContent';
import ObjectsContainer from '../objects/ObjectsContainer';
import RightSidebar from '../app/Sidebar/RightSidebar';
import './DiscoverObjects.less';

const DiscoverObjects = ({ intl, history, match }) => {
  const dispatch = useDispatch();
  const typesList = useSelector(getObjectTypesList, shallowEqual);

  useEffect(() => {
    if (isEmpty(typesList)) dispatch(getObjectTypes());
  }, []);

  const isTypeChosen = Boolean(match.params.typeName);
  const { pathname, search } = history.location;
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
              <RightSidebar />
            </div>
          </Affix>
        )}
        <div className={`discover-objects${isTypeChosen ? ' center' : ''}`}>
          {match.params.typeName ? (
            <DiscoverObjectsContent
              history={history}
              match={match}
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
