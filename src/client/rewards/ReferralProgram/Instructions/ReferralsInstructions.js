import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Checkbox, Modal, Icon, Tooltip } from 'antd';
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
import Loading from '../../../components/Icon/Loading';

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

const ReferralsInstructionsView = mainProps => {
  const {
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
  } = mainProps;

  const {
    instructionsTitle,
    instructionsBlackListContent,
    instructionsDescription,
    instructionsConditions,
    acceptedConditionsTitleDirect,
    acceptedConditionsExamplesLinks,
    acceptedConditionsForExample,
    acceptedConditionsFirstExampleLink,
    acceptedConditionsSecondExampleLink,
    acceptedConditionsTitleWidget,
    acceptedConditionsWidgetInfo,
    acceptedConditionsWidgetExample,
    acceptedConditionsAlert,
    terminateReferralTitle,
    terminateReferralInfo,
  } = referralInstructionsContent(authUserName);

  return (
    <React.Fragment>
      {isAuthenticated && (
        <div className="ReferralInstructions">
          <h2 className="ReferralInstructions__title">{instructionsTitle}</h2>
          {isBlackListUser ? (
            <div className="ReferralInstructions__is-blacklist">{instructionsBlackListContent}</div>
          ) : (
            <div className="ReferralInstructions__description">{instructionsDescription}</div>
          )}

          <div>
            <Modal
              title={terminateReferralTitle}
              visible={isModal}
              onOk={() => {
                rejectRules(authUserName, isGuest);
                return handleOkButton();
              }}
              onCancel={() => handleCancelButton()}
            >
              <p>{terminateReferralInfo}</p>
            </Modal>
          </div>

          <div className="ReferralInstructions__wrap-conditions">
            <Checkbox
              checked={currentStatus}
              id="agreeButton"
              onChange={() => handleAgreeRulesCheckbox()}
            />
            <label
              htmlFor="agreeButton"
              className="ReferralInstructions__wrap-conditions__condition-content"
            >
              <div className="ReferralInstructions__wrap-conditions__condition-content__star-flag">
                *
              </div>
              {instructionsConditions}
            </label>
          </div>
          {isStartChangeRules ||
            (isStartGetReferralInfo && (
              <div className="ReferralInstructions__wrap-conditions__loader">
                <Loading />
              </div>
            ))}
          {currentStatus && (
            <div className="ReferralInstructions__accepted-conditions">
              <div className="ReferralInstructions__accepted-conditions__text-wrap">
                <div className="ReferralInstructions__accepted-conditions__text-wrap__title">
                  {acceptedConditionsTitleDirect}
                </div>

                <div className="ReferralInstructions__accepted-conditions__text-wrap__links">
                  {acceptedConditionsExamplesLinks}
                  {acceptedConditionsForExample}
                  {acceptedConditionsFirstExampleLink}
                  {acceptedConditionsSecondExampleLink}
                </div>
              </div>

              <div className="ReferralInstructions__accepted-conditions__widget-title">
                {acceptedConditionsTitleWidget}
              </div>

              <div className="ReferralInstructions__accepted-conditions__widget-info">
                {acceptedConditionsWidgetInfo}
              </div>

              <div className="ReferralInstructions__accepted-conditions__widget">
                {widget}
                <div className="ReferralInstructions__accepted-conditions__widget__copy-icon">
                  <Tooltip title={currentCopyText}>
                    <span>
                      <Icon onClick={() => handleCopyTextButton(setIsCopyButton)} type="copy" />
                    </span>
                  </Tooltip>
                </div>
              </div>

              <div className="ReferralInstructions__accepted-conditions__an-example">
                {acceptedConditionsWidgetExample}
              </div>

              <div className="ReferralInstructions__accepted-conditions__alert">
                {acceptedConditionsAlert}
              </div>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
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

  return ReferralsInstructionsView(mainProps);
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
