import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import WobjectNearby from './WobjectNearby';
import WobjectSidebarFollowers from './WobjectSidebarFollowers';
import ObjectExpertise from '../../../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../../../components/Sidebar/ObjectsRelated/index';
import ObjectsAddOn from '../../../components/Sidebar/ObjectsAddOn/ObjectsAddOn';
import ObjectsSimilar from '../../../components/Sidebar/ObjectsSimilar/ObjectsSimilar';
import ObjectReference from '../../../components/Sidebar/ObjectReference/ObjectReference';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import './ObjectInfoExperts.less';
import ObjectsFeatured from '../../../components/Sidebar/ObjectsFeatured/ObjectsFeatured';

const ObjectInfoExperts = ({ wobject }) => {
  const referenceWobjType = ['business', 'place', 'person'].includes(wobject.object_type);
  const showContent = isMobile() && !isEmpty(wobject.author_permlink);

  return (
    <div className="objectInfo">
      <div className="objectInfo__related">
        {showContent && <ObjectsFeatured wobject={wobject} isCenterContent />}
      </div>{' '}
      <div className="objectInfo__related">
        {showContent && <ObjectsAddOn wobject={wobject} isCenterContent />}
      </div>
      <div className="objectInfo__related">
        {showContent && <ObjectsRelated wobject={wobject} isCenterContent />}
      </div>
      <div className="objectInfo__related">
        {showContent && <ObjectsSimilar wobject={wobject} isCenterContent />}
      </div>
      <div className="objectInfo__related">
        {showContent && referenceWobjType && <ObjectReference wobject={wobject} isCenterContent />}
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
