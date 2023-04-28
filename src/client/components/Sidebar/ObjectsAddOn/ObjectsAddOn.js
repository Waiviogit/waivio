import React, { useEffect, useState } from 'react';
import { isEmpty, get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import { sortByFieldPermlinksList } from '../../../../common/helpers/wObjectHelper';
import ObjectsSidebarTablesContent from '../ObjectSidebarTablesContent/ObjectSidebarTablesContent';

const ObjectsAddOn = ({ wobject, isCenterContent }) => {
  const [addOnObjects, setAddOnObjects] = useState([]);
  const addOn = get(wobject, 'addOn', []);
  const addOnObjectsPermlinks = !isEmpty(addOn) ? addOn.map(obj => obj.body) : [];
  const sortedAddOnObjects = sortByFieldPermlinksList(addOnObjectsPermlinks, addOnObjects);
  const title = <FormattedMessage id="object_field_addOn" defaultMessage="Add-on" />;
  const linkTo = `/object/${wobject.author_permlink}/add-on`;
  const icon = (
    <a>
      <img
        src={'/images/icons/add-on-icon.svg'}
        style={{ width: '18px', height: '18px' }}
        alt="add on icon"
        className="iconfont SidebarContentBlock__icon"
      />
    </a>
  );

  useEffect(() => {
    if (!isEmpty(addOn)) {
      getObjectInfo(addOnObjectsPermlinks).then(res => setAddOnObjects(res.wobjects));
    }
  }, [wobject.addOn]);

  return (
    <div>
      <ObjectsSidebarTablesContent
        isCenterContent={isCenterContent}
        objects={sortedAddOnObjects}
        title={title}
        linkTo={linkTo}
        icon={icon}
      />
    </div>
  );
};

ObjectsAddOn.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsAddOn;
