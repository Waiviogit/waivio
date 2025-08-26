import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import ObjectsSidebarTablesContent from '../ObjectSidebarTablesContent/ObjectSidebarTablesContent';

const ObjectReferenceItem = ({ isCenterContent, wobject, refType, objects }) => {
  const linkTo = `/object/${wobject.author_permlink}/${refType}s`;
  const icon =
    refType === 'product' ? (
      <Icon type="codepen" className="SidebarContentBlock__icon" />
    ) : (
      <Icon type="book" className="SidebarContentBlock__icon-book" />
    );
  const title = <FormattedMessage id={`${refType}s`} defaultMessage={`${refType}s`} />;

  return (
    <div>
      <ObjectsSidebarTablesContent
        isCenterContent={isCenterContent}
        objects={objects}
        title={title}
        linkTo={linkTo}
        icon={icon}
      />
    </div>
  );
};

ObjectReferenceItem.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool.isRequired,
  refType: PropTypes.string,
  objects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ObjectReferenceItem;
