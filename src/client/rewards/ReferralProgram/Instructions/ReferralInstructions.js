// import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getAuthenticatedUserName } from '../../../reducers';

const ReferralInstructions = () => null;

ReferralInstructions.propTypes = {
  getBlacklist: PropTypes.func.isRequired,
};

ReferralInstructions.defaultProps = {};

const mapStateToProps = state => ({
  authUserName: getAuthenticatedUserName(state),
});

export default injectIntl(connect(mapStateToProps, null)(ReferralInstructions));
