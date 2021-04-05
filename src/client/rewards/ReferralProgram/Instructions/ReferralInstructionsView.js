import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Icon, Modal, Tooltip } from 'antd';
import { referralInstructionsContent } from '../ReferralTextHelper';
import Loading from '../../../components/Icon/Loading';

const ReferralsInstructionsView = ({ mainProps, handleCopyTextButton, widget }) => {
  const {
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

  const handleOnOk = () => {
    rejectRules(authUserName, isGuest);

    return handleClickOnCheckbox();
  };

  return (
    isAuthenticated && (
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
            onOk={handleOnOk}
            onCancel={() => handleClickOnCheckbox()}
          >
            <p>{terminateReferralInfo}</p>
          </Modal>
        </div>
        <div className="ReferralInstructions__wrap-conditions">
          <Checkbox checked={currentStatus} id="agreeButton" onChange={handleAgreeRulesCheckbox} />
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
            <div className="ReferralInstructions__text-wrap">
              <div className="ReferralInstructions__text-wrap__title">
                {acceptedConditionsTitleDirect}
              </div>

              <div className="ReferralInstructions__text-wrap__links">
                {acceptedConditionsExamplesLinks}
                {acceptedConditionsForExample}
                {acceptedConditionsFirstExampleLink}
                {acceptedConditionsSecondExampleLink}
              </div>
            </div>

            <div className="ReferralInstructions__widget-title">
              {acceptedConditionsTitleWidget}
            </div>

            <div className="ReferralInstructions__widget-info">{acceptedConditionsWidgetInfo}</div>

            <div className="ReferralInstructions__widget">
              {widget(authUserName)}
              <div className="ReferralInstructions__widget__copy-icon">
                <Tooltip title={currentCopyText}>
                  <span>
                    <Icon
                      onClick={() => handleCopyTextButton(setIsCopyButton, authUserName)}
                      type="copy"
                    />
                  </span>
                </Tooltip>
              </div>
            </div>

            <div className="ReferralInstructions__an-example">
              {acceptedConditionsWidgetExample}
            </div>

            <div className="ReferralInstructions__alert">{acceptedConditionsAlert}</div>
          </div>
        )}
      </div>
    )
  );
};

ReferralsInstructionsView.propTypes = {
  mainProps: PropTypes.shape({
    isBlackListUser: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    rejectRules: PropTypes.func,
    isStartChangeRules: PropTypes.bool,
    isStartGetReferralInfo: PropTypes.bool,
    handleAgreeRulesCheckbox: PropTypes.func,
    handleClickOnCheckbox: PropTypes.func,
    currentCopyText: PropTypes.string,
    authUserName: PropTypes.string,
    isModal: PropTypes.bool,
    isGuest: PropTypes.bool,
    currentStatus: PropTypes.bool,
    setIsCopyButton: PropTypes.func,
  }),
  handleCopyTextButton: PropTypes.func,
  widget: PropTypes.func,
};

ReferralsInstructionsView.defaultProps = {
  mainProps: PropTypes.shape({
    isBlackListUser: false,
    isAuthenticated: false,
    rejectRules: () => {},
    isStartChangeRules: false,
    isStartGetReferralInfo: false,
    handleAgreeRulesCheckbox: () => {},
    handleClickOnCheckbox: () => {},
    currentCopyText: '',
    authUserName: '',
    isModal: false,
    isGuest: false,
    currentStatus: false,
    setIsCopyButton: () => {},
  }),
  handleCopyTextButton: () => {},
  widget: () => {},
};

export default ReferralsInstructionsView;
