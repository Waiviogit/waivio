import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  getIsUserInBlackList,
  getUserReferralInfo,
  referralConfirmRules,
  referralRejectRules,
} from '../ReferralActions';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsStartChangeRules,
  getIsStartGetReferralInfo,
  getIsUserInWaivioBlackList,
  getReferralStatus,
  isGuestUser,
} from '../../../reducers';
import { referralInstructionsContent } from '../ReferralTextHelper';
import ReferralsInstructionsView from './ReferralInstructionsView';
import { getCopyTextButtonResult, widget } from '../ReferralHelper';

import './ReferralsInstructions.less';

const handleCopyTextButton = (setIsCopyButton, authUserName) =>
  getCopyTextButtonResult(setIsCopyButton, authUserName);

const ReferralsInstructions = props => {
  const {
    authUserName,
    getUserInBlackList,
    isBlackListUser,
    isAuthenticated,
    isGuest,
    confirmRules,
    rejectRules,
    userReferralInfo,
    referralStatus,
    isStartChangeRules,
    isStartGetReferralInfo,
  } = props;
  const [isModal, setIsModal] = useState(false);
  const [isCopyButton, setIsCopyButton] = useState(false);

  const currentStatus = !!(referralStatus && referralStatus === 'activated');

  useEffect(() => {
    userReferralInfo(authUserName);
    getUserInBlackList(authUserName);
  }, []);

  const handleAgreeRulesCheckbox = () => {
    if (currentStatus && !isModal) {
      setIsModal(true);
    }
    if (!currentStatus) {
      return confirmRules(authUserName, isGuest);
    }

    return null;
  };

  const handleClickOnCheckbox = () => {
    if (isModal) {
      setIsModal(false);
    }
  };

  const { copyButtonText, copyButtonCopiedText } = referralInstructionsContent(authUserName);

  const currentCopyText = isCopyButton ? copyButtonCopiedText : copyButtonText;

  setTimeout(() => setIsCopyButton(false), 3000);

  const mainProps = {
    isBlackListUser,
    isAuthenticated,
    rejectRules,
    isStartChangeRules,
    isStartGetReferralInfo,
    handleAgreeRulesCheckbox,
    handleClickOnCheckbox,
    currentCopyText,
    authUserName,
    isModal,
    isGuest,
    currentStatus,
    setIsCopyButton,
  };

  return (
    <ReferralsInstructionsView
      mainProps={mainProps}
      handleCopyTextButton={handleCopyTextButton}
      widget={widget}
    />
  );
};

ReferralsInstructions.propTypes = {
  authUserName: PropTypes.string,
  isBlackListUser: PropTypes.bool,
  getUserInBlackList: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  confirmRules: PropTypes.func,
  rejectRules: PropTypes.func,
  userReferralInfo: PropTypes.func,
  referralStatus: PropTypes.string.isRequired,
  isStartChangeRules: PropTypes.bool,
  isStartGetReferralInfo: PropTypes.bool,
};

ReferralsInstructions.defaultProps = {
  authUserName: '',
  isBlackListUser: false,
  isGuest: false,
  confirmRules: () => {},
  rejectRules: () => {},
  userReferralInfo: () => {},
  isStartChangeRules: false,
  isStartGetReferralInfo: false,
};

const mapStateToProps = state => ({
  authUserName: getAuthenticatedUserName(state),
  isAuthenticated: getIsAuthenticated(state),
  isBlackListUser: getIsUserInWaivioBlackList(state),
  isGuest: isGuestUser(state),
  referralStatus: getReferralStatus(state),
  isStartChangeRules: getIsStartChangeRules(state),
  isStartGetReferralInfo: getIsStartGetReferralInfo(state),
});

export default connect(mapStateToProps, {
  getUserInBlackList: getIsUserInBlackList,
  confirmRules: referralConfirmRules,
  rejectRules: referralRejectRules,
  userReferralInfo: getUserReferralInfo,
})(injectIntl(ReferralsInstructions));
