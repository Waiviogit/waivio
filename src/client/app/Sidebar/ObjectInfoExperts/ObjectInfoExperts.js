import React from 'react';
import PropTypes from 'prop-types';

import WobjectNearby from './WobjectNearby';
import WobjectSidebarFollowers from './WobjectSidebarFollowers';
import ObjectExpertise from '../../../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../../../components/Sidebar/ObjectsRelated/ObjectsRelated';

import './ObjectInfoExperts.less';

const ObjectInfoExperts = ({ wobject }) => (
  <div className="objectInfo">
    <div className="objectInfo__experts">
      <ObjectExpertise wobject={wobject} isCenterContent />
    </div>
    <div className="objectInfo__related">
      {wobject.author_permlink && wobject.map && (
        <WobjectNearby wobject={wobject} isCenterContent />
      )}
    </div>
    <div className="objectInfo__related">
      {wobject.author_permlink && <ObjectsRelated wobject={wobject} isCenterContent />}
    </div>
    <div className="objectInfo__followers">
      <WobjectSidebarFollowers wobject={wobject} isCenterContent />
    </div>
  </div>
);

ObjectInfoExperts.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default ObjectInfoExperts;
