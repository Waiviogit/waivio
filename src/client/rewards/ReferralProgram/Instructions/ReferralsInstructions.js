import { useEffect, useState } from 'react';
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

import './ReferralsInstructions.less';

const widget = `<iframe class="waivio" src="https://waivio.com?ref=[username]" height="400" width="350" style="border: none;">Can't load Rewards widget.</iframe>`;

const handleCopyTextButton = setIsCopyButton => {
  const reservoir = document.createElement('textarea');
  reservoir.value = widget;
  document.body.appendChild(reservoir);
  reservoir.select();
  document.execCommand('copy');
  document.body.removeChild(reservoir);

  return setIsCopyButton(true);
};

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
    if (currentStatus === true && isModal === false) {
      setIsModal(true);
    }
    if (currentStatus !== true) {
      return confirmRules(authUserName, isGuest);
    }
    return null;
  };

  const handleOkButton = () => {
    if (isModal === true) {
      setIsModal(false);
    }
  };

  const handleCancelButton = () => {
    if (isModal === true) {
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
    handleOkButton,
    handleCancelButton,
    currentCopyText,
    authUserName,
    isModal,
    isGuest,
    currentStatus,
    setIsCopyButton,
  };

  return ReferralsInstructionsView(mainProps, handleCopyTextButton, widget);
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
