import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { objectFields } from '../../../../common/constants/listOfFields';
import Department from '../../../object/Department/Department';
import ProductId from '../../../app/Sidebar/ProductId';

const ProductDetails = ({
  fields,
  listItem,
  productWeight,
  departments,
  wobject,
  history,
  groupId,
  dimensions,
  productIdBody,
}) => (
  <div className="SocialProduct__productDetails">
    <div className="SocialProduct__heading">Product details</div>
    <div className="SocialProduct__productDetails-content SocialProduct__contentPaddingLeft">
      {!isEmpty(fields.brandObject) && listItem(objectFields.brand, fields.brandObject)}
      {!isEmpty(fields.manufacturerObject) &&
        listItem(objectFields.manufacturer, fields.manufacturerObject)}
      {!isEmpty(fields.merchantObject) && listItem(objectFields.merchant, fields.merchantObject)}
      {!isEmpty(parent) && listItem(objectFields.parent, parent)}
      {!isEmpty(productWeight) && listItem(objectFields.productWeight, productWeight)}
      {!isEmpty(dimensions) && listItem(objectFields.dimensions, dimensions)}
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
  listItem: PropTypes.func,
  departments: PropTypes.arrayOf(),
  groupId: PropTypes.arrayOf(),
};

export default ProductDetails;
