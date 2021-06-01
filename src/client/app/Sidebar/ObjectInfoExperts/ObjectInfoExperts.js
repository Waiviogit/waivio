import React from 'react';
import PropTypes from 'prop-types';

import WobjectSidebarFollowers from './WobjectSidebarFollowers';
import ObjectExpertise from '../../../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../../../components/Sidebar/ObjectsRelated/ObjectsRelated';

import './ObjectInfoExperts.less';

const ObjectInfoExperts = ({ wobject, userName }) => (
  <div className="objectInfo">
    <div className="objectInfo__experts">
      <ObjectExpertise wobject={wobject} username={userName} isCenterContent />
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
  userName: PropTypes.string.isRequired,
};

export default ObjectInfoExperts;
