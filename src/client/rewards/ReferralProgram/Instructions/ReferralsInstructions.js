import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
// import { Checkbox } from 'antd';

import { getAuthenticatedUserName, getIsUserInWaivioBlackList } from '../../../reducers';
import { getIsUserInBlackList } from '../../rewardsActions';
import { referralInstructionsContent } from '../ReferralTextHelper';

import './ReferralsInstructions.less';

const ReferralsInstructions = props => {
  const { authUserName, getUserInBlackList, isBlackListUser } = props;
  useEffect(() => {
    getUserInBlackList(authUserName);
  }, []);

  const data = {
    username: authUserName,
  };

  const {
    instructionsTitle,
    instructionsBlackListContent,
    instructionsDescription,
    instructionsConditions,
  } = referralInstructionsContent(data);

  return (
    <div className="ReferralInstructions">
      <h2 className="ReferralInstructions__title">{instructionsTitle}</h2>
      {isBlackListUser ? (
        <div className="ReferralInstructions__is-blacklist">{instructionsBlackListContent}</div>
      ) : (
        <div className="ReferralInstructions__description">{instructionsDescription}</div>
      )}
      <div className="ReferralInstructions__condition-content">{instructionsConditions}</div>
    </div>
  );
};

ReferralsInstructions.propTypes = {
  authUserName: PropTypes.string,
  isBlackListUser: PropTypes.bool,
  getUserInBlackList: PropTypes.func.isRequired,
};

ReferralsInstructions.defaultProps = {
  authUserName: '',
  isBlackListUser: false,
};

const mapStateToProps = state => ({
  authUserName: getAuthenticatedUserName(state),
  isBlackListUser: getIsUserInWaivioBlackList(state),
});

export default injectIntl(
  connect(mapStateToProps, {
    getUserInBlackList: getIsUserInBlackList,
  })(ReferralsInstructions),
);
