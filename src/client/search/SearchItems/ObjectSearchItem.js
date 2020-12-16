import React from 'react';
import PropTypes from 'prop-types';
import ObjectAvatar from '../../components/ObjectAvatar';
import { getObjectName, hasType, parseAddress } from '../../helpers/wObjectHelper';

const ObjectSearchItem = ({ wobj, isWebsite }) => {
  const wobjName = getObjectName(wobj);

  if (!wobjName) return null;

  const parentName = getObjectName(wobj.parent);
  const predictive = hasType(wobj, 'restaurant') ? parentName : parseAddress(wobj);
  const downText = isWebsite ? predictive : parentName;

  return (
    <React.Fragment>
      <div className="Topnav__search-content-wrap">
        <ObjectAvatar item={wobj} size={40} />
        <div>
          <div className="Topnav__search-content">{wobjName}</div>
          {downText && <div className="Topnav__search-content-small">{downText}</div>}
        </div>
      </div>
      <div className="Topnav__search-content-small">{wobj.object_type}</div>
    </React.Fragment>
  );
};

ObjectSearchItem.propTypes = {
  wobj: PropTypes.shape({
    object_type: PropTypes.string,
    parent: PropTypes.shape({}),
  }).isRequired,
  isWebsite: PropTypes.bool,
};

ObjectSearchItem.defaultProps = {
  isWebsite: false,
};

export default ObjectSearchItem;
