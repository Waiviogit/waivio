import React from 'react';
import { Checkbox, Icon, Modal, Tooltip } from 'antd';
import { referralInstructionsContent } from '../ReferralTextHelper';
import Loading from '../../../components/Icon/Loading';

const ReferralsInstructionsView = (mainProps, handleCopyTextButton, widget) => {
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
          {(isStartChangeRules || isStartGetReferralInfo) && (
            <div className="ReferralInstructions__wrap-conditions__loader">
              <Loading />
            </div>
          )}
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

export default ReferralsInstructionsView;
