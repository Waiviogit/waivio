import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Checkbox, Modal } from 'antd';

import { getAuthenticatedUserName, getIsUserInWaivioBlackList } from '../../../reducers';
import { getIsUserInBlackList } from '../../rewardsActions';
import { referralInstructionsContent } from '../ReferralTextHelper';

import './ReferralsInstructions.less';

const ReferralsInstructions = props => {
  const { authUserName, getUserInBlackList, isBlackListUser } = props;
  const [isAcceptedTerms, setIsAcceptedTerms] = useState(false);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    getUserInBlackList(authUserName);
  }, []);

  const handleAgreeRulesCheckbox = () => {
    setIsAcceptedTerms(prevState => {
      if (prevState !== false) {
        setIsModal(!isModal);
      }
      return !isAcceptedTerms;
    });
  };

  const handleOkButton = () => {
    setIsModal(prevState => {
      if (prevState !== true) {
        setIsAcceptedTerms(!isAcceptedTerms);
      }
      return !isModal;
    });
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
  } = referralInstructionsContent(data);

  return (
    <div className="ReferralInstructions">
      <h2 className="ReferralInstructions__title">{instructionsTitle}</h2>
      {isBlackListUser ? (
        <div className="ReferralInstructions__is-blacklist">{instructionsBlackListContent}</div>
      ) : (
        <div className="ReferralInstructions__description">{instructionsDescription}</div>
      )}

      <div>
        <Modal
          title="Basic Modal"
          visible={isModal}
          onOk={() => handleOkButton()}
          onCancel={() => setIsModal(!isModal)}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>

      <div className="ReferralInstructions__wrap-conditions">
        <Checkbox onChange={() => handleAgreeRulesCheckbox()} />
        <div className="ReferralInstructions__wrap-conditions__condition-content">
          <div className="ReferralInstructions__wrap-conditions__condition-content__star-flag">
            *
          </div>
          {instructionsConditions}
        </div>
      </div>

      {isAcceptedTerms && (
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

          {/* <div className="ReferralInstructions__accepted-conditions__widget"></div> */}

          <div className="ReferralInstructions__accepted-conditions__an-example">
            {acceptedConditionsWidgetExample}
          </div>

          <div className="ReferralInstructions__accepted-conditions__alert">
            {acceptedConditionsAlert}
          </div>
        </div>
      )}
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
