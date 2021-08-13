import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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
import Seo from '../SEO/Seo';

import './DiscoverObjects.less';

const DiscoverObjects = ({ intl, history, match }) => {
  const dispatch = useDispatch();
  const typesList = useSelector(getObjectTypesList, shallowEqual);

  useEffect(() => {
    if (isEmpty(typesList)) dispatch(getObjectTypes());
  }, []);

  const isTypeChosen = Boolean(match.params.typeName);
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';

  return (
    <div className="shifted">
      <Seo
        image={image}
        desc={'All objects are located here. Discover new objects!'}
        title={'Discover objects'}
        params={'/discover-objects/hashtag'}
      />
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
