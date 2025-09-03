import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { objectFields } from '../../../../common/constants/listOfFields';
import Department from '../../../object/Department/Department';
import ProductId from '../../../app/Sidebar/ProductId';
import SocialListItem from '../SocialListItem/SocialListItem';

const ProductDetails = ({
  website,
  fields,
  productWeight,
  departments,
  wobject,
  history,
  groupId,
  dimensions,
  setLinkSafety,
  productIdBody,
  parent,
  ageRange,
  language,
  publicationDate,
  printLength,
  publisher,
  publisherObject,
  intl,
}) => {
  const newPublisher = { ...publisherObject, name: publisher?.name || publisherObject?.name };

  return (
    <div className="SocialProduct__productDetails">
      <div className="SocialProduct__heading">
        {intl.formatMessage({ id: 'product_details', defaultMessage: 'Product details' })}
      </div>
      <div className="SocialProduct__productDetails-content SocialProduct__contentPaddingLeft">
        {!isEmpty(publisherObject) && (
          <SocialListItem fieldName={objectFields.publisher} field={newPublisher} />
        )}

        {!isEmpty(fields.manufacturerObject) && (
          <SocialListItem fieldName={objectFields.manufacturer} field={fields.manufacturerObject} />
        )}
        {!isEmpty(fields.merchantObject) && (
          <SocialListItem fieldName={objectFields.merchant} field={fields.merchantObject} />
        )}
        {!isEmpty(parent) && <SocialListItem fieldName={objectFields.parent} field={parent} />}
        {!isEmpty(ageRange) && (
          <SocialListItem fieldName={objectFields.ageRange} field={ageRange} />
        )}
        {!isEmpty(language) && (
          <SocialListItem fieldName={objectFields.language} field={language} />
        )}
        {!isEmpty(wobject.publicationDate) && (
          <SocialListItem fieldName={objectFields.publicationDate} field={publicationDate} />
        )}
        {!isEmpty(printLength) && (
          <SocialListItem fieldName={objectFields.printLength} field={printLength} />
        )}
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
        {(groupId || Boolean(productIdBody.length)) && (
          <div style={{ marginBottom: '8px' }}>
            <ProductId
              isSocialGifts
              isEditMode={false}
              authorPermlink={wobject.author_permlink}
              groupId={groupId}
              productIdBody={productIdBody}
            />
          </div>
        )}
        {!isEmpty(website) && (
          <SocialListItem
            fieldName={objectFields.website}
            field={website}
            setLinkSafety={setLinkSafety}
          />
        )}
      </div>
    </div>
  );
};

ProductDetails.propTypes = {
  fields: PropTypes.shape(),
  wobject: PropTypes.shape(),
  productWeight: PropTypes.shape(),
  productIdBody: PropTypes.arrayOf(PropTypes.shape()),
  dimensions: PropTypes.shape(),
  history: PropTypes.shape(),
  parent: PropTypes.shape(),
  website: PropTypes.shape(),
  publisher: PropTypes.shape(),
  departments: PropTypes.arrayOf(PropTypes.shape()),
  groupId: PropTypes.arrayOf(PropTypes.shape()),
  publisherObject: PropTypes.shape(),
  ageRange: PropTypes.string,
  language: PropTypes.string,
  publicationDate: PropTypes.string,
  printLength: PropTypes.string,
  setLinkSafety: PropTypes.func,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ProductDetails);
