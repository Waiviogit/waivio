import React from 'react';
import PropTypes from 'prop-types';
import { get, has, isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { objectFields } from '../../../../../common/constants/listOfFields';
import './AffiliateSection.less';

const AffiliateSection = ({ listItem, isEditMode, wobject }) => {
  const affiliateButton = get(wobject, 'affiliateButton', '');
  const affiliateProductIdTypes = has(wobject, 'affiliateProductIdTypes')
    ? wobject?.affiliateProductIdTypes
    : [];
  const affiliateGeoAreas = has(wobject, 'affiliateGeoArea') ? wobject?.affiliateGeoArea : [];
  const affiliateCode = has(wobject, 'affiliateCode') ? JSON.parse(wobject?.affiliateCode) : [];
  const affiliateUrlTemplate = get(wobject, 'affiliateUrlTemplate');

  return (
    <>
      {isEditMode && (
        <div className=" object-sidebar__section-title">
          <FormattedMessage id="affiliate" defaultMessage="Affiliate" />
        </div>
      )}
      {listItem(
        objectFields.affiliateButton,
        !isEmpty(affiliateButton) && (
          <div>
            {!isEditMode && <div className="CompanyId__title">Affiliate button:</div>}
            <img className={'AffiliateSection__affiliate-button'} src={affiliateButton} alt="" />
          </div>
        ),
      )}{' '}
      {listItem(
        objectFields.affiliateProductIdTypes,
        !isEmpty(affiliateProductIdTypes) && (
          <div>
            {!isEditMode && <div className="CompanyId__title">Product ID types:</div>}
            {affiliateProductIdTypes.map(id => (
              <div key={id} className={'AffiliateSection__affiliate-ids'}>
                {id}
              </div>
            ))}
          </div>
        ),
      )}{' '}
      {listItem(
        objectFields.affiliateGeoArea,
        !isEmpty(affiliateGeoAreas) && (
          <div>
            {!isEditMode && <div className="CompanyId__title">GEO areas:</div>}
            {affiliateGeoAreas.map(area => (
              <div key={area} className={'AffiliateSection__affiliate-ids'}>
                {area}
              </div>
            ))}
          </div>
        ),
      )}{' '}
      {listItem(
        objectFields.affiliateUrlTemplate,
        <div>
          {' '}
          {!isEditMode && <div className="CompanyId__title">URL template:</div>}
          {affiliateUrlTemplate}
        </div>,
      )}{' '}
      {listItem(
        objectFields.affiliateCode,
        <div>
          {!isEditMode && <div className="CompanyId__title">My affiliate code:</div>}
          {affiliateCode.map(code => (
            <div key={code}>{code}</div>
          ))}
        </div>,
      )}
    </>
  );
};

AffiliateSection.propTypes = {
  listItem: PropTypes.func.isRequired,
  wobject: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default AffiliateSection;
