import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { objAuthorPermlink } from '../SocialProductHelper';
import { objectFields } from '../../../../common/constants/listOfFields';

const SocialListItem = ({ fieldName, field }) => {
  const getLayout = () => {
    switch (fieldName) {
      case objectFields.parent:
      case objectFields.merchant:
      case objectFields.brand:
      case objectFields.manufacturer:
        return objAuthorPermlink(field) ? (
          <Link to={`/object/product/${objAuthorPermlink(field)}`}>{field.name}</Link>
        ) : (
          <span>{field.name}</span>
        );
      case objectFields.productWeight:
        return (
          <span>
            {field.value} {field.unit}
          </span>
        );

      case objectFields.dimensions:
        return (
          <span>
            {field.length} x {field.width} x {field.depth} {field.unit}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="paddingBottom">
      <b>
        <FormattedMessage id={`object_field_${fieldName}`} defaultMessage={fieldName} />:{' '}
      </b>
      {getLayout(fieldName, field)}
    </div>
  );
};

SocialListItem.propTypes = {
  fieldName: PropTypes.string,
  field: PropTypes.shape(),
};

export default SocialListItem;
