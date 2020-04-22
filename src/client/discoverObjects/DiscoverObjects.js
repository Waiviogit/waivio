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
        <meta
          name="og:image"
          property="og:image"
          content={
            'https://waivio.nyc3.digitaloceanspaces.com/1586860195_f1e17c2d-5138-4462-9a6d-5468276e208e'
          }
        />
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
