import React, { useEffect, useState } from 'react';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import { sortByFieldPermlinksList } from '../../../../common/helpers/wObjectHelper';
import ObjectsSidebarTablesContent from '../ObjectSidebarTablesContent/ObjectSidebarTablesContent';

const ObjectsSimilar = ({ wobject, isCenterContent }) => {
  const [similarObjects, setSimilarObjects] = useState([]);
  const similar = get(wobject, 'similar', []);
  const similarObjectsPermlinks = !isEmpty(similar) ? similar.map(obj => obj.body) : [];
  const sortedSimilarObjects = sortByFieldPermlinksList(similarObjectsPermlinks, similarObjects);
  const title = <FormattedMessage id="object_field_similar" defaultMessage="Similar" />;
  const linkTo = `/object/${wobject.author_permlink}/similar`;
  const icon = <Icon type="block" className="iconfont icon-link SidebarContentBlock__icon" />;

  useEffect(() => {
    if (!isEmpty(similar)) {
      getObjectInfo(similarObjectsPermlinks).then(res => setSimilarObjects(res.wobjects));
    }
  }, [wobject.similar]);

  return (
    <div>
      <ObjectsSidebarTablesContent
        isCenterContent={isCenterContent}
        objects={sortedSimilarObjects}
        title={title}
        linkTo={linkTo}
        icon={icon}
      />
    </div>
  );
};

ObjectsSimilar.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsSimilar;
