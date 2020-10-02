import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Checkbox, Modal, Icon, Tooltip } from 'antd';

import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsUserInWaivioBlackList,
} from '../../../reducers';
import { getIsUserInBlackList } from '../../rewardsActions';
import { referralInstructionsContent } from '../ReferralTextHelper';

import './ReferralsInstructions.less';

const widget = () =>
  `<iframe class="waivio" src="https://waivio.com?ref=[username]" height="400" width="350" style="border: none;">Can't load Rewards widget.</iframe>`;

const handleCopyTextButton = setIsCopyButton => {
  const widgetText = widget();
  const reservoir = document.createElement('textarea');
  reservoir.value = widgetText;
  document.body.appendChild(reservoir);
  reservoir.select();
  document.execCommand('copy');
  document.body.removeChild(reservoir);

  return setIsCopyButton(true);
};

const ReferralsInstructions = props => {
  const { authUserName, getUserInBlackList, isBlackListUser, isAuthenticated } = props;
  const [isModal, setIsModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isCopyButton, setIsCopyButton] = useState(false);

  useEffect(() => {
    console.log(isConfirmModal);
    getUserInBlackList(authUserName);
  }, []);

  const handleAgreeRulesCheckbox = () => {
    if (isChecked === true && isModal === false) {
      setIsModal(true);
    }
  };

  const handleOkButton = () => {
    if (isModal === true) {
      setIsModal(false);
      setIsChecked(false);
      setIsConfirmModal(true);
    }
  };

  const handleCancelButton = () => {
    if (isModal === true) {
      setIsModal(false);
      setIsChecked(true);
      setIsConfirmModal(false);
    }
  };

  const data = {
    username: authUserName,
  };

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
    copyButtonText,
    copyButtonCopiedText,
  } = referralInstructionsContent(data);

  const currentCopyText = isCopyButton ? copyButtonCopiedText : copyButtonText;
  setTimeout(() => setIsCopyButton(false), 3000);

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
              onOk={() => handleOkButton()}
              onCancel={() => handleCancelButton()}
            >
              <p>{terminateReferralInfo}</p>
            </Modal>
          </div>

          <div className="ReferralInstructions__wrap-conditions">
            <Checkbox
              checked={isChecked}
              id="agreeButton"
              onChange={() => {
                setIsChecked(prevState => {
                  if (prevState === false) {
                    return true;
                  }
                  return handleAgreeRulesCheckbox();
                });
              }}
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

          {isChecked && (
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
                {widget()}
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

ReferralsInstructions.propTypes = {
  authUserName: PropTypes.string,
  isBlackListUser: PropTypes.bool,
  getUserInBlackList: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

ReferralsInstructions.defaultProps = {
  authUserName: '',
  isBlackListUser: false,
};

const mapStateToProps = state => ({
  authUserName: getAuthenticatedUserName(state),
  isAuthenticated: getIsAuthenticated(state),
  isBlackListUser: getIsUserInWaivioBlackList(state),
});

export default injectIntl(
  connect(mapStateToProps, {
    getUserInBlackList: getIsUserInBlackList,
  })(ReferralsInstructions),
);
