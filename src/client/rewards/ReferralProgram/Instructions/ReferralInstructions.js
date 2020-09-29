// import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getBlacklist } from '../../rewardsActions';
import { getAuthenticatedUserName } from '../../../reducers';

// const handleUserBlackList = () => {
//
// }

const ReferralInstructions = props => {
  props.getBlacklist('vallon').then(res => console.log('log: ', res));
  console.log('authUserName: ', props.authUserName);
  return null;
};

ReferralInstructions.propTypes = {
  getBlacklist: PropTypes.func.isRequired,
};

ReferralInstructions.defaultProps = {};

const mapStateToProps = state => ({
  authUserName: getAuthenticatedUserName(state),
});

export default injectIntl(
  connect(mapStateToProps, {
    getBlacklist,
  })(ReferralInstructions),
);
