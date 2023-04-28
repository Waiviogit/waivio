import React from 'react';
import PropTypes from 'prop-types';

import WobjectNearby from './WobjectNearby';
import WobjectSidebarFollowers from './WobjectSidebarFollowers';
import ObjectExpertise from '../../../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../../../components/Sidebar/ObjectsRelated/index';
import ObjectsAddOn from '../../../components/Sidebar/ObjectsAddOn/ObjectsAddOn';
import ObjectsSimilar from '../../../components/Sidebar/ObjectsSimilar/ObjectsSimilar';
import ObjectReference from '../../../components/Sidebar/ObjectReference/ObjectReference';
import './ObjectInfoExperts.less';

const ObjectInfoExperts = ({ wobject }) => {
  const referenceWobjType = ['business', 'person'].includes(wobject.object_type);

  return (
    <div className="objectInfo">
      <div className="objectInfo__related">
        {wobject.author_permlink && <ObjectsRelated wobject={wobject} isCenterContent />}
      </div>
      <div className="objectInfo__related">
        {wobject.author_permlink && <ObjectsAddOn wobject={wobject} isCenterContent />}
      </div>
      <div className="objectInfo__related">
        {wobject.author_permlink && <ObjectsSimilar wobject={wobject} isCenterContent />}
      </div>
      <div className="objectInfo__related">
        {wobject.author_permlink && referenceWobjType && (
          <ObjectReference wobject={wobject} isCenterContent />
        )}
      </div>
      <div className="objectInfo__experts">
        <ObjectExpertise wobject={wobject} isCenterContent />
      </div>
      <div className="objectInfo__related">
        {wobject.author_permlink && wobject.map && (
          <WobjectNearby wobject={wobject} isCenterContent />
        )}
      </div>
      <div className="objectInfo__followers">
        <WobjectSidebarFollowers wobject={wobject} isCenterContent />
      </div>
    </div>
  );
};

ObjectInfoExperts.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default ObjectInfoExperts;
