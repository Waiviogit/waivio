import React from 'react';
import PropTypes from 'prop-types';
import { get, has, isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { objectFields } from '../../../../../common/constants/listOfFields';
import './AffiliateSection.less';
import RateInfo from '../../../../components/Sidebar/Rate/RateInfo';
import {
  allContinents,
  allCountries,
} from '../../../../object/AppendModal/AppendModalData/affiliateData';
import AffiliatLink from '../../../../widgets/AffiliatLinks/AffiliatLink';

const AffiliateSection = ({ listItem, isEditMode, wobject, userName }) => {
  const affiliateButton = get(wobject, 'affiliateButton', '');
  const link = { link: affiliateButton, image: affiliateButton };
  const affiliateProductIdTypes = has(wobject, 'affiliateProductIdTypes')
    ? wobject?.affiliateProductIdTypes
    : [];
  const affiliateGeoAreas = has(wobject, 'affiliateGeoArea') ? wobject?.affiliateGeoArea : [];
  let affiliateCode = [];

  if (has(wobject, 'affiliateCode')) {
    try {
      const parsed = JSON.parse(wobject?.affiliateCode);

      if (Array.isArray(parsed)) {
        affiliateCode = parsed;
      }
    } catch (e) {
      affiliateCode = [];
    }
  }
  const [affiliateSite, affCode] = affiliateCode;
  const affiliateUrlTemplate = get(wobject, 'affiliateUrlTemplate', '')
    ?.replace('$productId', 'PRODUCTID')
    ?.replace('$affiliateCode', 'AFFILIATECODE');

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
            <AffiliatLink link={link} disabled />
            {/* <img className={'AffiliateSection__affiliate-button'} src={affiliateButton} alt="" /> */}
          </div>
        ),
      )}{' '}
      {listItem(
        objectFields.affiliateProductIdTypes,
        !isEmpty(affiliateProductIdTypes) && (
          <div>
            {!isEditMode && <div className="CompanyId__title">Product ID type:</div>}
            {affiliateProductIdTypes?.map(id => (
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
            {!isEditMode && <div className="CompanyId__title">GEO area:</div>}
            {affiliateGeoAreas?.map(area => (
              <div key={area} className={'AffiliateSection__affiliate-ids'}>
                {{ ...allCountries, ...allContinents }[area]}
              </div>
            ))}
          </div>
        ),
      )}{' '}
      {listItem(
        objectFields.affiliateUrlTemplate,
        !isEmpty(affiliateUrlTemplate) && (
          <div>
            {' '}
            {!isEditMode && <div className="CompanyId__title">URL template:</div>}
            {affiliateUrlTemplate}
          </div>
        ),
      )}{' '}
      {listItem(
        objectFields.affiliateCode,
        !isEmpty(affiliateCode) && (
          <div>
            {!isEditMode && <div className="CompanyId__title">Affiliate code:</div>}
            <div>{affiliateSite}</div>
            <div>{affCode}</div>
          </div>
        ),
      )}
      {!isEditMode &&
        listItem(
          objectFields.rating,
          has(wobject, 'rating') && (
            <RateInfo username={userName} authorPermlink={wobject.author_permlink} />
          ),
        )}
    </>
  );
};

AffiliateSection.propTypes = {
  listItem: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  wobject: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default AffiliateSection;
