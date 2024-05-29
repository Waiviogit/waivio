import React from 'react';
import { Icon } from 'antd';
import { has, identity, isEmpty, pickBy } from 'lodash';
import PropTypes from 'prop-types';
import { linkFields, objectFields } from '../../../../common/constants/listOfFields';
import { accessTypesArr, haveAccess } from '../../../../common/helpers/wObjectHelper';
import { getLink } from '../../../object/wObjectHelper';

import SocialLinks from '../../../components/SocialLinks';
import CompanyId from '../../../app/Sidebar/CompanyId';
import { isMobile } from '../../../../common/helpers/apiHelpers';

const BusinessDetails = ({
  isEditMode,
  phones,
  wobject,
  username,
  website,
  linkField,
  companyIdBody,
  email,
}) => {
  const profile = linkField
    ? {
        facebook: linkField[linkFields.linkFacebook] || '',
        twitter: linkField[linkFields.linkTwitter] || '',
        youtube: linkField[linkFields.linkYouTube] || '',
        instagram: linkField[linkFields.linkInstagram] || '',
        github: linkField[linkFields.linkGitHub] || '',
      }
    : {};
  const accessExtend = haveAccess(wobject, username, accessTypesArr[0]) && isEditMode;
  const getFieldLayout = (fieldName, params) => {
    const { body } = params;

    switch (fieldName) {
      case objectFields.phone:
        return (
          <div key={`tel:${params.number}`} className={'phone mb5px'}>
            <Icon type="phone" className="text-icon tel" /> {Boolean(params.body) && body}{' '}
            <a href={`tel:${params.number}`} className={body ? 'phone-number' : ''}>
              {params.number}
            </a>
          </div>
        );
      default:
        break;
    }

    return null;
  };

  return (
    <div className={'BusinessDetails__margin-b'}>
      <div className={'BusinessObject__contact-details'}>
        <React.Fragment>
          {phones.length > 0 && (
            <div>
              {phones?.map(({ body, number }) =>
                getFieldLayout(objectFields.phone, { body, number }),
              )}{' '}
            </div>
          )}
          {email && (
            <div className={'BusinessObject__email mb5px'}>
              <Icon type="mail" className="text-icon email" />
              <span>{accessExtend ? email : <a href={`mailto:${email}`}> {email}</a>}</span>
            </div>
          )}
          {website && (
            <div className="BusinessObject__website field-website mb5px ">
              <span className="field-website__title">
                <i className="iconfont icon-link text-icon link" />
                <a target="_blank" rel="noopener noreferrer" href={getLink(website.link)}>
                  {website.title}
                </a>
              </span>
            </div>
          )}
          {has(wobject, 'link') && (
            <div
              className={`BusinessObject__links ${!isMobile() ? 'BusinessObject__margin-b' : ''}`}
            >
              <SocialLinks isSocial profile={pickBy(profile, identity)} />
            </div>
          )}
        </React.Fragment>
      </div>
      {!isEmpty(companyIdBody) && (
        <div className={'BusinessObject__margin-b'}>
          {!isEditMode
            ? companyIdBody.length > 0 && <CompanyId companyIdBody={companyIdBody} isSocial />
            : companyIdBody?.map(obj => (
                <div
                  key={`${obj.companyId}-${obj.companyIdType}`}
                  className="CompanyId__block-item"
                >
                  <p className="CompanyId__p">{obj.companyIdType}</p>
                  <p className="CompanyId__p">{obj.companyId}</p>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

BusinessDetails.propTypes = {
  phones: PropTypes.arrayOf(),
  companyIdBody: PropTypes.arrayOf(),
  wobject: PropTypes.shape().isRequired,
  website: PropTypes.shape(),
  linkField: PropTypes.shape(),
  isEditMode: PropTypes.bool,
  email: PropTypes.string,
  username: PropTypes.string.isRequired,
};

export default BusinessDetails;
