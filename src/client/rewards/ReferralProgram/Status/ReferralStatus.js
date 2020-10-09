// import React from 'react';
// import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import './ReferralStatus.less';
import { getAuthenticatedUser, getAuthenticatedUserName, getUser } from '../../../reducers';

// const ReferralStatusView = props => {
//   // const {  } = props;
// }

const ReferralStatus = props => {
  console.log('ReferralStatus user: ', props.match.params.name);
  return null;
};

ReferralStatus.propTypes = {};

ReferralStatus.defaultProps = {};

const mapStateToProps = (state, ownProps) => ({
  user:
    ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state)
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.match.params.name),
});

export default injectIntl(connect(mapStateToProps, null)(ReferralStatus));
