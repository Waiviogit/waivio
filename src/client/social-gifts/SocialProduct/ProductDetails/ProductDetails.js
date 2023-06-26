import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { objectFields } from '../../../../common/constants/listOfFields';
import Department from '../../../object/Department/Department';
import ProductId from '../../../app/Sidebar/ProductId';
import SocialListItem from '../SocialListItem/SocialListItem';

const ProductDetails = ({
  fields,
  productWeight,
  departments,
  wobject,
  history,
  groupId,
  dimensions,
  productIdBody,
  parent,
}) => (
  <div className="SocialProduct__productDetails">
    <div className="SocialProduct__heading">Product details</div>
    <div className="SocialProduct__productDetails-content SocialProduct__contentPaddingLeft">
      {!isEmpty(fields.brandObject) && (
        <SocialListItem fieldName={objectFields.brand} field={fields.brandObject} />
      )}
      {!isEmpty(fields.manufacturerObject) && (
        <SocialListItem fieldName={objectFields.manufacturer} field={fields.manufacturerObject} />
      )}
      {!isEmpty(fields.merchantObject) && (
        <SocialListItem fieldName={objectFields.merchant} field={fields.merchantObject} />
      )}
      {!isEmpty(parent) && <SocialListItem fieldName={objectFields.parent} field={parent} />}
      {!isEmpty(productWeight) && (
        <SocialListItem fieldName={objectFields.productWeight} field={productWeight} />
      )}
      {!isEmpty(dimensions) && (
        <SocialListItem fieldName={objectFields.dimensions} field={dimensions} />
      )}
      {!isEmpty(departments) && (
        <Department
          isSocialGifts
          departments={departments}
          isEditMode={false}
          history={history}
          wobject={wobject}
        />
      )}
      {
        <ProductId
          isSocialGifts
          isEditMode={false}
          authorPermlink={wobject.author_permlink}
          groupId={groupId}
          productIdBody={productIdBody}
        />
      }
    </div>
  </div>
);

ProductDetails.propTypes = {
  fields: PropTypes.shape(),
  wobject: PropTypes.shape(),
  productWeight: PropTypes.shape(),
  productIdBody: PropTypes.arrayOf(),
  dimensions: PropTypes.shape(),
  history: PropTypes.shape(),
  parent: PropTypes.shape(),
  departments: PropTypes.arrayOf(),
  groupId: PropTypes.arrayOf(),
};

export default ProductDetails;
