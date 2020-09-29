import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { referralDetailContent } from './ReferralTextHelper';

const ReferralDetail = () => {
  const {
    detailTitle,
    detailDescription,
    detailsCommissionsTitle,
    detailsCommissionsDescription,
  } = referralDetailContent();

  return (
    <div className="ReferralDetail">
      <h2 className="ReferralDetail__title">{detailTitle}</h2>
      <div className="ReferralDetail__description">{detailDescription}</div>
      <div className="ReferralDetail__commissions-title">{detailsCommissionsTitle}</div>
      <div className="ReferralDetail__commissions-description">{detailsCommissionsDescription}</div>
    </div>
  );
};

ReferralDetail.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

ReferralDetail.defaultProps = {};

const mapStateToProps = state => ({
  empty: `${state}`,
});

export default injectIntl(connect(mapStateToProps, null)(ReferralDetail));
